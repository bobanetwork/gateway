import History from '../helpers/history'
const history = new History()

describe('Testing Entire Site', () => {
  describe('History', () => {
    describe('Before wallet is connected', () => {
      before(() => {
        history.visit()
        history.store.verifyReduxStoreSetup('baseEnabled', true)
      })
      describe('History Layout', () => {
        it('Should have the correct title', () => {
          history.checkTitle()
        })
      })
    })
  })
})
