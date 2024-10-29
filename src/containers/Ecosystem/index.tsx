import Tooltip from 'components/tooltip/Tooltip'
import { useFetchItems } from 'hooks/UseFetchItems'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectTheme } from 'selectors'
import { ECOSYSTEM_LIST } from 'util/constant'
import { getEcoImage } from 'util/gitdata'
import {
  Card,
  CardList,
  Description,
  ExternalIcon,
  OutlineButton,
  PageContainer,
  PlaceholderImage,
  Title,
} from './styles'
import externalSvg from 'assets/external.svg'

const EcosystemCard = ({ name, description, icon, link }) => {
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

const Ecosystem = () => {
  const { items, types, loading } = useFetchItems(ECOSYSTEM_LIST)
  const [selectedType, setType] = useState('all')

  if (loading) {
    return (
      <PageContainer>
        <div>Please wait a moment...</div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
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
              item.visible && (
                <EcosystemCard key={item.name || index} {...item} />
              )
          )}
      </CardList>
    </PageContainer>
  )
}

export default Ecosystem
