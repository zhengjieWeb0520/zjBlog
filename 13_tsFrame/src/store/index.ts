/*
 * @Author: 郑杰14
 * @Date: 2021-04-15 22:04:02
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-04-15 22:21:06
 * @Description: store
 */
import { fromJS } from 'immutable'

const defaultState = fromJS({
  forced: false
})

export default (state = defaultState, action: any) => {
  return state
}
