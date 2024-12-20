import styled, { css } from 'styled-components'
import { mobile, sdesktop, tablet } from 'themes/screens'

export const CardList = styled.div`
  display: grid;
  gap: 15px;
  grid-template-columns: repeat(4, 1fr);
  height: calc(100vh - 320px);
  min-height: 650px;
  max-height: 850px;
  overflow-y: scroll;
  padding-bottom: 5px;

  ${sdesktop`
    grid-template-columns: repeat(4, 1fr);
  `}

  ${tablet`
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  `}

  ${mobile`
    grid-template-columns: repeat(1, 1fr);
    max-height: 100%;
  `}
  
  &::-webkit-scrollbar {
    display: none;
  }
`

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #dee0d8;
  background: rgba(253, 255, 248, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(7.5px);
  flex-direction: column;
  align-items: center;
  text-align: center;
  display: flex;
  padding: 24px;
  gap: 10px;
  width: 100%;
  max-width: 250px;
  min-width: 250px;
  height: 220px;
  border: 1px solid
    ${({ theme: { colors, name } }) =>
      name === 'light' ? colors.gray[400] : colors.gray[300]};
  background: ${({ theme }) => theme.colors.box.background};
  ${tablet`
    padding: 20px;
    gap: 8px;
    max-width: 200px;
    min-width: 200px;
  `}

  ${mobile`
    padding: 16px;
    gap: 8px;
    max-width: 280px;
    min-width: 280px;
    margin:auto;
  `}
`

export const ExternalIcon = styled.img`
  width: 16px;
`

export const Title = styled.a`
  margin: 0;
  cursor: pointer;
  color: inherit;
  text-decoration: none;
  font-family: Montserrat;
  font-size: 16px;
  font-weight: 700;
  line-height: 19.5px;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  gap: 5px;

  &:hover {
    text-decoration: underline;
  }

  ${tablet`
   font-size: 14px;
  `}

  ${(props) => css`
    color: ${props.theme.name === 'light'
      ? props.theme.colors.gray[800]
      : '#fff'};
  `}
  & img {
    ${(props) => css`
      display: ${props.theme.name === 'light' ? 'block' : 'none'};
    `}
  }
`

export const IconList = styled.div`
  display: flex;
  gap: 10px;
`

export const Description = styled.p`
  margin: 0;
  font-family: Inter;
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  max-height: 6em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  white-space: normal;
  ${(props) =>
    props.theme.name === 'light' &&
    css`
      color: ${props.theme.colors.gray[800]};
    `}
  ${(props) =>
    props.theme.name === 'dark' &&
    css`
      color: #fff;
    `}
`

export const PlaceholderImage = styled.div`
  width: 50px;
  height: 50px;
  max-width: 50px;
  max-height: 50px;
  border-radius: 50%;
`

export const OutlineButton = styled.button`
  background: transparent;
  border: 1px solid #007bff;
  color: #007bff;
  border-radius: 20px;
  padding: 5px 10px;
  margin: 5px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    background-color 0.2s,
    color 0.2s;

  &:hover {
    color: white;
  }

  &:focus {
    outline: none;
  }

  border: 2px solid transparent;
  color: ${(props) => props.theme.colors.gray[100]};
  ${(props) =>
    props.theme.name === 'light' &&
    css`
      color: ${props.theme.colors.gray[600]};
      &.active {
        background: ${props.theme.colors.gray[50]};
        border-color: ${props.theme.colors.gray[50]};
        color: ${props.theme.colors.gray[800]};
      }
    `}
  ${(props) =>
    props.theme.name === 'dark' &&
    css`
      border: 2px solid ${props.theme.colors.gray[200]};
      &.active {
        border-color: ${props.theme.colors.green[300]};
        color: white;
      }
    `}
`
