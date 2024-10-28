import { useState, useEffect } from 'react'

export const useFetchItems = (url) => {
  const [items, setItems] = useState([])
  const [types, setTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setItems(data)

        // Collect unique types
        const uniqueTypes = [...new Set(data.map((item) => item.type))] // Adjust 'type' based on your data structure
        setTypes(uniqueTypes)
      } catch (error: any) {
        setError(error.message)
        throw new Error(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { items, types, loading, error }
}
