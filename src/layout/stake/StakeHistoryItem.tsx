import { Button } from "@/components/ui";
import { StakeInfo } from "@/types/stake";
import React from "react";

interface StakeHistoryItemProps {
  stake: StakeInfo;
  onUnstake: (info: StakeInfo) => void;
}

interface CalculationResult {
  earned: number;
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
    const unlocktimeNextBegin = formatDate(timeZero_S + twoWeeks)
    const unlocktimeNextEnd = formatDate(timeZero_S + twoWeeks + twoDays)

    const secondsInADay = 24 * 60 * 60
    const duration_D = duration_S / secondsInADay

    let locked = true
    if (residual_S > twoWeeks) {
      locked = false
    }

    const earned = Number(stake.depositAmount) * (0.05 / 365.0) * duration_D

    return {
      earned,
      unlockTimeRange: `${unlocktimeNextBegin} - ${unlocktimeNextEnd}`,
      isLocked: locked
    };
  };

  const { earned, unlockTimeRange, isLocked } = calculateEarningsAndUnlockTime();

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow rounded-lg">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="text-sm">
          <span className="block font-medium">Date</span>
          <span>{stake.depositTimestamp}</span>
        </div>

        <div className="text-sm">
          <span className="block font-medium">Amount Staked</span>
          <span>{stake.depositAmount?.toLocaleString() ?? '0'}</span>
        </div>

        <div className="text-sm">
          <span className="block font-medium">Earned</span>
          <span>{earned.toFixed(6)}</span>
        </div>

        <div className="text-sm">
          <span className="block font-medium">Unstake Window</span>
          <span>{unlockTimeRange}</span>
        </div>
      </div>

      <Button
        className="bg-[#D1F366] text-black hover:bg-[#bfdf5c] mt-4 md:mt-0"
        onClick={() => onUnstake(stake)}
        disabled={isLocked}
      >
        Unstake
      </Button>
    </div>
  );
};
export default StakeHistoryItem;