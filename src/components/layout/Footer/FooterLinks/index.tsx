import Menu from 'components/global/menu'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectActiveNetworkType } from 'selectors'
import { Network, NetworkType } from 'util/network/network.util'
import { FOOTERLINKS } from './constant'
import {
  LinkContainer,
  ScanContainer,
  StyledLink,
  StyledLinks,
  StyledNavLink,
} from './style'

const blockExplorerLinks = {
  [NetworkType.TESTNET]: {
    [Network.ETHEREUM]: {
      l1: `https://sepolia.etherscan.io`,
      l2: `https://testnet.bobascan.com`,
    },
    [Network.BNB]: {
      l1: `https://testnet.bscscan.com`,
      l2: `https://testnet.bobascan.com`,
    },
    [Network.ARBITRUM]: {
      l1: `https://sepolia.etherscan.io`,
      l2: `https://sepolia.arbiscan.io`,
    },
    [Network.OPTIMISM]: {
      l1: `https://sepolia.etherscan.io`,
      l2: `https://sepolia-optimism.etherscan.io`,
    },
  },
  [NetworkType.MAINNET]: {
    [Network.ETHEREUM]: {
      l1: `https://etherscan.io`,
      l2: `https://bobascan.com`,
    },
    [Network.BNB]: {
      l1: `https://bscscan.com`,
      l2: `https://bobascan.com`,
    },
    [Network.ARBITRUM]: {
      l1: `https://etherscan.io`,
      l2: `https://arb1.arbitrum.io/rpc`,
    },
    [Network.OPTIMISM]: {
      l1: `https://etherscan.io`,
      l2: `https://explorer.optimism.io`,
    },
  },
}

const FooterLinks = () => {
  const activeNetworkType = useSelector(selectActiveNetworkType())

  const onLinkClick = (network, layer) => {
    const links = blockExplorerLinks[activeNetworkType]
    const explorerLink = links[network][layer]
    window.open(explorerLink, '_blank')
  }

  return (
    <LinkContainer>
      <StyledLinks id="footerLinks">
        {FOOTERLINKS.map((link) => {
          if (link.isNav) {
            return (
              <StyledNavLink to={link.path} key={link.label}>
                {link.label}
              </StyledNavLink>
            )
          }
          return (
            <StyledLink key={link.label} href={link.path} target="_blank">
              {link.label}
            </StyledLink>
          )
        })}
      </StyledLinks>
      <ScanContainer>
        <Menu
          name="block explorer"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          variant="outline"
          options={[
            {
              label: 'Etherscan',
              onClick: () => onLinkClick(Network.ETHEREUM, 'l1'),
            },
            {
              label: 'Bobascan',
              onClick: () => onLinkClick(Network.ETHEREUM, 'l2'),
            },
            {
              label: 'Optimism',
              onClick: () => onLinkClick(Network.OPTIMISM, 'l1'),
            },
            {
              label: 'Arbitrum',
              onClick: () => onLinkClick(Network.ARBITRUM, 'l2'),
            },
            {
              label: 'Binance Smart Chain',
              onClick: () => onLinkClick(Network.BNB, 'l1'),
            },
            {
              label: 'Boba BNB',
              onClick: () => onLinkClick(Network.BNB, 'l2'),
            },
          ]}
          label="Block explorers"
        />
      </ScanContainer>
    </LinkContainer>
  )
}

export default FooterLinks
