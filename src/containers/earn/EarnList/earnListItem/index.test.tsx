import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import CustomThemeProvider from 'themes'
import { mockedInitialState } from 'util/tests'
import EarnListItem, { EarnListItemProps } from '.'
import { LiquidityPoolLayer } from 'types/earn.types'

const mockStore = configureStore([thunk])

const renderEarnComponent = ({
  poolInfo,
  userInfo,
  chainId,
  tokenAddress,
  lpChoice,
  showMyStakeOnly = false,
}: EarnListItemProps) => {
  return render(
    <Provider store={mockStore(mockedInitialState)}>
      <BrowserRouter>
        <CustomThemeProvider>
          <EarnListItem
            poolInfo={poolInfo}
            userInfo={userInfo}
            chainId={chainId}
            tokenAddress={tokenAddress}
            lpChoice={lpChoice}
            showMyStakeOnly={showMyStakeOnly}
          />
        </CustomThemeProvider>
      </BrowserRouter>
    </Provider>
  )
}

describe('EarnList ', () => {
  test('should match snapshot when showMystake is disabled', () => {})
  test('should match snapshot when showMystake is enable', () => {})
  test('should match snapshot when lpChoice L1LP', () => {})
  test('should match snapshot when lpChoice L2LP', () => {})
  test('should match snapshot when userreward is available', () => {})
})
