import { Button, Typography } from 'components/global'
import styled, { css } from 'styled-components'

export const ConfirmModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`
export const SubLabel = styled(Typography).attrs({
  variant: 'body3',
})`
  color: ${({ theme }) => theme.color};
`
export const SubValue = styled(Typography).attrs({
  variant: 'body1',
})`
  color: ${({ theme }) =>
    theme.name === 'light' ? theme.colors.gray[800] : theme.colors.gray[50]};
  text-transform: capitalize;
`

export const LightText = styled.span`
  color: ${({ theme }) =>
    theme.name === 'light' ? theme.colors.gray[600] : theme.colors.gray[200]};
  margin-left: 8px;
`

export const LayerNames = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;

  svg,
  img {
    height: 30px;
    width: 30px;
  }
`

export const Separator = styled.hr`
  width: 90%;
  color: ${({ theme }) =>
    theme.name === 'light' ? theme.colors.gray[600] : theme.colors.gray[400]};
`

export const ConfirmActionButton = styled(Button)`
  width: 100%;
`

export const SecondaryActionButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) =>
    theme.name === 'light' ? theme.colors.gray[400] : theme.colors.gray[100]};
  width: 100%;
  box-shadow: none;
  :hover {
    background: transparent;
    opacity: 75%;
  }
`

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`

export const WithdrawalNetworkContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 25px;
  justify-content: 'center';
`
interface CanBeActive {
  active: boolean
}

export const ActiveStepNumberIndicator = styled.div<CanBeActive>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) =>
    theme.name === 'light' ? theme.colors.gray[600] : theme.colors.gray[400]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  color: #fff;
  font-size: 16px; 
  text-align: center;
  font-weight: bold;
  line-height: 32px;
  opacity: 0.5;

  ${(props) =>
    props.active &&
    css`
      opacity: 1;
      background-color: ${({ theme }) =>
        theme.name === 'light'
          ? theme.colors.green[600]
          : theme.colors.green[400]};
    `}
  }
`

export const PassiveStepperNumberIndicator = styled.p<CanBeActive>`
  position: relative;
  margin: 8px auto;
  padding-left: 40px;
  font-size: 16px;
  opacity: 0.5;
  color: ${({ theme }) => theme.color.gray};

  span {
    position: absolute;
    left: 8.5px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
  }

  ${(props) =>
    props.active &&
    css`
      font-weight: bold;
      opacity: 1;
      color: ${({ theme }) => theme.color.green};
    `}
`

export const Description = styled.p<CanBeActive>`
  margin-top: 4px;
  margin-bottom: 4px;
  margin-left: 14px;
  padding: 2px 24px;
  border-left: 2px solid gray;
  font-size: 14px;
  opacity: 0.5;

  ${(props) =>
    props.active &&
    css`
      opacity: 1;
    `}
`

export const StepContainer = styled.div<CanBeActive>`
  opacity: 0.5;
  ${(props) =>
    props.active &&
    css`
      opacity: 1;
    `}
`
