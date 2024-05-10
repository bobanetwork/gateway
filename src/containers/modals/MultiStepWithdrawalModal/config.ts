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
      'You will be able to submit your proof once your transaction is submitted to L1.',
    passiveStep: false,
    btnLbl: 'Prove Withdrawal',
  },
  { label: 'Wait about 7 days', passiveStep: true },
  {
    label: 'Claim Withdrawal',
    description: `The proof has been submitted. Please wait 7 days to claim your withdrawal`,
    passiveStep: false,
    btnLbl: 'Claim Withdrawal',
  },
  { label: 'Wait for Confirmation', passiveStep: true },
]
