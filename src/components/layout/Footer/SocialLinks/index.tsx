import React from 'react'
import {
  DisclaimerContainer,
  DisclaimerText,
  SocialLinkItem,
  SocialLinksContainer,
  StyledSocialLinks,
} from './style'
import DocsIcon from '../../../../assets/icons/docs'
import DiscordIcon from '../../../../assets/icons/discord'
import TwitterIcon from '../../../../assets/icons/twitter'
import TelegramIcon from '../../../../assets/icons/telegram'
import { WALLET_VERSION } from 'util/constant'

const SocialLinks = () => {
  return (
    <SocialLinksContainer id="socialLinks">
      <DisclaimerContainer>
        <DisclaimerText>©2023 Enya Labs</DisclaimerText>
        {WALLET_VERSION && <DisclaimerText>v{WALLET_VERSION}</DisclaimerText>}
      </DisclaimerContainer>
      <StyledSocialLinks>
        <SocialLinkItem
          href="https://docs.boba.network"
          target="_blank"
          aria-label="bobadocs"
        >
          <DocsIcon />
        </SocialLinkItem>
        <SocialLinkItem
          href="https://boba.eco/twitter"
          target="_blank"
          aria-label="twitter"
        >
          <TwitterIcon />
        </SocialLinkItem>
        <SocialLinkItem
          href="https://boba.eco/discord"
          target="_blank"
          aria-label="discord"
        >
          <DiscordIcon />
        </SocialLinkItem>
        <SocialLinkItem
          href="https://boba.eco/telegram"
          target="_blank"
          aria-label="telegram"
        >
          <TelegramIcon />
        </SocialLinkItem>
      </StyledSocialLinks>
    </SocialLinksContainer>
  )
}

export default SocialLinks
