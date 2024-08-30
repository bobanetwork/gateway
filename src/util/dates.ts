import dayjs, { Dayjs } from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isBetween from 'dayjs/plugin/isBetween'
import 'dayjs/locale/en' // or the locale of your choice

dayjs.extend(localizedFormat)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)

type DateFormatType = (date: number, format?: string) => string
export const formatDate: DateFormatType = (
  date,
  format = 'MM/DD/YYYY hh:mm a'
) => {
  return dayjs.unix(date).format(format)
}

type IsSameAfterOrBeforeDateType = (dateA: number, dateB?: Dayjs) => boolean
export const isSameOrAfterDate: IsSameAfterOrBeforeDateType = (
  dateA,
  dateB
) => {
  return dayjs.unix(dateA).isSameOrAfter(dateB)
}

export const isSameOrBeforeDate: IsSameAfterOrBeforeDateType = (
  dateA,
  dateB
) => {
  if (!dateB) {
    return dayjs.unix(dateA).isSameOrBefore(dayjs())
  }
  return dayjs.unix(dateA).isSameOrBefore(dateB)
}

export const isBeforeDate: IsSameAfterOrBeforeDateType = (dateA, dateB) => {
  if (!dateB) {
    return dayjs.unix(dateA).isBefore(dayjs())
  }
  return dayjs.unix(dateA).isBefore(dateB)
}

export const addDaysToDate = (timestamp, day) => {
  return dayjs.unix(timestamp).add(day, 'day').unix()
}

export const diffBetweenTimeStamp = (time1: number, time2: number) => {
  const date1 = dayjs.unix(time1)
  const date2 = dayjs.unix(time2)
  return date1.diff(date2, 'seconds')
}

export const dayNowUnix = () => {
  return dayjs().unix()
}

export const formatDuration = (seconds) => {
  const totalMinutes = Math.floor(seconds / 60)
  const totalHours = Math.floor(totalMinutes / 60)
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  const minutes = totalMinutes % 60

  let result = ''

  if (days > 0) {
    result += `${days}day${days > 1 ? 's' : ''} `
  }
  if (hours > 0) {
    result += `${hours}hr `
  }
  if (minutes > 0) {
    result += `${minutes}min `
  }

  return result.trim()
}

export const formatDurationInDaysHrs = (seconds) => {
  const totalDays = seconds / (60 * 60 * 24)
  const days = Math.floor(totalDays)
  const hours = Math.round((totalDays - days) * 24)
  let result = ''

  if (days > 0) {
    result += `${days} day${days > 1 ? 's' : ''}`
  }
  if (hours > 0 || days === 0) {
    // Always show hours if there are no days
    result += ` ${hours} hr${hours > 1 ? 's' : ''}`
  }

  return result.trim()
}
