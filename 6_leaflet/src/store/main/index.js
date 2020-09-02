/*
 * @Author: 郑杰14
 * @Date: 2020-06-11 14:00:15
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-06-11 14:02:54
 * @Description:
 */

const TOGGLE_CODEBODWIDTH = 'TOGGLE_CODEBODWIDTH'

const initState = {
  width: '0rem'
}

export function main (state = initState, action) {
  switch (action.type) {
    case TOGGLE_CODEBODWIDTH:
      return {
        ...state,
        width: action.data
      }
    default:
      return state
  }
}

export function toggleCodeBoxWidth (data) {
  return { type: TOGGLE_CODEBODWIDTH, data }
}
