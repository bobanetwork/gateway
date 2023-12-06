import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import CustomThemeProvider from 'themes'
import { mockedInitialState } from 'util/tests'
import EarnList, { EarnListProps } from '.'
import { LiquidityPoolLayer } from 'types/earn.types'

const mockStore = configureStore([thunk])

const renderEarnComponent = ({ lpChoice, showMyStakeOnly }: EarnListProps) => {
  return render(
    <Provider store={mockStore(mockedInitialState)}>
      <BrowserRouter>
        <CustomThemeProvider>
          <EarnList lpChoice={lpChoice} showMyStakeOnly={showMyStakeOnly} />
        </CustomThemeProvider>
      </BrowserRouter>
    </Provider>
  )
}

describe('EarnList ', () => {
  test('should match snapshot in case no data', () => {
    const { asFragment } = renderEarnComponent({
      lpChoice: LiquidityPoolLayer.L1LP,
      showMyStakeOnly: false,
    })
    expect(asFragment).toBeTruthy()
    expect(asFragment()).toMatchSnapshot()
  })
  xtest('should match snapshot with data', () => {
    // TODO: updated the initial state with static data to feed to earn list.
    const { asFragment } = renderEarnComponent({
      lpChoice: LiquidityPoolLayer.L1LP,
      showMyStakeOnly: false,
    })
    expect(asFragment).toBeTruthy()
    expect(asFragment()).toMatchSnapshot()
  })
})
