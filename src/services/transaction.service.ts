import omgxWatcherAxiosInstance from 'api/omgxWatcherAxios'
import { TRANSACTION_STATUS } from 'containers/history/types'
import { Contract, ethers, providers } from 'ethers'
import { BobaChains } from '@bobanetwork/light-bridge-chains'
import { ethereumConfig } from 'util/network/config/ethereum'
import {
  AllNetworkConfigs,
  CHAIN_ID_LIST,
  getRpcUrlByChainId,
} from 'util/network/network.util'
import {
  LightBridgeAssetReceivedEvent,
  LightBridgeDisbursementEvents,
  anchorageGraphQLService,
  lightBridgeGraphQLService,
} from '@bobanetwork/graphql-utils'
import networkService from './networkService'
import { NetworkDetailChainConfig } from '../util/network/config/network-details.types'

interface ICrossDomainMessage {
  crossDomainMessage?: string
  crossDomainMessageEstimateFinalizedTime: number
  crossDomainMessageFinalize: string
  crossDomainMessageSendTime: string
  fromHash: string
  toHash?: string
}

class TransactionService {
  async getSevens(networkConfig = networkService.networkConfig) {
    const response = await omgxWatcherAxiosInstance(networkConfig).get(
      'get.l2.pendingexits'
    )

    if (response.status === 201) {
      const data = response.data
      return data.filter((i) => i.fastRelay === 0 && i.status === 'pending')
    } else {
      return []
    }
  }

  async fetchAnchorageTransactions(
    networkConfig = networkService.networkConfig
  ): Promise<any[]> {
    const address = await networkService.provider?.getSigner().getAddress()
    if (
      networkConfig?.L1.chainId !== ethereumConfig.Testnet.L1.chainId ||
      !address
    ) {
      return []
    }
    try {
      const withdrawalTransactions =
        await anchorageGraphQLService.queryWithdrawalTransactionsHistory(
          networkService.L1Provider,
          networkService.L2Provider,
          address,
          networkConfig!
        )

      const depositTransactions =
        await anchorageGraphQLService.queryDepositTransactions(
          networkService.L2Provider,
          address,
          networkConfig!
        )

      return [...depositTransactions, ...withdrawalTransactions]
    } catch (e) {
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

  // fetch L0 transactions
  async fetchL0Tx(networkConfig = networkService.networkConfig) {
    let L0Txs = []
    try {
      const responseL0 = await omgxWatcherAxiosInstance(networkConfig).post(
        'get.layerzero.transactions',
        {
          address: networkService.account,
          fromRange: 0,
          toRange: 1000,
        }
      )

      if (responseL0.status === 201) {
        L0Txs = responseL0.data.map((v) => ({
          ...v,
          hash: v.tx_hash,
          blockNumber: parseInt(v.block_number, 10),
          timeStamp: parseInt(v.timestamp, 10), //fix bug - sometimes this is string, sometimes an integer
          layer: 'L0',
          chainName: networkConfig!.L1.name,
          originChainId: networkConfig!.L1.chainId,
          altL1: true,
        }))
      }
      return L0Txs
    } catch (error) {
      console.log('TS: fetchL0Tx', error)
      return L0Txs
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

  /**
   * @getTransactions
   * loads L1Txs, l2Txs, l0Txs, L1PendingTxs
   *
   */
  async getTransactions(networkConfig = networkService.networkConfig) {
    const networksArray = Array.from(Object.values(AllNetworkConfigs))

    const networkConfigsArray = networksArray.flatMap((network) => {
      return [network.Testnet, network.Mainnet]
    })

    const allNetworksTransactions = await Promise.all(
      networkConfigsArray.flatMap((config) => {
        return [
          this.fetchAnchorageTransactions(config),
          this.fetchL2Tx(config),
          this.fetchL1PendingTx(config),
          this.fetchLightBridgeTransactions(config),
        ]
      })
    )

    /** @DEV additional network pairs that are cross L1-L2 configuration */
    for (const additionalNetworkConfig of this.lightbridgeAdditionalNetworkPairs()) {
      allNetworksTransactions.push(
        await this.fetchLightBridgeTransactions(additionalNetworkConfig)
      )
    }

    const filteredResults = allNetworksTransactions.reduce(
      (acc, res) => [...acc, ...res],
      []
    )

    return filteredResults.filter((transaction) => transaction?.hash)
  }

  async fetchLightBridgeTransactions(
    networkConfig: Partial<NetworkDetailChainConfig>
  ) {
    const contractL1 = networkService.getLightBridgeContract(
      networkConfig!.L1!.chainId
    )
    const contractL2 = networkService.getLightBridgeContract(
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

      let status = txReceipt?.status
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
          disburseTxReceipt.status === 1
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
      ).find(([address, tokenSymbol]) => {
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
                sendEvent.amount.toString(),
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
                  sendEvent.amount.toString(),
                  sendEvent.depositId
                )
              if (receiveEvent) {
                // check if successfully retried
                receiveEvent =
                  await lightBridgeGraphQLService.queryDisbursementRetrySuccessEvent(
                    networkService.account!,
                    sendEvent.sourceChainId,
                    sendEvent.toChainId,
                    sendEvent.amount.toString(),
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
