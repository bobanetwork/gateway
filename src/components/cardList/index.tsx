import React, { useState } from 'react'
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
  OutlineButton,
} from './styles'
import Tooltip from 'components/tooltip/Tooltip'
import externalSvg from 'assets/external.svg'

export const CardItem = ({ name, description, icon, link }) => {
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
            <CardItem
              key={`${item.name}-${item.pairName}` || index}
              {...item}
              description={item.pairName}
            />
          )
      )}
    </CardList>
  )
}

export const EcosystemCardList = ({ items, types }) => {
  const [selectedType, setType] = useState('all')

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
        <OutlineButton
          className={`${'all' !== selectedType ? '' : 'active'}`}
          onClick={() => setType('all')}
        >
          All
        </OutlineButton>
        {types.filter(Boolean).map((type) => (
          <OutlineButton
            className={`${type.toLowerCase() !== selectedType ? '' : 'active'}`}
            onClick={() => setType(type.toLowerCase())}
            key={type}
          >
            {type}
          </OutlineButton>
        ))}
      </div>

      <CardList>
        {items
          .filter((c: any) =>
            selectedType === 'all'
              ? true
              : c.type.toLowerCase() === selectedType
          )
          .map(
            (item: any, index) =>
              item.visible && <CardItem key={item.name || index} {...item} />
          )}
      </CardList>
    </>
  )
}
