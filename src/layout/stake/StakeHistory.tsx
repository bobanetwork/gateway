import { NetworkSwitchButton } from '@/components/boba/NetworkSwitchButton';
import { Card, Text } from '@/components/ui';
import { useChainConfig } from '@/hooks/useChainConfig';
import { useModalStore } from '@/stores/modal.store';
import { useStakingStore } from '@/stores/stake.store';
import { ModalIds } from '@/types/modal';
import { StakeInfo } from '@/types/stake';
import { formatNumberWithIntl } from '@/utils/format';
import { calculateStakeEarnings } from '@/utils/stake';
import { IconSquareX, IconWallet } from '@tabler/icons-react';
import React from 'react';
import { boba, mainnet } from 'viem/chains';
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
  const { isStakingEnabled, chainConfig } = useChainConfig()
  
  if (!!loading) {
    return <Card className="flex flex-col items-center justify-center py-6 auto rounded-[28px] min-h-[271px] gap-4">
      <div className="mx-auto flex items-center justify-center h-20 w-20">
        <div className="animate-spin rounded-full h-20 w-20 border-[8px] border-green-300 border-l-transparent border-t-transparent"></div>
      </div>
      <Text variant="sm"> Loading stakes...</Text>
    </Card>
  }

  if(!isStakingEnabled) {
    return <Card className="flex flex-col items-center justify-center py-6 auto rounded-[28px] min-h-[271px] gap-4">
      <IconWallet className="h-14 w-14 text-green-400 dark:text-dark-green-300" />
      <Text variant="md" fontWeight='bold' text-gray-800 dark:text-dark-gray-50>No Connected Wallet</Text>
      <Text variant="sm">Connect your wallet to view your stakes</Text>
      <NetworkSwitchButton toNewChain={!chainConfig ? mainnet:boba} className="rounded-full">
        Connect to {!chainConfig? `Wallet`:`Boba`}
      </NetworkSwitchButton>
    </Card>
  }

  if (!stakingHistory.length) {
    return <Card className="flex flex-col items-center justify-center py-6 auto rounded-[28px] min-h-[271px] gap-4">
      <IconSquareX className="h-14 w-14 text-green-400 dark:text-dark-green-300" />
      <Text variant="md" fontWeight='bold' text-gray-800 dark:text-dark-gray-50>No stakes yet</Text>
      <Text variant="sm">There are no stakes to display</Text>
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