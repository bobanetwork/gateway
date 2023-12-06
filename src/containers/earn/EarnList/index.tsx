import { TableHeader } from 'components/global/table'
import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { selectPoolInfo, selectUserInfo } from 'selectors'
import { tableHeaderOptions } from '../table.header'
import EarnListItem from './earnListItem'
import { EarnListContainer } from './styles'

interface EarnListProps {
  lpChoice: 'L1LP' | 'L2LP'
  showMyStakeOnly: boolean
}

const EarnList = ({ lpChoice, showMyStakeOnly }: EarnListProps) => {
  const userInfo = useSelector(selectUserInfo())
  const poolInfo = useSelector(selectPoolInfo())

  return (
    <>
      {Object.keys(poolInfo[lpChoice]).filter(Boolean).length === 0 ? (
        <>Loading content for pool</>
      ) : (
        <>
          <TableHeader options={tableHeaderOptions} />
          <EarnListContainer>
            {Object.keys(poolInfo[lpChoice]).map((tokenAddress, i) => {
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
