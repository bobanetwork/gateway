import * as React from 'react'
import { getCoinImage } from 'util/coinImage'

const BnbIcon = () => (
  <>
    <img src={getCoinImage('BNB')} alt="bnb logo" />
  </>
)

export default BnbIcon
