/*
 * @Author: 郑杰14
 * @Date: 2020-06-11 14:00:15
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-08-28 21:31:29
 * @Description:
 */

const TOGGLE_CODEBODWIDTH = 'TOGGLE_CODEBODWIDTH'
const CHANGE_CODEVISIBLE = 'CHANGE_CODEVISIBLE'

const initState = {
  width: '0rem',
  codeVisible: false
}

export function main (state = initState, action) {
  switch (action.type) {
    case TOGGLE_CODEBODWIDTH:
      return {
        ...state,
        width: action.data
      }
    case CHANGE_CODEVISIBLE:
      return {
        ...state,
        codeVisible: action.data
      }
    default:
      return state
  }
}

export function toggleCodeBoxWidth (data) {
  return { type: TOGGLE_CODEBODWIDTH, data }
}

export function changeCodeBoxVisible (data) {
  return { type: CHANGE_CODEVISIBLE, data }
}
