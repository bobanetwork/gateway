import { logAmount } from "util/amountConvert";
import networkService from "./networkService";
class GasService {

  /**
   * @getGas
   *  Fetchs latest gas price & block number of (L1/L2) for currently selected active network.
   * 
  */

  async getGas() {
    try {
      // get gas price
      const feeDataL1 = await networkService.L1Provider.getFeeData()
      const feeDataL2 = await networkService.L2Provider.getFeeData()
      // get block count
      const block1 = await networkService.L1Provider.getBlockNumber()
      const block2 = await networkService.L2Provider.getBlockNumber()

      const gasData = {
        gasL1: Number(logAmount(feeDataL1.gasPrice.toString(), 9)).toFixed(0),
        gasL2: Number(logAmount(feeDataL2.gasPrice.toString(), 9)).toFixed(0),
        blockL1: Number(block1),
        blockL2: Number(block2),
      }
      return gasData
    } catch (error) {
      console.log("GS: getGas", error)
      return error
    }
  }

}

const gasService = new GasService();

export default gasService;
