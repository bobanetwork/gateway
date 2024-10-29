import { useState, useEffect } from 'react'

export const useFetchItems = (url) => {
  const [items, setItems] = useState([])
  const [types, setTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const cacheKey = `items-cache-${url}`
      const cachedData = localStorage.getItem(cacheKey)
      const cacheTimestamp = localStorage.getItem(`${cacheKey}-timestamp`)

      const shouldFetch =
        !cachedData ||
        !cacheTimestamp ||
        Date.now() - Number(cacheTimestamp) > 24 * 60 * 60 * 1000 // 1 days

      if (shouldFetch) {
        try {
          const response = await fetch(url)
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          const data = await response.json()

          // Store data in localStorage with a timestamp
          localStorage.setItem(cacheKey, JSON.stringify(data))
          localStorage.setItem(`${cacheKey}-timestamp`, Date.now().toString())

          setItems(data)

          // Preload images
          data.forEach((item) => {
            if (item.icon.light) {
              const img = new Image()
              img.src = item.icon.light // Assuming 'image' is the field in your data
            }
            if (item.icon.dark) {
              const img = new Image()
              img.src = item.icon.dark // Assuming 'image' is the field in your data
            }
          })

          // Collect unique types
          const uniqueTypes = [...new Set(data.map((item) => item.type))] // Adjust 'type' based on your data structure
          setTypes(uniqueTypes)
        } catch (error: any) {
          setError(error.message)
        } finally {
          setLoading(false)
        }
      } else {
        // Use cached data
        const data = JSON.parse(cachedData)
        setItems(data)
        // Preload images from cache
        data.forEach((item) => {
          if (item.icon.light) {
            const img = new Image()
            img.src = item.icon.light // Assuming 'image' is the field in your data
          }
          if (item.icon.dark) {
            const img = new Image()
            img.src = item.icon.dark // Assuming 'image' is the field in your data
          }
        })
        // Collect unique types from cached data
        const uniqueTypes = [...new Set(data.map((item) => item.type))] // Adjust 'type' based on your data structure
        setTypes(uniqueTypes)
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { items, types, loading, error }
}
