import React from 'react'
const { Provider, Consumer } = React.createContext()

/* 原生context */
function Leaf () {
  return (
    <Consumer>
      {
        color => <div>孙组件接收参数：{color}</div>
      }
    </Consumer>
  )
}

function Foo () {
  return <Leaf />
}

export default function App () {
  return (
    <div>
      <h2>原生context</h2>
      <div>
        <Provider value={'gray'}>
          <Foo />
        </Provider>
      </div>
    </div>
  )
}
