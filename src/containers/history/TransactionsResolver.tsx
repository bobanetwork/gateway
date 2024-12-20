import { Svg } from 'components/global/svg'
import { TransactionsTableContent } from 'components/global/table/themes'
import { TokenInfo } from 'containers/history/tokenInfo'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { getCoinImage } from 'util/gitdata'
import { formatDate, isSameOrAfterDate, isSameOrBeforeDate } from 'util/dates'
import { ALL_NETWORKS, Chains } from './constants'

import { setReenterWithdrawalConfig } from 'actions/bridgeAction'
import { openModal } from 'actions/uiAction'
import bobaLogo from 'assets/images/Boba_Logo_White_Circle.png'
import noHistoryIcon from 'assets/images/noHistory.svg'
import { Button } from 'components/global'
import { useDispatch } from 'react-redux'
import truncate from 'truncate-middle'
import { logAmount } from 'util/amountConvert'
import { orderBy, uniqBy } from 'util/lodash'
import {
  Icon,
  IconContainer,
  Image,
  IncompleteTransactionHash,
  NoAction,
  NoHistory,
  Status,
  TransactionAmount,
  TransactionChain,
  TransactionChainDetails,
  TransactionDate,
  TransactionDetails,
  TransactionHash,
  TransactionsWrapper,
  TransactionToken,
} from './styles'
import {
  IProcessedTransaction,
  ITransaction,
  ITransactionsResolverProps,
  LAYER,
  TRANSACTION_FILTER_STATUS,
  TRANSACTION_STATUS,
} from './types'
import { useNetworkInfo } from 'hooks/useNetworkInfo'

