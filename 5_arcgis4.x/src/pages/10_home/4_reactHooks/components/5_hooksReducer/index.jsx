import React, { useReducer, useState } from 'react'

export default function App () {
  const [count, setCount] = useState(0)
  const handleClick = (e) => {
    e === 'increase' ? setCount(prevCount => prevCount + 1) : setCount(prevCount => prevCount - 1)
  }
  return (
    <div>
      <h3>hooks事件</h3>
      <section>
        {count}
        <button onClick={() => handleClick('increase')}>+</button>
        <button onClick={() => handleClick('decrease')}>-</button>
      </section>
      <ReducerApp />
    </div>
  )
}

const initialState = {
  count: 0
}

function reducer (state, action) {
  switch (action.type) {
    case 'increase':
      return {
        ...state,
        count: state.count + action.payload
      }
    case 'decrease':
      return {
        ...state,
        count: state.count - action.payload
      }
    default:
      return initialState
  }

}
function ReducerApp (params) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <div>
      <h3>hooks useReducer</h3>
      <section>
        {state.count}
        <button onClick={() => dispatch({ type: 'increase', payload: 1 })}>+</button>
        <button onClick={() => dispatch({ type: 'decrease', payload: 1 })}>-</button>
      </section>
    </div>
  )
}
