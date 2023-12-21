import styled, { css } from 'styled-components'
import { Typography } from 'components/global/typography'

export const EarnPageContainer = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px;
  padding-top: 0;
  width: 1025px;
`

export const LayerAlert = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  border-radius: 8px;
  margin: 8px 0;
  padding: 10px;
  background: ${(props) => props.theme.colors.box.background};
`

export const Help = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  margin: 10px 0;
  padding: 10px;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.box.background};
  ${({ theme: { name, colors } }) => css`
    border: 1px solid ${name === 'light' ? colors.blue[200] : colors.blue[100]};
    background: ${name === 'light' ? colors.blue[50] : colors.blue[500]};
    color: ${name === 'light' ? colors.blue[500] : colors.blue[100]};
  `}
`

export const AlertText = styled(Typography)`
  margin-left: 10px;
  flex: 4;
`

export const AlertInfo = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex: 1;
`

export const EarnAction = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`

export const EarnActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
`

export const EarnListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px 0;
  padding: 10px 0;
`

export const TabSwitcherContainer = styled.div`
  display: flex;
  padding: 4px;
  gap: 0 15px;
  border-radius: 8px;
  ${({ theme: { colors, name } }) =>
    name === 'light'
      ? css`
          background: ${colors.gray[50]};
        `
      : css`
          background: ${colors.gray[500]};
        `}
`

export const Tab = styled.div<{ active: boolean }>`
  padding: 8px 24px;
  border-radius: 8px;
  cursor: pointer;
  ${(props) =>
    props.active &&
    `
        color:${props.theme.colors.gray[800]};
        background:${props.theme.colors.green[300]}
    `}
`
