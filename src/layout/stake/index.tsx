import { Button, Card, CardContent, Text } from '@/components/ui'
import { useStakingStats } from '@/hooks/staking/useStakingStats'
import { useBalances } from '@/hooks/useTokenBalances'
import { useModalStore } from '@/stores/modal.store'
import { useStakingStore } from '@/stores/stake.store'
import { ModalIds } from '@/types/modal'
import { IconPlus } from '@tabler/icons-react'
import React from 'react'
import StakeModal from './StakeModal'
import UnStakeModal from './UnstakeModal'
import StakeHistoryItem from './StakeHistoryItem'
import { StakeInfo } from '@/types/stake'

const stakingHistoryMock = [
  {
    id: '1',
    date: '27 Jan 2023 02:48 AM',
    amount: '0.002',
    earned: '0.000',
    unstakeWindow: '02-04 June 2023 02:48 AM'
  },
  {
    id: '2',
    date: '31 Jan 2023 04:58 PM',
    amount: '0.004',
    earned: '0.000',
    unstakeWindow: '06-08 June 2023 02:48 AM'
  },
  {
    id: '3',
    date: '31 Jan 2023 02:48 AM',
    amount: '2.00',
    earned: '0.015',
    unstakeWindow: '10-12 June 2023 02:48 AM'
  }
]

const StakePage: React.FC = () => {

  const { setSelectedStake } = useStakingStore()
  const { openModal } = useModalStore()
  const { tokenBalance: bobaBalance } = useBalances();
  const { stakingHistory,
    totalStaked,
    apy,
    isLoading } = useStakingStats()

  console.log(`stakeCount`, {
    stakingHistory,
    totalStaked,
    apy,
    isLoading
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex gap-20 mb-8">
        {/* Card for BOBA and xBOBA balances */}
        <Card className="w-5/12">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-12">
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary rounded-full" />
                  <Text variant="md" fontWeight="bold" fontFamily="montserrat">BOBA</Text>
                  <Button variant="ghost" size="icon">
                    <IconPlus className="h-4 w-4" />
                  </Button>
                </div>
                <Text variant="sm">{bobaBalance} BOBA</Text>
              </div>

              <div className="flex flex-col justify-center">
                <Text variant="md" fontWeight="bold" fontFamily="montserrat">APY</Text>
                <Text variant="sm">5.0%</Text>
              </div>

              {/* <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary rounded-full" />
                  <Text variant="md" fontWeight="bold" fontFamily="montserrat">xBOBA</Text>
                  <Button variant="ghost" size="icon">
                    <IconPlus className="h-4 w-4" />
                  </Button>
                </div>
                <Text variant="sm">{xBobaBalance} xBOBA</Text>
              </div> */}

              <div className="flex flex-col justify-center">
                <Text variant="md" fontWeight="bold" fontFamily="montserrat">Staked</Text>
                <Text variant="sm">{totalStaked} BOBA</Text>
              </div>
            </div>
            {/* TODO: show only incase of L2 network */}
            {/* TODO: should be disabled if boba balance is 0 */}
            <Button
              className="w-64"
              variant="default"
              onClick={() => openModal(ModalIds.StakeModal)}
            >
              Stake
            </Button>
          </CardContent>
        </Card>

        {/* Card for staking and unstaking information */}
        <Card className="w-6/12">
          <CardContent className="p-6 space-y-6">
            <div>
              <Text variant="md" fontWeight="bold" fontFamily="montserrat">Staking Period</Text>
              <Text variant="sm" fontWeight="medium" className="text-muted-foreground">
                Each staking period lasts 2 weeks. If you do not unstake after a staking period,
                your stake will be automatically renewed.
              </Text>
            </div>

            <div>
              <Text variant="md" fontWeight="bold" fontFamily="montserrat">Unstaking Window</Text>
              <Text variant="sm" fontWeight="medium" className="text-muted-foreground">
                The first two days of every staking period, except for the first staking period,
                are the unstaking window. You can only unstake during the unstaking window.
              </Text>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Staking History</h2>
          <p className="text-muted-foreground">Total Earned: 2345.567 xBOBA</p>
        </div>

        <div className="space-y-4">
          {stakingHistory.map((stake) => (
            <StakeHistoryItem
              key={stake.stakeId}
              stake={stake}
              onUnstake={(info: StakeInfo) => {
                setSelectedStake(info);
                openModal(ModalIds.UnStakeModal);
              }}
            />
          ))}

        </div>
        <div className="space-y-4">
          {stakingHistory.map((stake) => (
            <div
              key={stake.stakeId}
              className="flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow rounded-lg"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="text-sm">
                  <span className="block font-medium">Date</span>
                  <span>{stake.date}</span>
                </div>

                <div className="text-sm">
                  <span className="block font-medium">Amount Staked</span>
                  <span>{stake.depositAmount
                    ? stake.depositAmount.toLocaleString()
                    : '0'}</span>
                </div>

                <div className="text-sm">
                  <span className="block font-medium">Earned</span>
                  <span>{'stake.earned'}</span>
                </div>

                <div className="text-sm">
                  <span className="block font-medium">Unstake Window</span>
                  <span>{stake.unstakeWindow}</span>
                </div>
              </div>

              <Button
                className="bg-[#D1F366] text-black hover:bg-[#bfdf5c] mt-4 md:mt-0"
                onClick={() => {
                  setSelectedStakeId(stake.id);
                  openModal(ModalIds.UnStakeModal);
                }}
              >
                Unstake
              </Button>
            </div>
          ))}
        </div>
      </div>

      <StakeModal />
      <UnStakeModal />
    </div>
  )
}

export default StakePage