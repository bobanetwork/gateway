import { Card, Text } from '@/components/ui';
import { useModalStore } from '@/stores/modal.store';
import { useStakingStore } from '@/stores/stake.store';
import { ModalIds } from '@/types/modal';
import { StakeInfo } from '@/types/stake';
import { formatNumberWithIntl } from '@/utils/format';
import { calculateStakeEarnings } from '@/utils/stake';
import React from 'react';
import StakeHistoryItem from './StakeHistoryItem';

interface StakeHistoryProps {
  stakingHistory: StakeInfo[],
  loading: boolean
}

const StakeHistory: React.FC<StakeHistoryProps> = ({
  stakingHistory,
  loading
}) => {
  const { setSelectedStake } = useStakingStore()
  const { openModal } = useModalStore()

  if (!!loading) {
    return <Card className="flex items-center justify-center py-6 auto ">
      <Text variant="sm"> Loading stakes...</Text>
    </Card>
  }

  if (!stakingHistory.length) {
    return <Card className="flex items-center justify-center py-6 auto ">
      <Text variant="sm">No stakes found!</Text>
    </Card>
  }



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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Text variant="xl" fontWeight="semibold" className="text-gray-800 dark:text-dark-gray-50">Staking History</Text>
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
  )
}

export default StakeHistory