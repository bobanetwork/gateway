import Stake from '../helpers/stake'
const stake = new Stake()

describe('Testing Entire Site', () => {
  describe('Stake', () => {
    describe('Before wallet is connected', () => {
      before(() => {
        stake.visit()
        stake.store.verifyReduxStoreSetup('baseEnabled', true)
      })
      describe('Stake Layout', () => {
        it('Should have the correct title', () => {
          stake.checkTitle()
          stake.checkDescription()
        })
      })
    })
  })
})
