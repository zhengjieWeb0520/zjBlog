/*
 * @Author: 郑杰14
 * @Date: 2021-04-17 23:40:53
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-04-20 10:21:14
 * @Description: todoList
 */

import React, { useEffect, useRef, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store/store'
import { addTodoList, getTodoList, removeTodoList, toggleTodoList } from '../../../store/todoList/todoListActions'
import './index.scss'

interface TodoItemProps {
  key: Number,
  todo: any,
  todoList: Array<any>
}

const Control: React.FC = memo(() => {
  const dispatch = useDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  const onSubmit = (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault()
    let idSqe:any = new Date()

    if (inputRef.current) {
      const newText = inputRef.current.value.trim()

      if (newText.length === 0) {
        return
      }
      dispatch(addTodoList(++idSqe, newText, 3, false))
      inputRef.current.value = ''
    }
  }
  return (
    <ul className="control">
      <h1>todos</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="请输入todo！"
          className="new-todo"
          ref={inputRef}
        />
      </form>
    </ul>
  )
})
const TodoItem: React.FC<TodoItemProps> = memo((props) => {
  const dispatch = useDispatch()
  const {
    todo: {
      id,
      name,
      complete
    }
  } = props

  const onClick = () => {
    dispatch(removeTodoList(id))
  }

  const onChange = () => {
    dispatch(toggleTodoList(id))
  }
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={complete}
        onChange={onChange}
      />
      <span className={complete ? 'complete' : ''}>{name}</span>
      <button onClick={onClick}>&#xd7;</button>
    </li>
  )
})

const TodoList: React.FC = () => {
  const todoList = useSelector((state: RootState) => state.todoListReducer)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getTodoList())
  }, [])
  useEffect(() => {
    console.warn(todoList)
  }, [todoList])
  return (
    <div id="todoList" className="todo-list">
      <Control />
      <ul className="todos">
        {
          todoList.todoList.map((todo:any) => {
            return (
              <TodoItem
                key={todo.id}
                todo={todo}
                todoList={todoList.todoList}
              />
            )
          })
        }
      </ul>
    </div>
  )
}
export default TodoList
