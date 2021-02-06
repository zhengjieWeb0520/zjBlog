import React, { useEffect, useState, useRef } from 'react'

/* hooks组件生命周期 */
export default function App () {
  const [count, setCount] = useState(0)
  let timer = useRef()

  useEffect(() => {
    /* componentDidMount */
    timer.current = setInterval(() => {
      console.warn(count)
      setCount(prevCount => prevCount + 1)
    }, 1000)
    return () => {
      /* componentWillUnmount */
      document.title = 'hooks componentWillUnmount'
      clearInterval(timer.current)
    }
  }, [])

  useEffect(() => {
    document.title = 'hooks componentDidUpdate' + count
  }, [count])

  const handleCancle = () => {
    clearInterval(timer.current)
    setCount(0)
  }

  return (
    <div>
      <h2>hooks组件生命周期</h2>
      <div>
        {count}
        <button onClick={handleCancle}>取消定时器</button>
      </div>
    </div>
  )
}
