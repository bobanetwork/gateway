export const steps = [
  {
    label: 'Start Withdrawal',
    description: `Submit the 1st transaction of the new Anchorage two-step withdrawal process.`,
    passiveStep: false,
    btnLbl: 'Initiate Withdrawal',
  },
  { label: 'Wait up to 5 minutes', passiveStep: true },
  {
    label: 'Switch network',
    passiveStep: false,
    btnLbl: 'Switch Network',
  },
  {
    label: 'Prove Withdrawal',
    description:
      'Submit the proof in advance. This additional step is part of the new Anchorage specification.',
    passiveStep: false,
    btnLbl: 'Prove Withdrawal',
  },
  { label: 'Wait about 7 days', passiveStep: true },
  {
    label: 'Claim Withdrawal',
    description: `Claim your funds. This is the final step.`,
    passiveStep: false,
    btnLbl: 'Claim Withdrawal',
  },
  { label: 'Wait for Confirmation', passiveStep: true },
]
