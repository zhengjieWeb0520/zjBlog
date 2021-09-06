/*
 * @Author: 郑杰14
 * @Date: 2021-04-17 21:33:59
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-04-20 10:21:57
 * @Description: todoList actions
 */
import axios from 'axios'

export const GET_TODOLIST = 'GER_TODOLIST'
export const ADD_TODOLIST = 'ADD_TODOLIST'
export const REMOVE_TODOLIST = 'REMOVE_TODOLIST'
export const TOGGLE_TODOLIST = 'TOGGLE_TODOLIST'

interface AddTodoListAction {
  type: typeof ADD_TODOLIST,
  data: { id: number, name: String, type: number, complete: boolean }
}

interface RemoveTodoListAction {
  type: typeof REMOVE_TODOLIST,
  id: number
}

interface ToggleTodoListAction {
  type: typeof TOGGLE_TODOLIST,
  id: number
}

interface GetTodoListAction {
  type: typeof GET_TODOLIST,
  data: Array<any>
}

export type TodoListTypes = AddTodoListAction | RemoveTodoListAction | ToggleTodoListAction | GetTodoListAction

/**
 * 添加todo
 * @param data
 * @returns
 */
export const addTodoList = (id: number, name: String, type: number, complete: boolean): TodoListTypes => {
  return {
    type: ADD_TODOLIST,
    data: { id, name, type, complete }
  }
}

/**
 * 移除todo
 * @param id
 * @returns
 */
export const removeTodoList = (id: number): TodoListTypes => {
  return {
    type: REMOVE_TODOLIST,
    id
  }
}

/**
 * 切换todo
 * @param id
 * @returns
 */
export const toggleTodoList = (id: number): TodoListTypes => {
  return {
    type: TOGGLE_TODOLIST,
    id
  }
}

export const getTodoList = () => {
  return (dispatch: any) => {
    axios.get('./data/userList.json')
      .then((res) => {
        if (res.status === 200) {
          const { data } = res
          dispatch({ type: GET_TODOLIST, data })
        }
      })
  }
}
