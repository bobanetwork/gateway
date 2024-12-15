import { Button, Text } from "@/components/ui";
import { StakeInfo } from "@/types/stake";
import { formatDate, formatUnlockTimeRange } from "@/utils/date";
import { formatNumberWithIntl } from "@/utils/format";
import React from "react";

interface StakeHistoryItemProps {
  stake: StakeInfo;
  onUnstake: (info: StakeInfo) => void;
}

interface CalculationResult {
  earned: number;
  timeDeposit: string;
  unlockTimeRange: string;
  isLocked: boolean;
}

const StakeHistoryItem: React.FC<StakeHistoryItemProps> = ({ stake, onUnstake }) => {
  const calculateEarningsAndUnlockTime = (): CalculationResult => {
    const timeDeposit_S = stake.depositTimestamp;
    const timeDeposit = formatDate(timeDeposit_S);
    const timeNow_S = Math.round(Date.now() / 1000);

    const duration_S = timeNow_S - timeDeposit_S

    const twoWeeks = 14 * 24 * 60 * 60
    const twoDays = 2 * 24 * 60 * 60

    const residual_S = duration_S % (twoWeeks + twoDays)
    const timeZero_S = timeNow_S - residual_S
    const unlockTimeRange = formatUnlockTimeRange(timeZero_S + twoWeeks, timeZero_S + twoWeeks + twoDays)

    const secondsInADay = 24 * 60 * 60
    const duration_D = duration_S / secondsInADay

    let locked = true
    if (residual_S > twoWeeks) {
      locked = false
    }

    const earned = Number(stake.depositAmount) * (0.05 / 365.0) * duration_D

    return {
      timeDeposit,
      earned,
      unlockTimeRange,
      isLocked: locked
    };
  };

  const { timeDeposit, earned, unlockTimeRange, isLocked } = calculateEarningsAndUnlockTime();

  return (
    <div className="flex flex-col md:flex-row items-center justify-between py-5 px-8 border-[1px] border-gray-400 dark:border-dark-gray-300 shadow-md rounded-[55px]">

      <div className="flex">
        <Text variant="sm" fontWeight="medium">{timeDeposit}</Text>
      </div>

      <div className="flex gap-2">
        <Text variant="sm" fontWeight="medium" className="text-gray-600 dark:text-dark-gray-100">Amount Staked
          <span className="text-gray-800 dark:text-dark-gray-50 ml-1">{formatNumberWithIntl(Number(stake.depositAmount)) ?? '0'}</span> </Text>
        </div>

      <div className="flex gap-2">
        <Text variant="sm" fontWeight="medium" className="text-gray-600 dark:text-dark-gray-100">Earned
          <span className="text-gray-800 dark:text-dark-gray-50 ml-1">{formatNumberWithIntl(earned, 4)}</span> </Text>
        </div>

      <div className="flex gap-2">
        <Text variant="sm" fontWeight="medium" className="text-gray-600 dark:text-dark-gray-100">Unstake Window
          <span className="text-gray-800 dark:text-dark-gray-50 ml-1">{unlockTimeRange}</span> </Text>
      </div>

      <Button
        className="rounded-full !shadow-sm"
        onClick={() => onUnstake(stake)}
        disabled={isLocked}
      >
        Unstake
      </Button>
    </div>
  );
};
export default StakeHistoryItem;