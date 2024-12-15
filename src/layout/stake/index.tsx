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
import { formatNumberWithIntl } from '@/utils/format'
import { calculateStakeEarnings } from '@/utils/stake'

const StakePage: React.FC = () => {

  const { setSelectedStake } = useStakingStore()
  const { openModal } = useModalStore()
  const { tokenBalance: bobaBalance } = useBalances();
  const { stakingHistory, totalStaked, apy } = useStakingStats()

  const calculateTotalEarned = () => {
    return stakingHistory.reduce((total, stake) => {
      const earned = calculateStakeEarnings(
        Number(stake.depositAmount),
        stake.depositTimestamp
      );
      return total + earned;
    }, 0);
  };

  const totalEarned = calculateTotalEarned();


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
                <Text variant="sm">{formatNumberWithIntl(Number(bobaBalance), 3)} BOBA</Text>
              </div>

              <div className="flex flex-col justify-center">
                <Text variant="md" fontWeight="bold" fontFamily="montserrat">APY</Text>
                <Text variant="sm">{apy}%</Text>
              </div>

              <div className="flex flex-col justify-center">
                <Text variant="md" fontWeight="bold" fontFamily="montserrat">Staked</Text>
                <Text variant="sm">{formatNumberWithIntl(Number(totalStaked), 3)} BOBA</Text>
              </div>
            </div>
            {/* TODO: show only incase of L2 network */}
            <Button
              className="w-64"
              variant="default"
              onClick={() => openModal(ModalIds.StakeModal)}
              disabled={Number(bobaBalance) <= 0}
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
          <Text variant="xl" fontWeight="semibold">Staking History</Text>
          <Text variant="sm" fontWeight="medium" className="text-muted-foreground">Total Earned: {formatNumberWithIntl(totalEarned, 2)} BOBA</Text>
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
      </div>

      <StakeModal />
      <UnStakeModal />
    </div>
  )
}

export default StakePage