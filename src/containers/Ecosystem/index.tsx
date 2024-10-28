import React, { useEffect, useState } from 'react'
import {
  Card,
  CardList,
  Description,
  IconList,
  PageContainer,
  PlaceholderImage,
  Title,
} from './styles'
import { ECOSYSTEM_LIST } from 'util/constant'
import DiscordIcon from 'assets/icons/discord'
import DocsIcon from 'assets/icons/docs'
import TelegramIcon from 'assets/icons/telegram'
import TwitterIcon from 'assets/icons/twitter'

const EcosystemCard = ({ name, description, icon }) => {
  console.log(icon)
  return (
    <Card>
      <PlaceholderImage />
      <Title>{name}</Title>
      <IconList>
        <DocsIcon />
        <DiscordIcon />
        <TwitterIcon />
        <TelegramIcon />
      </IconList>
      <Description>{description}</Description>
    </Card>
  )
}

const Ecosystem = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(ECOSYSTEM_LIST)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setItems(data)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <PageContainer>
      <CardList>
        {items.map((item: any, index) => (
          <EcosystemCard key={index} {...item} />
        ))}
      </CardList>
    </PageContainer>
  )
}

export default Ecosystem
