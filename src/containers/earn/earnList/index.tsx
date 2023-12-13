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
  const poolList = Object.keys(poolInfo[lpChoice])

  return (
    <>
      <TableHeader options={tableHeaderOptions} />
      {poolList.filter(Boolean).length === 0 ? (
        <EearnListLoadingContainer>
          <CircularProgress color="secondary" />
        </EearnListLoadingContainer>
      ) : (
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
