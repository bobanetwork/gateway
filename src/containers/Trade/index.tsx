import { TradeCardList } from 'components/cardList'
import { PageLayoutStyle } from 'containers/styles'
import { useFetchItems } from 'hooks/UseFetchItems'
import React from 'react'
import { TRADE_LIST } from 'util/constant'

const Trade = () => {
  const { items, loading } = useFetchItems(TRADE_LIST)
  if (loading) {
    return (
      <PageLayoutStyle>
        <div>Please wait a moment...</div>
      </PageLayoutStyle>
    )
  }

  return (
    <PageLayoutStyle>
      <TradeCardList items={items} />
    </PageLayoutStyle>
  )
}

export default Trade
