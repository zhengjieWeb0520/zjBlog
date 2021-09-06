/*
 * @Author: 郑杰14
 * @Date: 2021-04-20 15:11:12
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-04-21 11:56:24
 * @Description: todoList 类组件
 */
import React, { Component } from 'react'
import axios from 'axios'

interface IControlProps {
  inputRef: any,
  addTodo: (val: any) => void,
}
class Control extends Component<IControlProps> {
  // constructor(props: any) {
  //   super(props)
  //   this.inputRef = React.createRef()
  // }
  // static defaultProps = {
  //   inputRef: React.createRef()
  // }

  onSubmit = () => {}

  render() {
    return (
      <ul className="control">
        <h1>todos</h1>
        <form onSubmit={() => this.onSubmit()}>
          <input
            type="text"
            placeholder="请输入todo！"
            className="new-todo"
            // ref={this.props.inputRef}
          />
        </form>
      </ul>
    )
  }
}

interface ITodoItemProps {
  todo: any,
  todoList: Array<any>,
  removeTodo: (id: number) => void,
  toggleTodo: (id: number) => void
}
class TodoItem extends Component<ITodoItemProps> {
  onChange = () => {
    const {
      todo: {
        id
      },
      toggleTodo
    } = this.props
    toggleTodo(id)
  }

  onClick = () => {
    const {
      todo: {
        id
      },
      removeTodo
    } = this.props
    removeTodo(id)
  }

  render() {
    const {
      todo: {
        name,
        complete
      }
    } = this.props
    return (
      <li className="todo-item">
        <input
          type="checkbox"
          checked={complete}
          onChange={() => this.onChange()}
        />
        <span className={complete ? 'complete' : ''}>{name}</span>
        <button onClick={() => this.onClick()}>&#xd7;</button>
      </li>
    )
  }
}

interface ITodoListProps { }
interface ITodoListState {
  todoList: Array<any>
}
class TodoList extends Component<ITodoListProps, ITodoListState> {
  constructor(props: ITodoListProps) {
    super(props)
    this.state = {
      todoList: []
    }
  }

  componentDidMount() {
    axios.get('./data/userList.json')
      .then((res) => {
        if (res.status === 200) {
          const { data } = res
          this.setState({
            todoList: data
          })
        }
      })
  }

  addTodo = () => {}

  removeTodo = (id: number) => {
    const { todoList } = this.state
    const result = todoList.filter((todo) => todo.id !== id)
    this.setState({ todoList: result })
  }

  toggleTodo = (id: number) => {
    const { todoList } = this.state
    const result = todoList.map((todo) => {
      return todo.id === id
        ? {
          ...todo,
          complete: !todo.complete
        }
        : todo
    })
    console.warn(result)
    this.setState({ todoList: result })
  }

  render() {
    const { todoList } = this.state
    return (
      <div id="todoList" className="todo-list">
        {/* <Control addTodo={this.addTodo} /> */}
        <ul className="todos">
          {
            todoList.map((todo: any) => {
              return (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  todoList={todoList}
                  removeTodo={this.removeTodo}
                  toggleTodo={this.toggleTodo}
                />
              )
            })
          }
        </ul>
      </div>
    )
  }
}
export default TodoList
