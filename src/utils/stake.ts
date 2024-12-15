// Logics and utils for stakes

export const calculateStakeEarnings = (depositAmount: number, depositTimestamp: number) => {
  const timeNow_S = Math.round(Date.now() / 1000);
  const duration_S = timeNow_S - depositTimestamp;
  const secondsInADay = 24 * 60 * 60;
  const duration_D = duration_S / secondsInADay;

  return Number(depositAmount) * (0.05 / 365.0) * duration_D;
};