/*
Copyright 2021-present Boba Network.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import { ethers } from 'ethers'
import erc20abi from 'human-standard-token-abi'
import networkService from 'services/networkService'
import store from 'store'

/*
Returns Token info
If we don't have the info, try to get it
*/

/*
EVERYTHING IS INDEXED BY L1 TOKEN ADDRESS
*/

const ETHL1 = '0x0000000000000000000000000000000000000000'
const ETHL2 = '0x4200000000000000000000000000000000000006'

export const getToken = async (tokenContractAddressL1: string) => {
  if (tokenContractAddressL1 === null) {
    return
  }

  //this *might* be coming from a person, and or copy-paste from Etherscan
  //so need toLowerCase()
  /*****************************************************************/
  const _tokenContractAddressL1 = tokenContractAddressL1.toLowerCase()
  /*****************************************************************/

  const state = store.getState()

  if (state.tokenList[_tokenContractAddressL1]) {
    return state.tokenList[_tokenContractAddressL1]
  } else {
    const tokenInfo = await addToken(_tokenContractAddressL1)
    return tokenInfo
  }
}

/*
Get the token info from networkService.web3.eth.Contract
*/
export const addToken = async (tokenContractAddressL1: string) => {
  if (tokenContractAddressL1 === null) {
    return
  }

  const state = store.getState()

  //this *might* be coming from a person, and or copy-past from Etherscan
  //so need to toLowerCase()
  /*****************************************************************/
  const _tokenContractAddressL1 = tokenContractAddressL1.toLowerCase()
  /*****************************************************************/
  //if we already have looked it up, no need to look up again.
  if (state.tokenList[_tokenContractAddressL1]) {
    return state.tokenList[_tokenContractAddressL1]
  }

  try {
    const tA: any = networkService.tokenAddresses
    let tokenContract
    let _tokenContractAddressL2: string

    /********* DO WE HAVE L2 DATA?? *************/
    // Let's go see

    if (_tokenContractAddressL1 === 'xboba') {
      _tokenContractAddressL2 = tA['xBOBA']?.L2?.toLowerCase()
      tokenContract = new ethers.Contract(
        _tokenContractAddressL2,
        erc20abi,
        networkService.L2Provider!
      )
    } else if (_tokenContractAddressL1 === 'wagmiv0') {
      _tokenContractAddressL2 = tA['WAGMIv0']?.L2?.toLowerCase()
      tokenContract = new ethers.Contract(
        _tokenContractAddressL2,
        erc20abi,
        networkService.L2Provider!
      )
    } else if (_tokenContractAddressL1 === 'wagmiv1') {
      _tokenContractAddressL2 = tA['WAGMIv1']?.L2?.toLowerCase()
      tokenContract = new ethers.Contract(
        _tokenContractAddressL2,
        erc20abi,
        networkService.L2Provider!
      )
    } else if (_tokenContractAddressL1 === 'wagmiv2') {
      _tokenContractAddressL2 = tA['WAGMIv2']?.L2?.toLowerCase()
      tokenContract = new ethers.Contract(
        _tokenContractAddressL2,
        erc20abi,
        networkService.L2Provider!
      )
    } else if (_tokenContractAddressL1 === 'wagmiv2-oolong') {
      _tokenContractAddressL2 = tA['WAGMIv2-Oolong']?.L2?.toLowerCase()
      tokenContract = new ethers.Contract(
        _tokenContractAddressL2,
        erc20abi,
        networkService.L2Provider!
      )
    } else if (_tokenContractAddressL1 === 'wagmiv3') {
      _tokenContractAddressL2 = tA['WAGMIv3']?.L2?.toLowerCase()
      tokenContract = new ethers.Contract(
        _tokenContractAddressL2,
        erc20abi,
        networkService.L2Provider!
      )
    } else if (_tokenContractAddressL1 === 'wagmiv3-oolong') {
      _tokenContractAddressL2 = tA['WAGMIv3-Oolong']?.L2?.toLowerCase()
      tokenContract = new ethers.Contract(
        _tokenContractAddressL2,
        erc20abi,
        networkService.L2Provider!
      )
    } else if (_tokenContractAddressL1 === 'olo') {
      _tokenContractAddressL2 = tA['OLO']?.L2?.toLowerCase()
      tokenContract = new ethers.Contract(
        _tokenContractAddressL2,
        erc20abi,
        networkService.L2Provider!
      )
    } else {
      Object.keys(tA).forEach((token) => {
        //let's see if we know about this Token
        if (_tokenContractAddressL1 === tA[token].L1.toLowerCase()) {
          _tokenContractAddressL2 = tA[token]?.L2?.toLowerCase()
        }
      })
      tokenContract = new ethers.Contract(
        _tokenContractAddressL1,
        erc20abi,
        networkService.L1Provider! //Everything is defined by the L1 address - will deal with the L2 address later
      )
    }

    let _symbolL1
    let _decimals
    let _name

    if (ethers.utils.isAddress(_tokenContractAddressL1)) {
      const tmpTokenInfo =
        networkService.tokenInfo!.L1[
          ethers.utils.getAddress(_tokenContractAddressL1)
        ]
      if (tmpTokenInfo) {
        _symbolL1 = tmpTokenInfo.symbol
        _decimals = tmpTokenInfo.decimals
        _name = tmpTokenInfo.name
      }
    }

    if (!_symbolL1 || !_decimals || !_name) {
      ;[_symbolL1, _decimals, _name] = await Promise.all([
        tokenContract.symbol(),
        tokenContract.decimals(),
        tokenContract.name(),
      ]).catch(() => [null, null, null])
    }

    const decimals = _decimals
      ? Number(_decimals.toString())
      : 'NOT ON ETHEREUM'
    const symbolL1 = _symbolL1 || 'NOT ON ETHEREUM'
    const symbolL2 = _symbolL1 || 'NOT ON ETHEREUM'
    const name = _name || 'NOT ON ETHEREUM'

    //ETH is special as always
    if (_tokenContractAddressL1 === ETHL1) {
      _tokenContractAddressL2 = ETHL2
    }

    const tokenInfo = {
      currency:
        _symbolL1 === 'xBOBA' ||
        _symbolL1 === 'WAGMIv0' ||
        _symbolL1 === 'WAGMIv1' ||
        _symbolL1 === 'WAGMIv2' ||
        _symbolL1 === 'WAGMIv2-Oolong' ||
        _symbolL1 === 'WAGMIv3' ||
        _symbolL1 === 'WAGMIv3-Oolong'
          ? _tokenContractAddressL2!
          : _tokenContractAddressL1,
      addressL1: _tokenContractAddressL1,
      addressL2: _tokenContractAddressL2!,
      symbolL1,
      symbolL2,
      decimals,
      name,
      redalert: !_decimals,
    }

    store.dispatch({
      type: 'TOKEN/GET/SUCCESS',
      payload: tokenInfo,
    })

    return tokenInfo
  } catch (error) {
    console.log(`error while add token`, error)
    store.dispatch({
      type: 'TOKEN/GET/FAILURE',
      payload: {
        currency: _tokenContractAddressL1,
        addressL1: _tokenContractAddressL1,
        addressL2: '',
        symbol: 'Not found',
        error: 'Not found',
      },
    })

    return {
      currency: _tokenContractAddressL1,
      addressL1: _tokenContractAddressL1,
      addressL2: '',
      symbol: 'Not found',
      error: 'Not found',
    }
  }
}
