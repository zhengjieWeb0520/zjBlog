import React, { useRef, memo } from 'react'

let idSqe = new Date()

const Control = memo(function Control (props) {
  const { addTodo } = props
  const inputRef = useRef()

  const onSubmit = (e) => {
    e.preventDefault()

    const newText = inputRef.current.value.trim()

    if (newText.length === 0) {
      return
    }

    addTodo({
      id: ++idSqe,
      text: newText,
      complete: false
    })
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

export default Control
