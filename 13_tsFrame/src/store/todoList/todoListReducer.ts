/*
 * @Author: 郑杰14
 * @Date: 2021-04-17 21:33:49
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-04-19 21:49:30
 * @Description: todoListReducer
 */

import { fromJS } from 'immutable'
import {
  GET_TODOLIST,
  ADD_TODOLIST,
  REMOVE_TODOLIST,
  TOGGLE_TODOLIST,
  TodoListTypes
} from './todoListActions'

interface DefaultType {
  todoList: Array<any>
}
const defaultState: DefaultType = {
  todoList: []
}

export default (state = defaultState, action: TodoListTypes) => {
  switch (action.type) {
    case GET_TODOLIST:
      return {
        ...state,
        todoList: action.data
      }
    case ADD_TODOLIST:
      return {
        ...state,
        todoList: [...state.todoList, action.data]
      }
    case TOGGLE_TODOLIST:
      return {
        ...state,
        todoList: state.todoList.map((item: any) => {
          return item.id === action.id ?
            {
              ...item,
              complete: !item.complete
            }
            : item
        })
      }
    case REMOVE_TODOLIST:
      return {
        ...state,
        todoList: state.todoList.filter((item: any) => {
          return item.id !== action.id
        })
      }
    default:
      return state
  }
}
