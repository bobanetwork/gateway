import React, { FC } from 'react'
import { StyledNav, NavLinkItem } from './style'
import { MENU_LIST } from './constant'
import { MenuProps } from './types'
import { useSelector } from 'react-redux'
import { selectActiveNetwork, selectActiveNetworkType } from 'selectors'
import { Network, NetworkType } from 'util/network/network.util'

/**
 *
 * Below pages will be available for all networks
 *
 * History
 * Ecosystem
 * Bridge
 * Earn
 *
 * Stake / Dao - Only available for eth Boba (Testnet / Mainnet)
 *
 * Filter is not required on menulist as we can force user to
 * connect to boba network on stake & dao page.
 *
 * @param isOpen - is the flag to open and show the menu in case of mobile view.
 *
 *
 * @returns
 */

const Navigation: FC<MenuProps> = ({ isOpen }) => {
  const activeNetwork = useSelector(selectActiveNetwork())
  const activeNetworkType = useSelector(selectActiveNetworkType())

  return (
    <StyledNav>
      {MENU_LIST.map((menu) => {
        if (['Stake', 'Dao'].includes(menu.label)) {
          if (
            activeNetworkType === NetworkType.TESTNET ||
            activeNetwork !== Network.ETHEREUM
          ) {
            return null
          }
        }

        return (
          <NavLinkItem key={menu.label} to={menu.path}>
            {menu.label}
          </NavLinkItem>
        )
      })}
    </StyledNav>
  )
}

export default Navigation
