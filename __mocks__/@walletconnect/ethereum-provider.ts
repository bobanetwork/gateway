/* Mocking node_modules 
  As we there is issue while running the jest unit test 
  crash!
  ```
  
   TypeError: Cannot read properties of undefined (reading 'base16')

      15 | limitations under the License.
      16 |
    > 17 | import {EthereumProvider} from '@walletconnect/ethereum-provider'
         | ^
      
      at Object.<anonymous> (node_modules/uint8arrays/cjs/src/util/bases.js:42:21)
      at Object.<anonymous> (node_modules/uint8arrays/cjs/src/from-string.js:5:13)
      at Object.<anonymous> (node_modules/uint8arrays/cjs/src/index.js:8:18)
      at Object.<anonymous> (node_modules/@walletconnect/utils/dist/index.cjs.js:1:324)
      at Object.<anonymous> (node_modules/@walletconnect/ethereum-provider/dist/index.cjs.js:1:177)
      at Object.<anonymous> (src/services/wallet.service.js:17:1)
      at Object.<anonymous> (src/services/networkService.js:86:1)
      at Object.<anonymous> (src/components/global/addToMetamask/index.tsx:4:1)
      at Object.<anonymous>(src / components / global / index.ts: 1: 1)
        
  ```
*/

export const EthereumProvider = jest.fn()

EthereumProvider.mockImplementation(() => {
  return {
    on: jest.fn(),
    connect: jest.fn(),
    enable: jest.fn(),
    disconnect: jest.fn(),
  }
})

export default EthereumProvider
