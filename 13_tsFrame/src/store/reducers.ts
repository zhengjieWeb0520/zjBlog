/*
 * @Author: 郑杰14
 * @Date: 2021-04-15 22:07:46
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-04-17 23:31:19
 * @Description: reducer
 */
import { combineReducers } from 'redux'
import todoListReducer from './todoList/todoListReducer'

export default combineReducers({ todoListReducer })
