import React from 'react'
import { IconLabel, Svg, TableContent, Typography } from 'components/global'
import { BigNumber, BigNumberish } from 'ethers'
import { formatLargeNumber, logAmount, powAmount } from 'util/amountConvert'
import ActionIcon from 'assets/images/icons/actions.svg'
import { useSelector } from 'react-redux'
import { selectAccountEnabled, selectActiveNetwork } from 'selectors'

interface EarnListItem {
  userInfo: any
  poolInfo: any
  chainId?: any
  lpChoice: any
}

const EarnListItem = ({
  poolInfo,
  userInfo,
  chainId,
  lpChoice,
}: EarnListItem) => {
  console.log(`userInfo`, userInfo)

  const accountEnabled = useSelector(selectAccountEnabled())
  const symbol = poolInfo.symbol
  const name = poolInfo.name
  const decimals = poolInfo.decimals
  const address =
    lpChoice === 'L1LP' ? poolInfo.l1TokenAddress : poolInfo.l2TokenAddress

  const formatNumber = (value: BigNumberish, limit?: any) => {
    const limits = limit || 2
    return formatLargeNumber(Number(logAmount(value, decimals, limits)))
  }

  let userReward: BigNumberish = 0

  if (
    Object.keys(userInfo).length &&
    Object.keys(poolInfo).length &&
    accountEnabled
  ) {
    userReward = BigNumber.from(userInfo.pendingReward)
      .add(
        BigNumber.from(userInfo.amount)
          .mul(BigNumber.from(poolInfo.accUserRewardPerShare))
          .div(BigNumber.from(powAmount(1, 12)))
          .sub(BigNumber.from(userInfo.rewardDebt))
      )
      .toString()
  }

  const tableOptions = [
    {
      content: (
        <IconLabel token={{ name, symbol, address, chainId, decimals }} />
      ),
      width: 225,
    },
    {
      content: (
        <Typography variant="body2">
          {formatNumber(poolInfo.tokenBalance)}
        </Typography>
      ),
      width: 145,
    },
    {
      content: (
        <Typography variant="body2">
          {formatNumber(poolInfo.userDepositAmount)}
        </Typography>
      ),
      width: 115,
    },
    {
      content: (
        <Typography variant="body2">{`${logAmount(
          poolInfo.APR,
          0,
          2
        )}`}</Typography>
      ),
      width: 85,
    },
    {
      content: (
        <Typography variant="body2">
          {userInfo.amount ? `${logAmount(userInfo.amount, decimals, 2)}` : `0`}
        </Typography>
      ),
      width: 90,
    },
    {
      content: (
        <Typography variant="body2">
          {userReward ? `${logAmount(userReward, decimals, 5)}` : `0`}
        </Typography>
      ),
      width: 110,
    },
    {
      content: <Svg src={ActionIcon} />,
      width: 75,
    },
  ]

  return (
    <>
      <TableContent options={tableOptions} />
    </>
  )
}

export default React.memo(EarnListItem)
