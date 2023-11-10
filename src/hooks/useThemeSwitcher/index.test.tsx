import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import useThemeSwitcher from './'
import { setTheme } from 'actions/uiAction'
import { THEME_NAME } from 'components/layout/Header/types'
import { mockedInitialState } from 'util/tests'
import { AnyAction } from 'redux'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('useThemeSwitcher', () => {
  it('Light version has to be update', () => {
    const store = mockStore(mockedInitialState)
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useThemeSwitcher(), {
      wrapper,
    })

    act(() => {
      result.current.setThemeLight()
    })

    expect(localStorage.getItem('theme')).toBe(THEME_NAME.LIGHT)

    const actions: AnyAction[] = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/THEME/UPDATE',
      payload: THEME_NAME.LIGHT,
    })
  })

  it('Dark version has to be update', () => {
    const store = mockStore(mockedInitialState)
    const wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useThemeSwitcher(), {
      wrapper,
    })

    act(() => {
      result.current.setThemeDark()
    })

    expect(localStorage.getItem('theme')).toBe(THEME_NAME.DARK)
    const actions: AnyAction[] = store.getActions()
    expect(actions).toContainEqual({
      type: 'UI/THEME/UPDATE',
      payload: THEME_NAME.DARK,
    })
  })
})
