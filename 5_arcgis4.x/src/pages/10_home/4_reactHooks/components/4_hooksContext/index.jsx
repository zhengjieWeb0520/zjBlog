import React, { useContext } from 'react'

const colorContext = React.createContext('red')
const userContext = React.createContext('Jams')
/* hooks useContext */
function Leaf () {
  const color = useContext(colorContext)
  const user = useContext(userContext)
  return (
    <div>
      <p>孙组件接收颜色参数：{color}</p>
      <p>孙组件接收用户参数：{user}</p>
    </div>
  )
}

function Foo () {
  return <Leaf />
}
export default function App () {
  return (
    <div>
      <h2>hooks useContext</h2>
      <colorContext.Provider value={'gray'}>
        <userContext.Provider value={'react'}>
          <Foo />
        </userContext.Provider>
      </colorContext.Provider>
    </div>
  )
}
