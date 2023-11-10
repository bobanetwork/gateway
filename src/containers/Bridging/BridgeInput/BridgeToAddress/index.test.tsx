import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import CustomThemeProvider from 'themes'
import { mockedInitialState } from 'util/tests'
import BridgeToAddress from '.'

const mockStore = configureStore([thunk])

const renderBridgeToAddress = ({ store }: any) => {
  return render(
    <Provider store={store}>
      <CustomThemeProvider>
        <BridgeToAddress />
      </CustomThemeProvider>
    </Provider>
  )
}

describe('BridgeToAddress', () => {
  let store
  beforeEach(() => {
    store = mockStore({
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.bridge,
        accountEnabled: true,
        netLayer: 'L1',
      },
      bridge: {
        ...mockedInitialState.bridge,
        bridgeToAddressState: true,
      },
    })
  })
  test('should match Snapshot in case of L1 & Classic Bridge ', () => {
    const { asFragment } = renderBridgeToAddress({
      store,
    })
    expect(asFragment()).toMatchSnapshot()
  })

  test('Should update state with address on change input', async () => {
    renderBridgeToAddress({ store })

    const input = screen.getByPlaceholderText('Enter destination address')

    fireEvent.change(input, { target: { value: 'RECIEPIENT_ADDRESS' } })

    const actions = store.getActions()

    expect(actions).toEqual([
      {
        payload: 'RECIEPIENT_ADDRESS',
        type: 'BRIDGE/DESTINATION_ADDRESS/SET',
      },
    ])
  })

  test('Should update state with address on click of paste button', async () => {
    const clipboardMock = {
      readText: jest.fn(),
    }
    ;(global as any).navigator.clipboard = clipboardMock
    ;(navigator.clipboard.readText as jest.Mock).mockReturnValue(
      'RECIEPIENT_ADDRESS'
    )
    const actions = store.getActions()
    renderBridgeToAddress({ store })
    const pasteBtn = screen.getByText('Paste')
    await fireEvent.click(pasteBtn)
    expect(navigator.clipboard.readText).toHaveBeenCalled()
    expect(actions).toEqual([
      {
        payload: 'RECIEPIENT_ADDRESS',
        type: 'BRIDGE/DESTINATION_ADDRESS/SET',
      },
    ])
    ;(navigator.clipboard.readText as jest.Mock).mockReturnValue(0)
    store.clearActions()
    const newActions = store.getActions()
    await fireEvent.click(pasteBtn)
    expect(navigator.clipboard.readText).toHaveBeenCalled()
    expect(newActions).toEqual([])
  })

  test('should match Snapshot in case of L2 & Fast Bridge ', () => {
    store = mockStore({
      ...mockedInitialState,
      setup: {
        ...mockedInitialState.bridge,
        accountEnabled: true,
        netLayer: 'L2',
      },
      bridge: {
        ...mockedInitialState.bridge,
        bridgeToAddressState: true,
      },
    })
    const { asFragment } = renderBridgeToAddress({
      store,
    })
    expect(asFragment()).toMatchSnapshot()
  })
})
