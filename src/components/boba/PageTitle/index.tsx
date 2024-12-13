import { Text } from '@/components/ui'
import { useLocation } from 'react-router-dom'
import { titleData } from './data'

const PageTitle = () => {

  const location = useLocation()
  const currentPath = location.pathname

  const { title, slug } = titleData.find(
    (page) => page.path === currentPath.toLowerCase()
  ) || {}

  if (!title && !slug) {
    return <></>
  }

  return (
    <div className="flex flex-col justify-start items-center gap-2 py-4">
      <Text variant="3xl" fontWeight="bold">{title}</Text>
      <Text variant="sm" className="text-center">{slug}</Text>
    </div>
  )
}

export default PageTitle