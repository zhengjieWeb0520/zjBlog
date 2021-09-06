/*
 * @Author: 郑杰14
 * @Date: 2021-04-20 10:39:10
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-04-20 14:47:44
 * @Description: todoListHooks
 */
import React, { useEffect, useState, useCallback, useRef, memo } from 'react'
import axios from 'axios'

interface ControlPropsTypes {
  addTodo: (val: any) => void
}

const Control: React.FC<ControlPropsTypes> = memo((props) => {
  const { addTodo } = props
  const inputRef = useRef<HTMLInputElement>(null)

  const onSubmit = (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault()
    if (inputRef.current) {
      const newText = inputRef.current.value.trim()

      if (newText.length === 0) {
        return
      }

      addTodo({
        id: Math.floor((Math.random() * 100) + 1),
        name: newText,
        type: 2,
        complete: false
      })
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
interface TodoItemProps {
  key: Number,
  todo: any,
  todoList: Array<any>,
  removeTodo: (val: number) => void,
  toggleTodo: (val: number) => void
}

const TodoItem: React.FC<TodoItemProps> = memo((props) => {
  const {
    todo: {
      id,
      name,
      complete
    },
    removeTodo,
    toggleTodo
  } = props

  const onClick = () => {
    removeTodo(id)
  }

  const onChange = () => {
    toggleTodo(id)
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

interface todoListItemType {
  id: number,
  name: String,
  type: String,
  complete: boolean
}

const TodoListHooks: React.FC = () => {
  const [todoList, setTodoList] = useState<Array<todoListItemType>>([])
  useEffect(() => {
    axios.get('./data/userList.json')
      .then((res) => {
        if (res.status === 200) {
          const { data } = res
          setTodoList(data)
        }
      })
  }, [])

  const addTodo = useCallback(
    (todo) => {
      setTodoList((todoList) => [...todoList, todo])
    },
    [],
  )

  const removeTodo = useCallback(
    (id:number) => {
      setTodoList((todoList) => todoList.filter((todo) => {
        return todo.id !== id
      }))
    },
    [],
  )

  const toggleTodo = useCallback(
    (id: number) => {
      setTodoList((todoList) => todoList.map((todo) => {
        return todo.id === id
          ? {
            ...todo,
            complete: !todo.complete
          }
          : todo
      }))
    },
    [],
  )
  return (
    <div id="todoList" className="todo-list">
      <Control addTodo={addTodo} />
      <ul className="todos">
        {
          todoList.map((todo: any) => {
            return (
              <TodoItem
                key={todo.id}
                todo={todo}
                todoList={todoList}
                removeTodo={removeTodo}
                toggleTodo={toggleTodo}
              />
            )
          })
        }
      </ul>
    </div>
  )
}
export default TodoListHooks
