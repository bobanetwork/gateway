import styled from 'styled-components'

export const StakeItemDetails = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => props.theme.colors.box.background};
  border: 1px solid ${(props) => props.theme.colors.box.border};
  box-sizing: border-box;
  padding: 20px 35px;
  border-radius: 8px;

  > div {
    display: flex;
    margin: 0px auto;
    white-space: break-spaces;
    align-items: center;
    &:first-of-type {
      margin-left: 0px;
      width: 200px;
      margin-right: 10px;
    }
    &:last-of-type {
      margin-right: 0px;
      margin-left: 15px;
    }
  }
`

export const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0px 10px;

  > div {
    display: flex;
    gap: 0px 5px;
    white-space: initial;
  }
`
export const Token = styled.img`
  max-width: 32px;
  width: 100%;
  height: auto;
  margin-right: 10px;
`
