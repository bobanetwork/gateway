import * as React from 'react'
import { getCoinImage } from 'util/coinImage'

const AvalancheIcon = ({ selected }) => (
  <>
    <img src={getCoinImage('AVAX')} alt="avax icon" />
  </>
)

export default AvalancheIcon
