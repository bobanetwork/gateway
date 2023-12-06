import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import networkService from 'services/networkService'
import CustomThemeProvider from 'themes'
import { LiquidityPoolLayer } from 'types/earn.types'
import { mockedInitialState } from 'util/tests'
import EarnListItem, { EarnListItemProps } from '.'

const mockStore = configureStore([thunk])

interface TestEarnListItemProps extends EarnListItemProps {
  accountEnabled?: boolean
  store?: any
}

jest.mock('services/networkService', () => {
  return {
    getL1LPInfo: jest.fn(),
    getL2LPInfo: jest.fn(),
    getReward: jest.fn(),
  }
})

const renderEarnListItemComponent = ({
  poolInfo,
  userInfo,
  chainId,
  tokenAddress,
  lpChoice,
  showMyStakeOnly,
  store,
}: TestEarnListItemProps) => {
  return render(
    <Provider store={store}>
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

const TokenAddress = '0x429582bde1b0e011c48d883354050938f194743f'

describe('EarnList ', () => {
  let lpChoice: any
  let showMyStakeOnly: boolean
  let tokenAddress: string
  let chainId: any
  let store

  let userInfo: any = {
    l2TokenAddress: '0x429582bde1b0e011c48d883354050938f194743f',
    amount: '0',
    pendingReward: '0',
    rewardDebt: '0',
  }

  let poolInfo: any = {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    l1TokenAddress: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
    l2TokenAddress: '0x429582bde1b0e011c48d883354050938f194743f',
    accUserReward: '0',
    accUserRewardPerShare: '0',
    userDepositAmount: '0',
    startTime: '1668555514',
    APR: 0,
    tokenBalance: '0',
  }

  beforeEach(() => {
    lpChoice = LiquidityPoolLayer.L1LP
    tokenAddress = TokenAddress
    showMyStakeOnly = false
    store = mockStore({
      ...mockedInitialState,
    })
    // @ts-ignore
    networkService.getL1LPInfo.mockImplementation(() =>
      Promise.resolve({ poolInfo: {}, userInfo: {} })
    )
    // @ts-ignore
    networkService.getL2LPInfo.mockImplementation(() =>
      Promise.resolve({ poolInfo: {}, userInfo: {} })
    )
  })

  test('should match snapshot when showMystake is disabled', () => {
    showMyStakeOnly = false
    const { asFragment } = renderEarnListItemComponent({
      lpChoice,
      showMyStakeOnly,
      userInfo,
      poolInfo,
      tokenAddress,
      chainId,
      store,
    })
    expect(asFragment).toBeTruthy()
    expect(asFragment()).toMatchSnapshot()
  })
  test('should match snapshot when showMystake is enable', () => {
    showMyStakeOnly = true
    const { asFragment } = renderEarnListItemComponent({
      lpChoice,
      showMyStakeOnly,
      userInfo,
      poolInfo,
      tokenAddress,
      chainId,
      store,
    })
    expect(asFragment).toBeTruthy()
    expect(asFragment()).toMatchSnapshot()
  })
  test('should match snapshot when lpChoice empty', () => {
    lpChoice = ''
    const { asFragment } = renderEarnListItemComponent({
      lpChoice,
      showMyStakeOnly,
      userInfo,
      poolInfo,
      tokenAddress,
      chainId,
      store,
    })
    expect(asFragment).toBeTruthy()
    expect(asFragment()).toMatchSnapshot()
  })
  test('should match snapshot when lpChoice L1LP', () => {
    lpChoice = LiquidityPoolLayer.L1LP
    const { asFragment } = renderEarnListItemComponent({
      lpChoice,
      showMyStakeOnly,
      userInfo,
      poolInfo,
      tokenAddress,
      chainId,
      store,
    })
    expect(asFragment).toBeTruthy()
    expect(asFragment()).toMatchSnapshot()
  })
  test('should match snapshot when lpChoice L2LP', () => {
    lpChoice = LiquidityPoolLayer.L2LP
    const { asFragment } = renderEarnListItemComponent({
      lpChoice,
      showMyStakeOnly,
      userInfo,
      poolInfo,
      tokenAddress,
      chainId,
      store,
    })
    expect(asFragment).toBeTruthy()
    expect(asFragment()).toMatchSnapshot()
  })
  test('should match snapshot when userreward is available', () => {
    showMyStakeOnly = true
    userInfo = {
      l2TokenAddress: '0x4200000000000000000000000000000000000023',
      amount: '43006000000000000000',
      pendingReward: '1100191312876000',
      rewardDebt: '27734072508676000',
    }

    poolInfo = {
      symbol: 'BOBA',
      name: 'Boba Token',
      decimals: 18,
      l1TokenAddress: '0xeccd355862591cbb4bb7e7dd55072070ee3d0fc1',
      l2TokenAddress: '0x4200000000000000000000000000000000000023',
      accUserReward: '24767238000000000',
      accUserRewardPerShare: '648705579',
      userDepositAmount: '565303100000000000000',
      startTime: '1668555549',
      APR: 0.004145006519156489,
      tokenBalance: '614833937808000000000',
    }

    store = mockStore({
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.setup,
        accountEnabled: true,
      },
    })

    const { asFragment } = renderEarnListItemComponent({
      lpChoice,
      showMyStakeOnly,
      userInfo,
      poolInfo,
      tokenAddress,
      chainId,
      store,
    })
    expect(asFragment).toBeTruthy()
    expect(asFragment()).toMatchSnapshot()
  })

  test('should match snapshot when userInfo or poolInfo is empty', () => {
    showMyStakeOnly = true
    userInfo = {}

    poolInfo = {}

    const { asFragment } = renderEarnListItemComponent({
      lpChoice,
      showMyStakeOnly,
      userInfo,
      poolInfo,
      tokenAddress,
      chainId,
      store,
    })
    expect(asFragment).toBeTruthy()
    expect(asFragment()).toMatchSnapshot()
  })

  test('should show and hide styledMenu on click of actionBtn', async () => {
    renderEarnListItemComponent({
      lpChoice,
      showMyStakeOnly,
      userInfo,
      poolInfo,
      tokenAddress,
      chainId,
      store,
    })

    fireEvent.click(screen.getByTestId('action-btn'))
    expect(screen.getByText('Unstake')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('presentation') as any)
    await waitForElementToBeRemoved(() => screen.queryByText('Unstake'))
  })

  describe('Handle unstake token', () => {
    test('should dispatch state with correct payload incase of L1LP ', () => {
      renderEarnListItemComponent({
        lpChoice,
        showMyStakeOnly,
        userInfo,
        poolInfo,
        tokenAddress,
        chainId,
        store,
      })

      fireEvent.click(screen.getByTestId('action-btn'))
      expect(screen.getByText('Unstake')).toBeInTheDocument()

      fireEvent.click(screen.getByTestId('Unstake'))

      const actions = store.getActions()
      expect(actions).toContainEqual({
        payload: {
          L1orL2Pool: 'L1LP',
          LPAddress: undefined,
          balance: 0,
          currency: undefined,
          decimals: undefined,
          symbol: undefined,
        },
        type: 'UPDATE_WITHDRAW_TOKEN',
      })
      expect(actions).toContainEqual({
        destNetworkSelection: undefined,
        fast: undefined,
        lock: undefined,
        payload: 'EarnWithdrawModal',
        proposalId: undefined,
        selectionLayer: undefined,
        token: undefined,
        tokenIndex: undefined,
        type: 'UI/MODAL/OPEN',
      })
    })
    test('should dispatch state with correct payload incase of L2LP ', () => {
      lpChoice = LiquidityPoolLayer.L2LP
      renderEarnListItemComponent({
        lpChoice,
        showMyStakeOnly,
        userInfo,
        poolInfo,
        tokenAddress,
        chainId,
        store,
      })

      fireEvent.click(screen.getByTestId('action-btn'))
      expect(screen.getByText('Unstake')).toBeInTheDocument()

      fireEvent.click(screen.getByTestId('Unstake'))

      const actions = store.getActions()
      expect(actions).toContainEqual({
        payload: {
          L1orL2Pool: 'L2LP',
          LPAddress: undefined,
          balance: '00',
          currency: undefined,
          decimals: undefined,
          symbol: undefined,
        },
        type: 'UPDATE_WITHDRAW_TOKEN',
      })
      expect(actions).toContainEqual({
        destNetworkSelection: undefined,
        fast: undefined,
        lock: undefined,
        payload: 'EarnWithdrawModal',
        proposalId: undefined,
        selectionLayer: undefined,
        token: undefined,
        tokenIndex: undefined,
        type: 'UI/MODAL/OPEN',
      })
    })
    test('should dispatch state with correct payload incase of empty ', () => {
      lpChoice = ''
      renderEarnListItemComponent({
        lpChoice,
        showMyStakeOnly,
        userInfo,
        poolInfo,
        tokenAddress,
        chainId,
        store,
      })

      fireEvent.click(screen.getByTestId('action-btn'))
      expect(screen.getByText('Unstake')).toBeInTheDocument()

      fireEvent.click(screen.getByTestId('Unstake'))

      const actions = store.getActions()
      expect(actions).toContainEqual({
        payload: {
          L1orL2Pool: '',
          LPAddress: undefined,
          balance: 0,
          currency: undefined,
          decimals: undefined,
          symbol: undefined,
        },
        type: 'UPDATE_WITHDRAW_TOKEN',
      })
      expect(actions).toContainEqual({
        destNetworkSelection: undefined,
        fast: undefined,
        lock: undefined,
        payload: 'EarnWithdrawModal',
        proposalId: undefined,
        selectionLayer: undefined,
        token: undefined,
        tokenIndex: undefined,
        type: 'UI/MODAL/OPEN',
      })
    })
  })
  describe('Handle harvest', () => {
    test('should dispatch state with correct payload incase of L1LP ', () => {
      renderEarnListItemComponent({
        lpChoice,
        showMyStakeOnly,
        userInfo,
        poolInfo,
        tokenAddress,
        chainId,
        store,
      })

      fireEvent.click(screen.getByTestId('action-btn'))
      expect(screen.getByText('Harvest')).toBeInTheDocument()

      fireEvent.click(screen.getByTestId('Harvest'))

      const actions = store.getActions()
      expect(actions).toContainEqual({ type: 'EARN/HARVEST/REQUEST' })
    })
    test('should dispatch state with correct payload incase of L2LP ', () => {
      lpChoice = LiquidityPoolLayer.L2LP
      renderEarnListItemComponent({
        lpChoice,
        showMyStakeOnly,
        userInfo,
        poolInfo,
        tokenAddress,
        chainId,
        store,
      })

      fireEvent.click(screen.getByTestId('action-btn'))
      expect(screen.getByText('Harvest')).toBeInTheDocument()

      fireEvent.click(screen.getByTestId('Harvest'))

      const actions = store.getActions()
      expect(actions).toContainEqual({ type: 'EARN/HARVEST/REQUEST' })
    })
  })
})
