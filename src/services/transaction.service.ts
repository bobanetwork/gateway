import {
  anchorageGraphQLService,
  LightBridgeAssetReceivedEvent,
  LightBridgeDisbursementEvents,
  lightBridgeGraphQLService,
} from '@bobanetwork/graphql-utils'
import { BobaChains } from '@bobanetwork/light-bridge-chains'
import omgxWatcherAxiosInstance from 'api/omgxWatcherAxios'
import { TRANSACTION_STATUS } from 'containers/history/types'
import { Contract, ethers, providers } from 'ethers'
import {
  AllNetworkConfigs,
  CHAIN_ID_LIST,
  getRpcUrlByChainId,
  Network,
  NetworkType,
} from 'util/network/network.util'
import { NetworkDetailChainConfig } from '../util/network/config/network-details.types'
import networkService from './networkService'
import { lightBridgeService } from './teleportation/teleportation.service'

interface ICrossDomainMessage {
  crossDomainMessage?: string
  crossDomainMessageEstimateFinalizedTime: number
  crossDomainMessageFinalize: string
  crossDomainMessageSendTime: string
  fromHash: string
  toHash?: string
}

class TransactionService {
  async fetchAnchorageTransactions(
    networkConfig = networkService.networkConfig,
    isActiveNetworkBnb = false
  ): Promise<any[]> {
    const address = await networkService.provider?.getSigner().getAddress()
    if (!address) {
      return []
    }
    try {
      const withdrawalTransactions =
        await anchorageGraphQLService.queryWithdrawalTransactionsHistory(
          networkService.L1Provider,
          networkService.L2Provider,
          address,
          networkConfig!,
          isActiveNetworkBnb
        )

      const depositTransactions =
        await anchorageGraphQLService.queryDepositTransactions(
          networkService.L2Provider,
          address,
          networkConfig!
        )
      return [...depositTransactions, ...withdrawalTransactions]
    } catch (e) {
      console.log(`Crash: Anchorage TX`, e)
      return []
    }
  }

  async fetchL2Tx(
    networkConfig = networkService.networkConfig
  ): Promise<any[]> {
    let L2Txs = []
    if (!networkConfig || !networkConfig['OMGX_WATCHER_URL']) {
      return L2Txs
    }
    try {
      const responseL2 = await omgxWatcherAxiosInstance(networkConfig)
        .post('get.l2.transactions', {
          address: networkService.account,
          fromRange: 0,
          toRange: 1000,
        })
        .catch((error) => {
          console.log('get l2 tx', error)
        })
      if (responseL2?.status === 201) {
        L2Txs = responseL2!.data.map((v: any) => ({
          ...v,
          layer: 'L2',
          chainName: networkConfig!.L2.name,
          originChainId: networkConfig!.L2.chainId,
          destinationChainId: networkConfig!.L1.chainId,
        }))
      }
      return L2Txs
    } catch (error) {
      console.log('TS: fetchL2Tx', error)
      return L2Txs
    }
  }

  // fetch L1 pending transactions
  async fetchL1PendingTx(networkConfig = networkService.networkConfig) {
    let txL1pending = []
    if (!networkConfig || !networkConfig['OMGX_WATCHER_URL']) {
      return txL1pending
    }
    try {
      const responseL1pending = await omgxWatcherAxiosInstance(
        networkConfig
      ).post('get.l1.transactions', {
        address: networkService.account,
        fromRange: 0,
        toRange: 1000,
      })

      if (responseL1pending.status === 201) {
        //add the chain: 'L1pending' field and chainName:  field
        txL1pending = responseL1pending.data.map((v) => ({
          ...v,
          layer: 'L1pending',
          chainName: networkConfig!.L1.name,
          originChainId: networkConfig!.L1.chainId,
          destinationChainId: networkConfig!.L2.chainId,
        }))
      }
      return txL1pending
    } catch (error) {
      console.log('TS: fetchL1PendingTx', error)
      return txL1pending
    }
  }

