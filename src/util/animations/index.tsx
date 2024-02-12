import React, { useState, useEffect } from 'react'
import { TConductorInstance } from 'react-canvas-confetti/dist/types'
import Realistic from 'react-canvas-confetti/dist/presets/realistic'
import { TCanvasConfettiAnimationOptions } from 'react-canvas-confetti/dist/types/normalization'
import styled from 'styled-components'
import dayjs from 'dayjs'

const CanvaContainer = styled.div`
  display: block;
  z-index: 9999;
  position: fixed;
`
const count = 200
const defaults = {
  origin: { y: 0.7 },
}

export const Confetti = ({ size, particles, spreads }: any) => {
  const [conductor, setConductor] = useState<TConductorInstance>()

  const onInit = ({ conductor }: { conductor: TConductorInstance }) => {
    setConductor(conductor)
  }

  const onOnce = () => {
    conductor?.shoot()
  }

  const PARTICLES = {
    heart: [
      {
        type: 'path',
        path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
        matrix: [
          0.03333333333333333, 0, 0, 0.03333333333333333, -5.566666666666666,
          -5.533333333333333,
        ],
      },
    ],
    circle: ['circle'],
    star: ['star'],
  }

  const heartsOptions = (options: TCanvasConfettiAnimationOptions) => {
    return {
      ...options,
      startVelocity: 50,
      decay: 0.95,
      spread: 180,
      zIndex: 9999,
      gravity: 3,
      origin: {
        y: 1,
      },
      scalar: size || 7,
      particleCount: Math.floor(count * (Math.random() * (0.5 - 0.1) + 0.1)),
      colors: ['#AEDB01'],
      shapes: PARTICLES[particles] || ['square'],
    }
  }

  useEffect(() => {
    setTimeout(() => {
      onOnce()
    }, 1500)
  })

  return (
    <CanvaContainer>
      <Realistic onInit={onInit} decorateOptions={heartsOptions} />
    </CanvaContainer>
  )
}

export const ValentinesDayBanner = () => {
  const [isValentinesDay, setIsValentinesDay] = useState(false)

  useEffect(() => {
    const today = dayjs()
    const isFebruary14 = today.date() === 14 && today.month() === 1
    if (isFebruary14) {
      setIsValentinesDay(true)
    }
  }, [])
  return (
    <>
      {isValentinesDay && (
        <>
          <Confetti size={8} particles="heart" spreads={150} />
          <Confetti size={2} particles="heart" spreads={150} />
          <Confetti size={1} particles="heart" spreads={150} />
        </>
      )}
    </>
  )
}
