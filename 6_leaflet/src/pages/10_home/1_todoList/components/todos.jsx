import React, { memo } from 'react'

const TodoItem = memo(function TodoItem (props) {
  const {
    todo: {
      id,
      text,
      complete
    },
    toggleTodo,
    removeTodo
  } = props

  const onChange = () => {
    toggleTodo(id)
  }

  const onClick = () => {
    removeTodo(id)
  }
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={complete}
        onChange={onChange}
      />
      <label className={complete ? 'complete' : ''}>{text}</label>
      <button onClick={onClick}>&#xd7;</button>
    </li>
  )
})
const Todos = memo(function Todos (props) {
  const {
    todos,
    toggleTodo,
    removeTodo
  } = props

  return (
    <ul className="todos">
      {
        todos.map(todo => {
          return (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleTodo={toggleTodo}
              removeTodo={removeTodo}
            />
          )
        })
      }
    </ul>
  )
})

export default Todos