  async getTransactions() {
    try {
      console.log(`loading tx...`)
      // Flatten and gather network configs
      const networksArray = Array.from(Object.values(AllNetworkConfigs))
      const networkConfigsArray = networksArray.flatMap((network) => {
        return [network.Testnet, network.Mainnet]
      })

      const promiseCalls: Promise<any>[] = []
      const anchoragePromises: Promise<any>[] = []
      const watcherPromises: Promise<any>[] = []

      // Collect all promise calls in batches
      networkConfigsArray.forEach((config) => {
        if (networkService.network === Network.BNB) {
          if (networkService.networkType === NetworkType.TESTNET) {
            if (
              [97].includes(config.L1.chainId) ||
              [9728].includes(config.L2.chainId)
            ) {
              promiseCalls.push(this.fetchLightBridgeTransactions(config))
              anchoragePromises.push(
                this.fetchAnchorageTransactions(config, true)
              )
            }
          } else {
            if ([56].includes(config.L1.chainId)) {
              promiseCalls.push(this.fetchLightBridgeTransactions(config))
              watcherPromises.push(this.fetchL1PendingTx(config))
            }
            if ([56288].includes(config.L2.chainId)) {
              promiseCalls.push(this.fetchLightBridgeTransactions(config))
              watcherPromises.push(this.fetchL2Tx(config))
            }
          }
        } else if (networkService.network === Network.ETHEREUM) {
          if (networkService.networkType === NetworkType.TESTNET) {
            if (
              [11155111].includes(config.L1.chainId) ||
              [28882].includes(config.L2.chainId)
            ) {
              anchoragePromises.push(
                this.fetchAnchorageTransactions(config, false)
              )
              promiseCalls.push(this.fetchLightBridgeTransactions(config))
            }
          } else {
            if (
              [1].includes(config.L1.chainId) ||
              [288].includes(config.L2.chainId)
            ) {
              console.log(`fetching Mainnet Tx`)
              anchoragePromises.push(
                this.fetchAnchorageTransactions(config, false)
              )
              promiseCalls.push(this.fetchLightBridgeTransactions(config))
            }
          }
        }
      })

      if (networkService.networkType === NetworkType.MAINNET) {
        console.log(`loading supporting chain tx!`)
        // Add additional network pairs for LightBridge transactions
        const additionalNetworks = this.lightbridgeAdditionalNetworkPairs().map(
          (config) => this.fetchLightBridgeTransactions(config)
        )
        promiseCalls.push(...additionalNetworks)
      }
      // Execute all promise calls with batching
      const allNetworksTransactions = await Promise.all([
        ...promiseCalls,
        ...anchoragePromises,
        ...watcherPromises,
      ])

      const filteredResults = allNetworksTransactions.reduce(
        (acc, res) => [...acc, ...res],
        []
      )

      return filteredResults.filter((transaction) => transaction?.hash)
    } catch (error) {
      console.log(`error`, error)
    }
  }

