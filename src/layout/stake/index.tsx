import { AddToMetaMaskButton } from '@/components/boba/AddToMetaMaskButton'
import { NetworkSwitchButton } from '@/components/boba/NetworkSwitchButton'
import { Button, Card, CardContent, Text } from '@/components/ui'
import { useStakingStats } from '@/hooks/staking/useStakingStats'
import { useChainConfig } from '@/hooks/useChainConfig'
import { useBalances } from '@/hooks/useTokenBalances'
import { useModalStore } from '@/stores/modal.store'
import { ModalIds } from '@/types/modal'
import { formatNumberWithIntl } from '@/utils/format'
import React from 'react'
import { boba } from 'wagmi/chains'
import StakeHistory from './StakeHistory'
import StakeModal from './StakeModal'
import UnStakeModal from './UnstakeModal'
import { useAccount } from 'wagmi'

const StakePage: React.FC = () => {
  const { chainId } = useAccount()
  const { isStakingEnabled } = useChainConfig()
  const { openModal } = useModalStore()
  const { tokenBalance: bobaBalance, tokenDecimals, tokenSymbol, tokenAddress } = useBalances();
  const { stakingHistory, totalStaked, apy, isLoading } = useStakingStats()

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {chainId !== boba.id && <Card>
        <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center">
          <Text variant="sm" fontWeight="medium" className="text-muted-foreground">Please connect to Boba (Mainnet) to stake and earn reward.</Text>
          <NetworkSwitchButton toNewChain={boba} className="rounded-full">
            Connect to Boba
          </NetworkSwitchButton>
        </CardContent>
      </Card>}

      <div className="flex gap-20 my-8 justify-between">
        <Card className="w-5/12">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary rounded-full" />
                  <Text variant="md" fontWeight="bold" fontFamily="montserrat" className="text-gray-800 dark:text-dark-gray-50">BOBA</Text>
                  <AddToMetaMaskButton tokenConfig={{
                    decimals: tokenDecimals,
                    symbol: tokenSymbol,
                    address: tokenAddress
                  }} />
                </div>
                <Text variant="sm" fontWeight="medium">{formatNumberWithIntl(Number(bobaBalance), 3)} BOBA</Text>
              </div>

              <div className="flex flex-col justify-center">
                <Text variant="md" fontWeight="bold" fontFamily="montserrat" className="text-gray-800 dark:text-dark-gray-50">APY</Text>
                <Text variant="sm" fontWeight="medium">{apy}%</Text>
              </div>

              <div className="flex flex-col justify-center">
                <Text variant="md" fontWeight="bold" fontFamily="montserrat" className="text-gray-800 dark:text-dark-gray-50">Staked</Text>
                <Text variant="sm" fontWeight="medium">{formatNumberWithIntl(Number(totalStaked), 3)} BOBA</Text>
              </div>
            </div>
            {/* TODO: show only incase of L2 network */}
            {isStakingEnabled && <Button
              className="w-40 rounded-full"
              variant="default"
              onClick={() => openModal(ModalIds.StakeModal)}
              disabled={Number(bobaBalance) <= 0}
            >
              Stake
            </Button>}
          </CardContent>
        </Card>

        {/* Card for staking and unstaking information */}
        <Card className="w-6/12">
          <CardContent className="p-6 space-y-6">
            <div>
              <Text variant="md" fontWeight="bold" fontFamily="montserrat" className="text-gray-800 dark:text-dark-gray-50">Staking Period</Text>
              <Text variant="sm" fontWeight="medium" className="text-muted-foreground">
                Each staking period lasts 2 weeks. If you do not unstake after a staking period,
                your stake will be automatically renewed.
              </Text>
            </div>

            <div>
              <Text variant="md" fontWeight="bold" fontFamily="montserrat" className="text-gray-800 dark:text-dark-gray-50">Unstaking Window</Text>
              <Text variant="sm" fontWeight="medium" className="text-muted-foreground">
                The first two days of every staking period, except for the first staking period,
                are the unstaking window. You can only unstake during the unstaking window.
              </Text>
            </div>
          </CardContent>
        </Card>
      </div>


      <StakeHistory stakingHistory={stakingHistory} loading={isLoading} />

      <StakeModal />
      <UnStakeModal />
    </div>
  )
}

export default StakePage