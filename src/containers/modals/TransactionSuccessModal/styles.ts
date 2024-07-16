import { Typography } from 'components/global'
import styled from 'styled-components'

export const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  gap: 25px;
`

export const TitleText = styled(Typography).attrs({
  variant: 'body1',
})`
  text-align: center;
`

export const MutedText = styled(Typography).attrs({
  variant: 'body3',
})`
  text-align: center;
  width: 250px;
  color: ${({ theme }) =>
    theme.name === 'light' ? theme.colors.gray[700] : theme.colors.gray[100]};
`

export const CircleOuter = styled.div`
  display: flex;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  height: 80px;
  width: 80px;
  background: ${({ theme }) =>
    theme.name === 'light' ? theme.colors.green[300] : theme.colors.green[500]};
`
export const CircleInner = styled.div`
  display: flex;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  height: 66px;
  width: 66px;
  background: ${({ theme }) =>
    theme.name === 'light' ? theme.colors.green[300] : theme.colors.green[400]};
`

export const SuccessCheck = styled.div`
  display: flex;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  height: 48.4px;
  width: 48.4px;
  background: ${({ theme }) => theme.colors.green[300]};
  position: relative;
  &:after {
    content: '✓';
    font-size: 30px;
    color: #fff;
    position: absolute;
    margin: auto;
  }
`

export const SuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  gap: 8px;
  width: 100%;
`
