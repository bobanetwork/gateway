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
  ExternalIcon,
  PageContainer,
  PlaceholderImage,
  Title,
} from './styles'
import externalSvg from 'assets/external.svg'

const TradeCard = ({ name, description, icon, link }) => {
  const theme = useSelector(selectTheme)
  const iconImage = getEcoImage(theme === 'light' ? icon.dark : icon.light)
  return (
    <Card>
      <PlaceholderImage>
        <img src={iconImage} alt={name} width="100%" />
      </PlaceholderImage>
      <Title href={link} target="_blank" rel="noopener noreferrer">
        {name} <ExternalIcon src={externalSvg} />
      </Title>
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
            item.visible && <TradeCard key={item.name || index} {...item} />
        )}
      </CardList>
    </PageContainer>
  )
}

export default Trade
