import Base from './base'

export default class PageFooter {
  getSocialMediaLinks() {
    return cy.get('#socialLinks').find('a')
  }

  getFooterLinks() {
    return cy.get('#footerLinks').find('a')
  }

  getCompanyInfo() {
    return cy.get('#socialLinks').contains('©2023 Enya Labs')
  }

  getVersionInfo() {
    // @ts-ignore
    return cy.get('#socialLinks').contains(/^v\w+/)
  }

  gasDetailsInfo() {
    return cy.get('#gasDetails').find('div')
  }
}
