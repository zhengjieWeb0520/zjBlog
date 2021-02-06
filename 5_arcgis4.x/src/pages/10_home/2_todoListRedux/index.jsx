import React, { useEffect, memo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTodoList, removeTodo, toggleTodo, addTodo } from './store'

const TodoItem = memo(function TodoItem (props) {
  const dispatch = useDispatch()
  const {
    todo: {
      id,
      name,
      complete
    }
  } = props

  const onClick = () => {
    dispatch(removeTodo(id))
  }

  const onChange = () => {
    dispatch(toggleTodo(id))
  }
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={complete}
        onChange={onChange}
      />
      <label className={complete ? 'complete' : ''}>{name}</label>
      <button onClick={onClick}>&#xd7;</button>
    </li>
  )
})

const Control = memo(function Control (params) {
  const dispatch = useDispatch()
  const inputRef = useRef()
  const onSubmit = (e) => {
    let idSqe = new Date()
    e.preventDefault()

    const newText = inputRef.current.value.trim()
    console.warn(newText)
    if (newText.length === 0) {
      return
    }

    const data = {
      id: ++idSqe,
      name: newText,
      complete: false
    }
    dispatch(addTodo(data))
    inputRef.current.value = ''
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

function TodoListRedux () {
  const todoList = useSelector(state => state.todoList)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getTodoList())
  }, [])
  useEffect(() => {
    console.warn(todoList)
  }, [todoList])
  return (
    <div id="react-hooks" className="todo-list">
      <Control />
      <ul className="todos">
        {
          todoList.todoList.map(todo => {
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

export default TodoListRedux
