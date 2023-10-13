import styled, { keyframes } from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  gap: 0px 10px;
`

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

export const LoadingCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  position: relative;
  border: 6px solid transparent;
  border-top-color: ${(props) => props.theme.colors.green[300]};
  animation: ${rotate} 1s linear infinite;
`
