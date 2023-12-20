import styled from 'styled-components'
import { Svg } from 'components/global/svg'

export const Wallets = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const StyledWallet = styled.div`
  display: flex;
  width: 100%;
  padding: 10px 16px;
  border-radius: 8px;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  gap: 0px 10px;
  &:hover {
    background: ${(props) => props.theme.colors.gray[400]};
  }
`

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  padding: 5px;
  border-radius: 40px;
  background: ${(props) => props.theme.colors.gray[400]};
`
export const Icon = styled.img`
  width: 100%;
  height: auto;
`

export const ArrowContainer = styled.div`
  margin-left: auto;
  margin-right: 5px;
`

export const StyledSvg = styled(Svg)`
  display: flex;
  svg {
    fill: ${({ theme }) =>
      theme.name === 'light' ? theme.colors.gray[600] : theme.colors.gray[100]};
  }
`
