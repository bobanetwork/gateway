import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import CustomThemeProvider from 'themes'
import { mockedInitialState } from 'util/tests'
import EarnList from '.'
import { LiquidityPoolLayer, EarnListProps } from 'types/earn.types'
import { mockDataEarn } from './mockdata'

const mockStore = configureStore([thunk])

interface TestEarnListProps extends EarnListProps {
  earnMockData?: any
}

const renderEarnListComponent = ({
  lpChoice,
  showMyStakeOnly,
  earnMockData,
}: TestEarnListProps) => {
  return render(
    <Provider
      store={mockStore({
        ...mockedInitialState,
        earn: {
          ...mockedInitialState.earn,
          ...earnMockData,
        },
      })}
    >
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
    const { asFragment } = renderEarnListComponent({
      lpChoice: LiquidityPoolLayer.L1LP,
      showMyStakeOnly: false,
    })
    expect(asFragment).toBeTruthy()
    expect(asFragment()).toMatchSnapshot()
  })
  test('should match snapshot with data', () => {
    const { asFragment } = renderEarnListComponent({
      lpChoice: LiquidityPoolLayer.L1LP,
      showMyStakeOnly: false,
      earnMockData: mockDataEarn,
    })
    expect(asFragment).toBeTruthy()
    expect(asFragment()).toMatchSnapshot()
  })
})
