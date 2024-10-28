import styled, { css } from 'styled-components'
import { mobile, sdesktop, tablet } from 'themes/screens'

export const PageContainer = styled.div`
  margin: 0px auto 20px auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0px 10px 50px 10px;
  width: 100%;
  max-width: 1024px;
  ${sdesktop(css`
    padding: 0px 0px 50px 0px;
  `)}
`

export const CardList = styled.div`
  display: grid;
  gap: 15px;
  grid-template-columns: repeat(4, 1fr);

  ${sdesktop`
    grid-template-columns: repeat(4, 1fr);
  `}

  ${tablet`
    grid-template-columns: repeat(3, 1fr);
  `}

  ${mobile`
    grid-template-columns: repeat(1, 1fr);
  `}
`

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
`

export const Title = styled.h2`
  margin: 0;
`

export const IconList = styled.div`
  display: flex;
  gap: 10px;
`

export const Description = styled.p`
  margin: 0;
`

export const PlaceholderImage = styled.div`
  width: 50px; // Set the desired width
  height: 50px; // Set the desired height
  background: lightgray; // Placeholder background
  border-radius: 50%; // Rounded shape
`