export const TransactionsResolver: React.FC<ITransactionsResolverProps> = ({
  transactions,
  transactionsFilter,
  loading = false,
}) => {
  const dispatch = useDispatch<any>()
  const { isActiveNetworkBnb, isActiveNetworkBnbTestnet } = useNetworkInfo()
  const [currentTransactions, setCurrentTransactions] = useState<
    ITransaction[]
  >([])

  useEffect(() => {
    setCurrentTransactions(transactions)
  }, [transactions])

  const orderedTransactions = orderBy(
    currentTransactions,
    (i) => i.timeStamp,
    'desc'
  )

  const dateFilter = (transaction: ITransaction) => {
    const txnAfterStartDate = transactionsFilter.startDate
      ? isSameOrAfterDate(
          transaction.timeStamp,
          dayjs(transactionsFilter.startDate)
        )
      : true
    const txnBeforeEndDate = transactionsFilter.endDate
      ? isSameOrBeforeDate(
          transaction.timeStamp,
          dayjs(transactionsFilter.endDate)
        )
      : true

    return txnAfterStartDate && txnBeforeEndDate
  }

  // should filter out transactions that aren't cross domain
  const crossDomainFilter = (transaction: ITransaction) => {
    return (
      (transaction.crossDomainMessage &&
        transaction.crossDomainMessage.crossDomainMessage) ||
      transaction.isTeleportation
    )
  }

  const networkFilter = (transaction: ITransaction) => {
    let targetFromNetwork = false
    let targetToNetwork = false
    switch (transactionsFilter.fromNetworkChainId) {
      case ALL_NETWORKS.value: {
        targetFromNetwork = true
        break
      }
      case transaction.originChainId.toString(): {
        targetFromNetwork = true
        break
      }
    }
    switch (transactionsFilter.toNetworkChainId) {
      case ALL_NETWORKS.value: {
        targetToNetwork = true
        break
      }
      case transaction.destinationChainId.toString(): {
        targetToNetwork = true
        break
      }
    }
    return targetFromNetwork && targetToNetwork
  }
  const getTransactionStatus = (transaction: ITransaction) => {
    if (
      transaction.isTeleportation ||
      (transaction.action &&
        transaction.crossDomainMessage.crossDomainMessageSendTime)
    ) {
      switch (transaction.action.status) {
        case TRANSACTION_STATUS.WithdrawFinalized:
        case TRANSACTION_STATUS.Succeeded: {
          return TRANSACTION_FILTER_STATUS.Completed
        }
        case TRANSACTION_STATUS.WithdrawInitiated:
        case TRANSACTION_STATUS.WithdrawProven:
        case TRANSACTION_STATUS.Pending: {
          return TRANSACTION_FILTER_STATUS.Pending
        }
      }
    }
    return TRANSACTION_FILTER_STATUS.Canceled
  }
  const statusFilter = (transaction: ITransaction) => {
    const userFacingStatus = getTransactionStatus(transaction)
    if (
      transactionsFilter.status &&
      transactionsFilter.status !== TRANSACTION_FILTER_STATUS.All
    ) {
      return transactionsFilter.status === userFacingStatus
    }

    return true
  }

  // filter out transactions whose hash does not match
  const hashFilter = (transaction: IProcessedTransaction) => {
    if (transactionsFilter.targetHash) {
      if (
        !transaction.fromHash.includes(transactionsFilter.targetHash) &&
        !transaction.toHash.includes(transactionsFilter.targetHash)
      ) {
        return false
      }
    }
    return true
  }
  // const filteredTransactions = orderedTransactions
  const filteredTransactions = uniqBy(
    [...orderedTransactions].filter((transaction) => {
      return (
        crossDomainFilter(transaction) &&
        networkFilter(transaction) &&
        statusFilter(transaction) &&
        dateFilter(transaction)
      )
    }),
    'hash'
  )

  const process_transaction = (transaction: ITransaction) => {
    const chain = transaction.layer === 'L1pending' ? 'L1' : transaction.layer

    // TODO: have a unknown token to use
    let token = {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    }

    if (isActiveNetworkBnb || isActiveNetworkBnbTestnet) {
      token = {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      }
    }

    if (
      TokenInfo[transaction.originChainId.toString()]?.[
        transaction?.action?.token?.toLowerCase()
      ]
    ) {
      token =
        TokenInfo[transaction.originChainId.toString()]?.[
          transaction?.action?.token?.toLowerCase()
        ]
    }

    const symbol = token.symbol

    const amountString = logAmount(transaction.action.amount, token.decimals, 4)
    let fromHash = transaction.hash ?? transaction.crossDomainMessage.fromHash
    let toHash = transaction.crossDomainMessage.toHash ?? ''

    // handling for the deposit anchorage
    if (chain === LAYER.L2.toLowerCase() && !transaction.isTeleportation) {
      fromHash = ''
      toHash = transaction.hash
    }

    if (
      !toHash &&
      chain === LAYER.L2 &&
      transaction.crossDomainMessage.l1Hash
    ) {
      toHash = transaction.crossDomainMessage.l1Hash
    } else if (
      !toHash &&
      chain === LAYER.L1 &&
      transaction.crossDomainMessage.l2Hash
    ) {
      toHash = transaction.crossDomainMessage.l2Hash
    }

    const status = getTransactionStatus(transaction)

    const processedTransaction: IProcessedTransaction = {
      timeStamp: transaction.timeStamp,
      from: transaction.from,
      fromHash,
      toHash,
      status,
      to: transaction.to,
      tokenSymbol: symbol,
      amount: amountString,
      originChainId: transaction.originChainId,
      destinationChainId: transaction.destinationChainId,
      actionRequired: transaction.actionRequired,
    }
    return processedTransaction
  }

  const processedTransactions = filteredTransactions.map((transaction) => {
    return process_transaction(transaction)
  })

  const filteredProcessedTransactions = processedTransactions.filter(
    (transaction) => {
      return hashFilter(transaction)
    }
  )

  const getTransactionToken = (symbol: string) => {
    return (
      <TransactionToken>
        <IconContainer>
          {symbol === 'BOBA' ? (
            <Image src={bobaLogo} alt="boba network" />
          ) : (
            <Icon src={getCoinImage(symbol)} />
          )}
        </IconContainer>
        <div>{symbol}</div>
      </TransactionToken>
    )
  }

  const getTransactionChain = (
    chainID: string,
    hash: string,
    status: string
  ) => {
    const linkToHash = `${Chains[chainID]?.transactionUrlPrefix}${hash}`
    const networkName = Chains[chainID]?.name
    const imgSrc = Chains[chainID]?.imgSrc

    return (
      <TransactionDetails>
        <IconContainer>
          <Icon src={imgSrc} />
        </IconContainer>
        <TransactionChainDetails>
          <TransactionChain>{networkName}</TransactionChain>
          {hash && (
            <TransactionHash
              href={linkToHash}
              target={'_blank'}
              rel="noopener noreferrer"
            >
              {`Tx: ${truncate(hash, 4, 4, '...')}`}
            </TransactionHash>
          )}
          {!hash && (
            <IncompleteTransactionHash>{`Tx: ${status}`}</IncompleteTransactionHash>
          )}
        </TransactionChainDetails>
      </TransactionDetails>
    )
  }

  const getTransactionDate = (timeStamp: number) => {
    return (
      <TransactionDate>
        {formatDate(timeStamp, 'DD MMM YYYY hh:mm A')}
      </TransactionDate>
    )
  }

  const getTransactionAmount = (amount: string) => {
    return amount ? (
      <TransactionAmount>{amount}</TransactionAmount>
    ) : (
      <TransactionAmount>Not Available</TransactionAmount>
    )
  }

  const handleAction = (transaction: any) => {
    switch (transaction.actionRequired.type) {
      case 'reenterWithdraw': {
        dispatch(setReenterWithdrawalConfig(transaction.actionRequired))
        dispatch(
          openModal({ modal: 'bridgeMultiStepWithdrawal', isNewTx: false })
        )
      }
    }
  }

  return (
    <>
      {transactions.length === 0 && (
        <NoHistory>
          <Svg src={noHistoryIcon} />
          <div>Transactions Loading...</div>
        </NoHistory>
      )}
      {filteredProcessedTransactions && (
        <TransactionsWrapper>
          {filteredProcessedTransactions.map(
            (transaction: IProcessedTransaction, index) => {
              return (
                <TransactionsTableContent
                  key={`transaction-${index}`}
                  options={[
                    {
                      content: getTransactionDate(transaction.timeStamp),
                      width: 168,
                    },
                    {
                      content: getTransactionChain(
                        transaction.originChainId.toString(),
                        transaction.fromHash,
                        transaction.status
                      ),
                      width: 142,
                    },
                    {
                      content: getTransactionChain(
                        transaction.destinationChainId.toString(),
                        transaction.toHash,
                        transaction.status
                      ),
                      width: 142,
                    },
                    {
                      content: getTransactionToken(transaction.tokenSymbol),
                      width: 90,
                    },
                    {
                      content: getTransactionAmount(transaction.amount),
                      width: 80,
                    },
                    {
                      content: <Status>{transaction.status}</Status>,
                      width: 80,
                    },
                    {
                      content: transaction.actionRequired ? (
                        <Button
                          label="Continue"
                          small
                          onClick={() => handleAction(transaction)}
                        />
                      ) : (
                        <NoAction>-</NoAction>
                      ),
                      width: 88,
                    },
                  ]}
                />
              )
            }
          )}
        </TransactionsWrapper>
      )}

      {filteredProcessedTransactions.length === 0 &&
        transactions.length !== 0 &&
        !loading && (
          <NoHistory>
            <Svg src={noHistoryIcon} />
            <div>No Transactions Matching Filter.</div>
          </NoHistory>
        )}
    </>
  )
}
