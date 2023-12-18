import { TableHeader } from 'components/global/table'
import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { selectPoolInfo, selectUserInfo } from 'selectors'
import { EarnListProps } from 'types/earn.types'
import { tableHeaderOptions } from '../table.header'
import EarnListItem from './earnListItem'
import { EarnListContainer, EearnListLoadingContainer } from './styles'
import { CircularProgress } from '@mui/material'

const EarnList = ({ lpChoice, showMyStakeOnly }: EarnListProps) => {
  const userInfo = useSelector(selectUserInfo())
  const poolInfo = useSelector(selectPoolInfo())
  const poolList: string[] = Object.keys(poolInfo[lpChoice])

  const isLoading = poolList.filter(Boolean).length === 0

  return (
    <>
      <TableHeader options={tableHeaderOptions} />
      {isLoading && (
        <EearnListLoadingContainer>
          <CircularProgress color="secondary" />
        </EearnListLoadingContainer>
      )}
      {!isLoading && (
        <>
          <EarnListContainer>
            {poolList.map((tokenAddress, i) => {
              return (
                <Fragment key={i}>
                  <EarnListItem
                    showMyStakeOnly={showMyStakeOnly}
                    poolInfo={poolInfo[lpChoice][tokenAddress]}
                    userInfo={userInfo[lpChoice][tokenAddress]}
                    lpChoice={lpChoice}
                    tokenAddress={tokenAddress}
                  />
                </Fragment>
              )
            })}
          </EarnListContainer>
        </>
      )}
    </>
  )
}

export default React.memo(EarnList)
