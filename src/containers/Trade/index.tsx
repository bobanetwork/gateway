import Tooltip from 'components/tooltip/Tooltip'
import { useFetchItems } from 'hooks/UseFetchItems'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectTheme } from 'selectors'
import { TRADE_LIST } from 'util/constant'
import { getEcoImage } from 'util/gitdata'
import {
  Card,
  CardList,
  Description,
  PageContainer,
  PlaceholderImage,
  Title,
} from './styles'

const TradeCard = ({ name, description, icon, website }) => {
  const theme = useSelector(selectTheme)
  const iconImage = getEcoImage(theme === 'light' ? icon.light : icon.dark)
  return (
    <Card>
      <PlaceholderImage>
        <img src={iconImage} alt={name} width="100%" />
      </PlaceholderImage>
      <Title href={website}>{name}</Title>
      <Tooltip title={description}>
        <Description>{description}</Description>
      </Tooltip>
    </Card>
  )
}

const Trade = () => {
  const { items, loading } = useFetchItems(TRADE_LIST)
  if (loading) {
    return (
      <PageContainer>
        <div>Please wait a moment...</div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <CardList>
        {items.map(
          (item: any, index) =>
            item.visible && <TradeCard key={index} {...item} />
        )}
      </CardList>
    </PageContainer>
  )
}

export default Trade
