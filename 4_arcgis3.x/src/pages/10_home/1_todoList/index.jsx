import React, { useState, useCallback, useEffect } from 'react'
import Todos from './components/todos.jsx'
import Control from './components/control.jsx'
import './index.css'

function TodoList () {
  const [todos, setTodos] = useState([])

  const addTodo = useCallback((todo) => {
    setTodos(todos => [...todos, todo])
  }, [])

  const removeTodo = useCallback((id) => {
    setTodos(todos => todos.filter(todo => {
      return todo.id !== id
    }))
  }, [])

  const toggleTodo = useCallback((id) => {
    setTodos(todos => todos.map(todo => {
      return todo.id === id
        ? {
          ...todo,
          complete: !todo.complete
        }
        : todo
    }))
  }, [])
  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem('todoList') || '[]')
    setTodos(todos)
  }, [])
  useEffect(() => {
    localStorage.setItem('todoList', JSON.stringify(todos))
  }, [todos])

  return (
    <div id="react-hooks" className="todo-list">
      <Control addTodo={addTodo} />
      <Todos removeTodo={removeTodo} toggleTodo={toggleTodo} todos={todos} />
    </div>
  )
}

export default TodoList
