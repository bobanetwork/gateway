/*
  Varna - A Privacy-Preserving Marketplace
  Varna uses Fully Homomorphic Encryption to make markets fair. 
  Copyright (C) 2021 Enya Inc. Palo Alto, CA

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

const countDecimals = (num) => {
  let len = 0
  try {
    num = Number(num)
    let str = num.toString().toUpperCase()
    if (str.split('E').length === 2) {
      // scientific notation
      let isDecimal = false
      if (str.split('.').length === 2) {
        str = str.split('.')[1]
        if (parseInt(str.split('E')[0], 10) !== 0) {
          isDecimal = true
        }
      }
      const x = str.split('E')
      if (isDecimal) {
        len = x[0].length
      }
      len -= parseInt(x[1], 10)
    } else if (str.split('.').length === 2) {
      // decimal
      if (parseInt(str.split('.')[1], 10) !== 0) {
        len = str.split('.')[1].length
      }
    }
  } catch (e) {
    throw e
  } finally {
    if (isNaN(len) || len < 0) {
      len = 0
    }
  }
  return len
}

export { countDecimals }
