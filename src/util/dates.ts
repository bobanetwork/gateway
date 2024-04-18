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

export { Dayjs }

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

export const addHoursToDate = (timestamp, hour) => {
  return dayjs.unix(timestamp).add(hour, 'hour').unix()
}

export const diffBetweenTimeStamp = (time1: number, time2: number) => {
  const date1 = dayjs.unix(time1)
  const date2 = dayjs.unix(time2)

  return date1.diff(date2, 'seconds')
}
