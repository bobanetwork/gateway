import React from 'react'
import NotificationBanner from 'components/notificationBanner'
import { render, screen, fireEvent } from '@testing-library/react'
import CustomThemeProvider from 'themes'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { Network, NetworkType } from 'util/network/network.util'
import { BannerConfig } from '../bannerConfig'

jest.mock('../bannerConfig', () => ({
  BannerConfig: {
    ETHEREUM: {
      message: `Banner message lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum`,
      content: `Banner message lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumBanner message lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumBanner message lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumBanner message lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumBanner message lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum`,
    },
  },
}))

const data = BannerConfig[Network.ETHEREUM]

const mockStore = configureStore()

const renderBanner = (props: any) => {
  return render(
    <Provider
      store={mockStore({
        ui: {
          theme: 'dark',
        },
        network: {
          activeNetwork: Network.ETHEREUM,
          activeNetworkType: NetworkType.MAINNET,
        },
      })}
    >
      <CustomThemeProvider>
        <NotificationBanner {...props} />
      </CustomThemeProvider>
    </Provider>
  )
}

describe('NotificationBanner ', () => {
  test('should match snapshot without message', () => {
    const { asFragment } = renderBanner({})
    expect(asFragment()).toMatchSnapshot()
  })

  test('should match snapshot and check show banner when open set to true', () => {
    const { asFragment, container } = renderBanner({
      message: data.message,
      open: true,
    })
    expect(asFragment()).toMatchSnapshot()
    expect(container.firstChild).toHaveStyle(`max-height: unset`)
  })

  test('should show read more btn when the content present update view on click', () => {
    renderBanner({
      message: data.message,
      content: data.content,
      open: true,
    })
    const moreBtn = screen.getByRole('readMore')

    expect(moreBtn).toBeInTheDocument()
    //expect(screen.getByText(data.message)).toBeInTheDocument()
    expect(moreBtn).toHaveTextContent(/read more/i)
    expect(moreBtn).not.toHaveTextContent(/read less/i)

    fireEvent.click(moreBtn)
    expect(moreBtn).not.toHaveTextContent(/read more/i)
    //expect(screen.getByText(data.content)).toBeInTheDocument()
    expect(moreBtn).toHaveTextContent(/read less/i)
  })
})
