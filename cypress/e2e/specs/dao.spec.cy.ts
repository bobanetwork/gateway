import Dao from '../helpers/dao'
const dao = new Dao()

describe('Testing Entire Site', () => {
  describe('Dao', () => {
    describe('Before wallet is connected', () => {
      before(() => {
        dao.visit()
        dao.store.verifyReduxStoreSetup('baseEnabled', true)
      })
      describe('Dao Layout', () => {
        it('Should have the correct title', () => {
          dao.checkTitle()
          dao.checkDescription()
        })
      })
    })
  })
})
