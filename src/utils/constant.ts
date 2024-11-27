export type EnvType = string | number | null | undefined

export const GATEWAY_DATA_BRANCH: EnvType =
  import.meta.env.VITE_GATEWAY_DATA_BRANCH || 'main'

export const GATEWAY_DATA_RAW =
  'https://raw.githubusercontent.com/bobanetwork/gateway-data/'

export const DATA_URL_THIRD_PARTY_BRIDGE = `https://raw.githubusercontent.com/bobanetwork/gateway-data/${GATEWAY_DATA_BRANCH}/bridges/list.json`

//@todo update branch name
export const DATA_URL_ECOSYSTEM_LIST = `${GATEWAY_DATA_RAW}${GATEWAY_DATA_BRANCH}/ecosystem/list.json`
export const DATA_URL_TRADE_LIST = `${GATEWAY_DATA_RAW}${GATEWAY_DATA_BRANCH}/ecosystem/cex.list.json`
export const DATA_URL_TRADE_ASSET = `${GATEWAY_DATA_RAW}${GATEWAY_DATA_BRANCH}/ecosystem/icons/`
