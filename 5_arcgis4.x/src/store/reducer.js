/*
 * @Author: 郑杰14
 * @Date: 2020-06-09 16:44:02
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-07-04 12:53:40
 * @Description:
 */
import { combineReducers } from 'redux'
import { main } from './main'
import { todoList } from '../pages/10_home/2_todoListRedux/store/index'

export default combineReducers({
  todoList,
  main
})
