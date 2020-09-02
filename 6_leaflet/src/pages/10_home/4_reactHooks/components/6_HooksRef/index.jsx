import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react'

/* hooks useRef */
function ChildInputComponent (props, ref) {
  const inputRef = useRef()
  useImperativeHandle(ref, () => inputRef.current)
  return <input type="text" placeholder="请输入文字" name="child input" ref={inputRef} />
}

const ChildInput = forwardRef(ChildInputComponent)

export default function App () {
  const inputRef = useRef()
  useEffect(() => {
    inputRef.current.value = 'react hooks useRef'
    inputRef.current.focus()
  }, [])
  return (
    <div>
      <h3>useImperativeHandle 透传 Ref</h3>
      <div>
        <ChildInput ref={inputRef} />
      </div>
    </div>
  )
}
