import React from 'react'
import { IconLabel, TableContent, Typography } from 'components/global'
import { BigNumber, BigNumberish } from 'ethers'
import { formatLargeNumber, logAmount, powAmount } from 'util/amountConvert'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAccountEnabled,
  selectlayer1Balance,
  selectlayer2Balance,
} from 'selectors'
import { EarnListItemContainer, IconWrapper, MoreActionIcon } from './styles'
import {
  StyledLabel,
  StyledMenu,
  StyledMenuItem,
} from 'components/global/menu/styles'
import networkService, { EPoolLayer } from 'services/networkService'
import { getEarnInfo, updateWithdrawToken } from 'actions/earnAction'
import { openAlert, openModal } from 'actions/uiAction'
import { getReward } from 'actions/networkAction'

interface EarnListItem {
  userInfo: any
  poolInfo: any
  chainId?: any
  tokenAddress: string
  lpChoice: 'L1LP' | 'L2LP'
  showMyStakeOnly: boolean
}

const EarnListItem = ({
  poolInfo,
  userInfo,
  chainId,
  tokenAddress,
  lpChoice,
  showMyStakeOnly = false,
}: EarnListItem) => {
  // for menu items
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const accountEnabled = useSelector(selectAccountEnabled())
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  //
  const dispatch = useDispatch<any>()

  const layer1Balance = useSelector(selectlayer1Balance)
  const layer2Balance = useSelector(selectlayer2Balance)

  const symbol = poolInfo.symbol
  const name = poolInfo.name
  const decimals = poolInfo.decimals
  const address =
    lpChoice === 'L1LP' ? poolInfo.l1TokenAddress : poolInfo.l2TokenAddress

  const disabled = !lpChoice.includes(networkService.L1orL2!)

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

  const getBalance = (address: string) => {
    let tokens = []
    if (lpChoice.includes('L1')) {
      tokens = Object.values(layer1Balance)
    } else if (lpChoice.includes('L2')) {
      tokens = Object.values(layer2Balance)
    }
    const token: any = tokens.find(
      (t: any) => t.address.toLowerCase() === address.toLowerCase()
    )
    return token ? [token.balance, token.decimals] : [0, 0]
  }

  const handleHarvest = async () => {
    const rewardTx = await dispatch(
      getReward(
        lpChoice === EPoolLayer.L1LP
          ? poolInfo.l1TokenAddress
          : poolInfo.l2TokenAddress,
        userReward,
        lpChoice as any
      )
    )

    if (rewardTx) {
      dispatch(
        openAlert(
          `${logAmount(userReward, poolInfo.decimals, 2)} ${
            poolInfo.symbol
          } was added to your account`
        )
      )
      dispatch(getEarnInfo())
    }
  }

  const handleUnstakeToken = () => {
    let currency = poolInfo.l1TokenAddress
    let LPAddress = poolInfo.L1LPAddress
    if (lpChoice === EPoolLayer.L2LP) {
      currency = poolInfo.l2TokenAddress
      LPAddress = poolInfo.L2LPAddress
    }

    dispatch(
      updateWithdrawToken({
        symbol: poolInfo.symbol,
        currency,
        LPAddress,
        L1orL2Pool: lpChoice,
        balance: getBalance(tokenAddress)[0],
        decimals: poolInfo.decimals,
      })
    )
    dispatch(openModal('EarnWithdrawModal'))
  }

  let enableReward = false
  if (Number(logAmount(userReward, decimals, 3)) >= 0.001) {
    enableReward = true
  }

  const actionItems = [
    {
      disabled,
      label: 'Unstake',
      onClick: () => {
        handleUnstakeToken()
      },
    },
    {
      label: 'Harvest',
      disabled:
        disabled || logAmount(userReward, decimals) === '0' || !enableReward,
      onClick: () => {
        console.log(`harvest token`)
        handleHarvest()
      },
    },
  ]

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
      content: (
        <>
          <IconWrapper onClick={handleClick}>
            <MoreActionIcon />
          </IconWrapper>
          <StyledMenu
            anchorEl={anchorEl}
            id={name}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            {actionItems.map((opt, index) => {
              return (
                <StyledMenuItem
                  key={index}
                  disabled={opt.disabled}
                  onClick={opt.onClick}
                >
                  <StyledLabel>{opt.label}</StyledLabel>
                </StyledMenuItem>
              )
            })}
          </StyledMenu>
        </>
      ),
      width: 75,
    },
  ]

  if (showMyStakeOnly === true) {
    if (Number(logAmount(userInfo.amount, decimals, 2)) < 0.001) {
      return null
    }
  }

  return (
    <EarnListItemContainer>
      <TableContent options={tableOptions} />
    </EarnListItemContainer>
  )
}

export default React.memo(EarnListItem)
