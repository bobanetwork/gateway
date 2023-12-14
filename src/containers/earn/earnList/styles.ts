import styled from 'styled-components'

export const EarnListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px 0;
  padding: 10px 0;
`

export const EearnListLoadingContainer = styled.div`
  margin: 10px auto;
  background: ${(props) => props.theme.colors.popup};
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  padding: 25px;
  border-radius: 8px;
  text-align: center;
`
