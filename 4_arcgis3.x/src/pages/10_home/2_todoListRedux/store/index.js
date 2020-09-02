import axios from 'axios'

const GET_TODOLIST = 'GET_TODOLIST'
const REMOVE_TODOLIST = 'REMOVE_TODOLIST'
const TOGGLE_TODOLIST = 'TOGGLE_TODOLIST'
const ADD_TODOLIST = 'ADD_TODOLIST'

const initState = {
  todoList: []
}

export function todoList (state = initState, action) {
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
        todoList: state.todoList.map(item => {
          return item.id === action.id
            ? {
              ...item,
              complete: !item.complete
            }
            : item
        })
      }
    case REMOVE_TODOLIST:
      return {
        ...state,
        todoList: state.todoList.filter(item => {
          return item.id !== action.id
        })
      }
    default:
      return state
  }
}

export function getTodoList () {
  return dispatch => {
    axios.get('./data/userList.json')
      .then(res => {
        if (res.status === 200) {
          const data = res.data
          console.warn(data)
          dispatch({ type: GET_TODOLIST, data })
        }
      })
  }
}

export function addTodo (data) {
  return { type: ADD_TODOLIST, data }
}

export function toggleTodo (id) {
  return { type: TOGGLE_TODOLIST, id }
}

export function removeTodo (id) {
  // return dispatch => {
  //   dispatch()
  // }
  return { type: REMOVE_TODOLIST, id }
  // return { type: REMOVE_TODOLIST, data }
}
