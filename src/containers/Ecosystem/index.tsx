import { EcosystemCardList } from 'components/cardList'
import { PageLayoutStyle } from 'containers/styles'
import { useFetchItems } from 'hooks/UseFetchItems'
import React from 'react'
import { ECOSYSTEM_LIST } from 'util/constant'

const Ecosystem = () => {
  const { items, types, loading } = useFetchItems(ECOSYSTEM_LIST)

  if (loading) {
    return (
      <PageLayoutStyle>
        <div>Please wait a moment...</div>
      </PageLayoutStyle>
    )
  }

  return (
    <PageLayoutStyle>
      <EcosystemCardList items={items} types={types} />
    </PageLayoutStyle>
  )
}

export default Ecosystem
