import React, { Fragment } from 'react'
import { TableHeader } from 'components/global/table'
import { tableHeaderOptions } from '../table.header'
import { EarnListContainer } from './styles'
import {
  selectPoolInfo,
  selectUserInfo,
  selectlayer1Balance,
  selectlayer2Balance,
} from 'selectors'
import { useSelector } from 'react-redux'
import EarnListItem from './earnListItem'

interface EarnListProps {
  lpChoice: 'L1LP' | 'L2LP'
}

const EarnList = ({ lpChoice }: EarnListProps) => {
  const userInfo = useSelector(selectUserInfo())
  const poolInfo = useSelector(selectPoolInfo())

  console.log(poolInfo[lpChoice])

  return (
    <>
      {Object.keys(poolInfo[lpChoice]).filter(Boolean).length === 0 ? (
        <>Loading content for pool</>
      ) : (
        <>
          <TableHeader options={tableHeaderOptions} />
          <EarnListContainer>
            {Object.keys(poolInfo[lpChoice]).map((tokenAddress, i) => {
              console.log(`tokenAddress = ${tokenAddress}`)

              return (
                <Fragment key={i}>
                  <EarnListItem
                    poolInfo={poolInfo[lpChoice][tokenAddress]}
                    userInfo={userInfo[lpChoice][tokenAddress]}
                    lpChoice={lpChoice}
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
