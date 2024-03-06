export const filterLatestGroupedSupportedTokens = (
  tokenSupportedEvents
): Array<any> => {
  const groupedEvents = tokenSupportedEvents.reduce((acc, event) => {
    if (
      !acc[event.token] ||
      event.block_number > acc[event.token].block_number
    ) {
      acc[event.token] = event
    }
    return acc
  }, {})

  return Object.values(groupedEvents).filter(
    (event: any) => event.supported === true
  )
}
