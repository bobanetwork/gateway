import React from 'react'
import { Typography } from 'components/global/typography'

export const BridgeTooltip = () => (
  <Typography variant="body3">
    <span style={{ fontWeight: '700' }}>Staking example</span>. When you stake
    10 BOBA into the L2 pool, then the pool's liquidity and balance both
    increase by 10 BOBA.
    <br />
    <br />
    <span style={{ fontWeight: '700' }}>Pool rebalancing</span>. In some
    circumstances, excess balances can accumulate on one chain. For example, if
    many people bridge from L1 to L2, then L1 pool balances will increase, while
    L2 balances will decrease. When needed, the pool operator can rebalance the
    pools, using 'classic' deposit and exit operations to move funds from one
    pool to another. Rebalancing takes 7 days, due to the 7 day fraud proof
    window, which also applies to the operator.
    <br />
    <br />
    <span style={{ fontWeight: '700' }}>Dynamic fees</span>. The pools use an
    automatic supply-and-demand approach to setting the fees. When a pool's
    liquidity is low, the fees are increased to attract more liquidity into that
    pool and vice-versa.
  </Typography>
)
