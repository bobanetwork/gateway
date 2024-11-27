import React from 'react'

type Props = {
  className: string
}

const BobaLogo = (props: Props) => {
  return (
    <img src="./assets/boba/boba-logo.svg" className={`object-cover ${props.className}`} alt="boba logo" />
  )
}

export default BobaLogo