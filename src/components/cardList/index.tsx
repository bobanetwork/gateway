import React from 'react'
import { useSelector } from 'react-redux'
import { selectTheme } from 'selectors'
import { getEcoImage } from 'util/gitdata'
import {
  PlaceholderImage,
  ExternalIcon,
  Card,
  Title,
  Description,
  CardList,
} from './styles'
import Tooltip from 'components/tooltip/Tooltip'
import externalSvg from 'assets/external.svg'

export const TradeCard = ({ name, description, icon, link }) => {
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

export const TradeCardList = ({ items }: any) => {
  return (
    <CardList>
      {items.map(
        (item: any, index) =>
          item.visible && (
            <TradeCard
              key={`${item.name}-${item.pairName}` || index}
              {...item}
              description={item.pairName}
            />
          )
      )}
    </CardList>
  )
}
