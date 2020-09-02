import React, { useState, useEffect, useLayoutEffect } from 'react'

/* hooks useLayeroutEffect */
export default function App () {
  const [width, setWidth] = useState(0)
  useLayoutEffect(() => {
    const title = document.querySelector('.title')
    const titleWidth = title.getBoundingClientRect().width
    console.warn('----useLayoutEffect----')
    if (width !== titleWidth) {
      setWidth(titleWidth)
    }
  })
  useEffect(() => {
    console.warn('----useEffect---')
  })
  return (
    <div>
      <h3>useLayoutEffect同步执行副作用</h3>
      <section>大部分情况下，使用 useEffect 就可以帮我们处理组件的副作用，但是如果想要同步调用一些副作用，比如对 DOM 的操作，就需要使用 useLayoutEffect，useLayoutEffect 中的副作用会在 DOM 更新之后同步执行。</section>
      <h4 class='title'>react hooks useLayoutEffect</h4>
      <p>{width}</p>
    </div>
  )
}
