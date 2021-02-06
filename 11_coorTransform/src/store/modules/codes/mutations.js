/*
 * @Author: 郑杰14
 * @Date: 2020-07-30 13:45:25
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-07-30 17:29:54
 * @Description:
 */
import * as types from './mutation-types'

export default {
  [types.SAVE_ORIGINAL_CODES] (state, codes) {
    state.originalCodes = codes
  },
  [types.SAVR_VALIDATION_CODES] (state, codes) {
    state.validationCodes = codes
  },
  [types.SAVE_TRANSFORM_CODES] (state, codes) {
    state.transformCodes = codes
  },
  [types.SAVE_SELECTED_ORIGIN] (state, coor) {
    state.selectedOrigin = coor
  },
  [types.SAVE_SELECTED_TRANSFORM] (state, coor) {
    state.selectedTransform = coor
  }
}
