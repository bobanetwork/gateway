
interface FooterLinkItem {
  label: string
  href: string
  target: string
}

interface SocialLinkItem {
  label: string
  href: string
  target: string
  icon: string
}

const footerNavLinks: Array<FooterLinkItem> = [
  {
    label: "FAQs",
    href: "https://docs.boba.network/faq",
    target: "_blank"
  },
  {
    label: "Dev Tools",
    href: "https://docs.boba.network/developer",
    target: "_blank"
  },
  {
    label: "Terms of Use",
    href: "https://boba.network/terms-of-use/",
    target: "_blank"
  },
]

const socialNavLinks: Array<SocialLinkItem> = [
  {
    label: "Boba Docs",
    href: "https://docs.boba.network",
    target: "_blank",
    icon: "docs"
  },
  {
    label: "Twitter",
    href: "https://boba.eco/twitter",
    target: "_blank",
    icon: "twitter"
  },
  {
    label: "Discord",
    href: "https://boba.eco/discord",
    target: "_blank",
    icon: "discord"
  },
  {
    label: "Telegram",
    href: "https://boba.eco/telegram",
    target: "_blank",
    icon: "telegram"
  },
]

export function useFooter() {


  return {
    footerNavLinks,
    socialNavLinks
  }
}