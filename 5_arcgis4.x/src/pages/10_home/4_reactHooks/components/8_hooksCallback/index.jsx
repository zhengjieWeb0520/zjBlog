import React, { useCallback, memo, useEffect } from 'react'
import { gcj02towgs84 } from '../../../../../utils/transformCoor'

/* hooks callback */
const ChildComponent = memo(function ChildComponent (props) {
  const handleClick = () => {
    props.memoizedHandleClick()
  }
  return <button onClick={handleClick}>点击</button>
})

export default function App () {
  const memoizedHandleClick = useCallback(
    () => {
      console.warn('click happened')
    },
    []
  )
  useEffect(() => {
    const result = gcj02towgs84(120.364515, 31.588482)
    console.warn(result)
  }, [])
  return (
    <div>
      <h3>hooks useCallback</h3>
      <section>
        <p>通过 useCallback 获得一个记忆后的函数</p>
        <p>第二个参数传入一个数组，数组中的每一项一旦值或者引用发生改变，useCallback 就会重新返回一个新的记忆函数提供给后面进行渲染</p>
        <p>这样只要子组件继承了 PureComponent 或者使用 React.memo 就可以有效避免不必要的 VDOM 渲染</p>
        <p>useCallback 的功能完全可以由 useMemo 所取代，如果你想通过使用 useMemo 返回一个记忆函数也是完全可以的</p>
        <p>useCallback 不会执行第一个参数函数，而是将它返回给你，而 useMemo 会执行第一个函数并且将函数执行结果返回给你。</p>
        <p>useCallback 常用记忆事件函数，生成记忆后的事件函数并传递给子组件使用。而 useMemo 更适合经过函数计算得到一个确定的值，比如记忆组件。</p>
      </section>
      <ChildComponent memoizedHandleClick={memoizedHandleClick} />
    </div>
  )
}
