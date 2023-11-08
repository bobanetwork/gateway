import { render, screen } from '@testing-library/react'
import React from 'react'
import { Header } from '.'
import CustomThemeProvider from 'themes'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import store from 'store'

const renderHeader = () => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <CustomThemeProvider>
          <Header />
        </CustomThemeProvider>
      </Provider>
    </MemoryRouter>
  )
}

describe('Layout', () => {
  describe('Header', () => {
    test('should have button with label connect wallet', () => {
      renderHeader()
      expect(screen.getByText('Connect Wallet')).toBeVisible()
    })

    test('should have nav item of length 5 with first element to bridge page.', () => {
      renderHeader()
      const links = screen.getAllByRole('link')
      expect(links.length).toBe(5)
      expect(links[0]).toHaveAttribute('href', '/bridge')
    })
  })
})