  async fetchLightBridgeTransactions(
    networkConfig: Partial<NetworkDetailChainConfig>
  ) {
    const contractL1 = await lightBridgeService.getLightBridgeContract(
      networkConfig!.L1!.chainId
    )
    const contractL2 = await lightBridgeService.getLightBridgeContract(
      networkConfig!.L2!.chainId
    )

    const mapEventToTransaction = async (
      contract: Contract,
      sendEvent: LightBridgeAssetReceivedEvent,
      disburseEvent?: LightBridgeDisbursementEvents
    ) => {
      const txReceipt = await contract.provider.getTransactionReceipt(
        sendEvent.transactionHash_
      )
      let crossDomainMessageFinalize

      if (disburseEvent) {
        crossDomainMessageFinalize = disburseEvent.timestamp_
      }

      const crossDomainMessage: ICrossDomainMessage = {
        crossDomainMessage: disburseEvent?.depositId,
        crossDomainMessageEstimateFinalizedTime:
          crossDomainMessageFinalize ??
          parseInt(sendEvent.timestamp_, 10) + 180, // should never take longer than a few minutes
        crossDomainMessageFinalize,
        crossDomainMessageSendTime: sendEvent.timestamp_,
        fromHash: sendEvent.transactionHash_,
        toHash: undefined,
      }

      let status =
        txReceipt && txReceipt?.status
          ? TRANSACTION_STATUS.Pending
          : TRANSACTION_STATUS.Failed
      if (disburseEvent && status === TRANSACTION_STATUS.Pending) {
        const rpc = new providers.JsonRpcProvider(
          getRpcUrlByChainId(sendEvent.toChainId)
        )
        const disburseTxReceipt = await rpc.getTransactionReceipt(
          disburseEvent.transactionHash_
        )
        status =
          disburseTxReceipt && disburseTxReceipt.status === 1
            ? TRANSACTION_STATUS.Succeeded
            : TRANSACTION_STATUS.Failed
        if (
          status === TRANSACTION_STATUS.Succeeded &&
          disburseEvent.__typename === 'DisbursementFailed'
        ) {
          // won't go in here if already retried
          status = TRANSACTION_STATUS.Failed // TODO: but can be retried
        }

        crossDomainMessage.toHash = disburseEvent.transactionHash_
      }

      const action = {
        amount: sendEvent.amount?.toString(),
        sender: sendEvent.emitter,
        status,
        to: sendEvent.emitter,
        token: sendEvent.token,
      }
      const networkConfigForChainId = CHAIN_ID_LIST[sendEvent.sourceChainId]
      return {
        ...sendEvent,
        ...txReceipt,
        disburseEvent,
        timeStamp: sendEvent.timestamp_,
        layer: networkConfigForChainId.layer,
        chainName: networkConfigForChainId.name,
        originChainId: sendEvent.sourceChainId,
        destinationChainId: sendEvent.toChainId,
        UserFacingStatus: status,
        contractAddress: contract.address,
        hash: sendEvent.transactionHash_,
        crossDomainMessage,
        contractName: 'Teleportation',
        from: sendEvent.emitter,
        to: sendEvent.emitter,
        action,
        isTeleportation: true,
      }
    }

    const _getLightBridgeSupportedDestChainTokenAddrBySourceChainTokenAddr = (
      sourceChainTokenAddr: string,
      sourceChainId: string,
      destChainId: string
    ) => {
      const srcChainTokenSymbol =
        BobaChains[parseInt(sourceChainId, 10)].supportedAssets[
          sourceChainTokenAddr?.toLowerCase()
        ]

      const supportedAsset = Object.entries(
        BobaChains[parseInt(destChainId, 10)].supportedAssets
      ).find(([, tokenSymbol]) => {
        return tokenSymbol === srcChainTokenSymbol
      })
      if (!supportedAsset) {
        console.error(
          `Asset ${srcChainTokenSymbol} on chain destinationChain not configured but possibly supported on-chain`
        )
        return
      }
      return supportedAsset[0] // return only address
    }

    const getEventsForTeleportation = async (
      contract,
      sourceChainId,
      targetChainId
    ): Promise<any> => {
      if (contract) {
        let sentEvents: LightBridgeAssetReceivedEvent[] = []
        try {
          sentEvents = await lightBridgeGraphQLService.queryAssetReceivedEvent(
            sourceChainId,
            targetChainId,
            networkService.account!
          )
        } catch (err: any) {
          console.log(err?.message)
        }

        if (!sentEvents || !sentEvents?.length) {
          return []
        }
        return Promise.all(
          sentEvents.map(async (sendEvent) => {
            let receiveEvent: any =
              await lightBridgeGraphQLService.queryDisbursementSuccessEvent(
                networkService.account!,
                sendEvent.sourceChainId,
                sendEvent.toChainId,
                _getLightBridgeSupportedDestChainTokenAddrBySourceChainTokenAddr(
                  sendEvent.token,
                  sendEvent.sourceChainId,
                  sendEvent.toChainId
                ) ?? '0',
                sendEvent.depositId
              )
            if (
              !receiveEvent &&
              sendEvent.token === ethers.constants.AddressZero
            ) {
              // Native assets can fail and retried
              receiveEvent =
                await lightBridgeGraphQLService.queryDisbursementFailedEvent(
                  networkService.account!,
                  sendEvent.sourceChainId,
                  sendEvent.toChainId,
                  sendEvent.depositId
                )
              if (receiveEvent) {
                // check if successfully retried
                receiveEvent =
                  await lightBridgeGraphQLService.queryDisbursementRetrySuccessEvent(
                    networkService.account!,
                    sendEvent.sourceChainId,
                    sendEvent.toChainId,
                    sendEvent.depositId
                  )
              }
              if (receiveEvent) {
                // do in both cases, receiveEvent may still be undefined
                receiveEvent.token = ethers.constants.AddressZero
              }
            }
            return mapEventToTransaction(contract, sendEvent, receiveEvent)
          })
        )
      }
      return []
    }
    const L1Txs = await getEventsForTeleportation(
      contractL1,
      networkConfig!.L1!.chainId,
      networkConfig!.L2!.chainId
    )
    const L2Txs = await getEventsForTeleportation(
      contractL2,
      networkConfig!.L2!.chainId,
      networkConfig!.L1!.chainId
    )
    return [...L1Txs, ...L2Txs]
  }

  /** @DEV additional network pairs that are cross L1-L2 */
  private lightbridgeAdditionalNetworkPairs(): Partial<NetworkDetailChainConfig>[] {
    return [
      [42161, 288],
      [10, 288],
      [288, 56288],
      [56288, 288],
    ].map((p) => ({
      L1: {
        chainId: p[0],
      },
      L2: {
        chainId: p[1],
      },
    })) as Partial<NetworkDetailChainConfig>[]
  }
}

const transactionService = new TransactionService()

export default transactionService
