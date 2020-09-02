import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import './index.scss'
import { Button } from 'antd'
import { toggleCodeBoxWidth, changeCodeBoxVisible } from '../../../store/main'

/* 源码按钮 */
export default function CodeBtn () {
  const [text, setText] = useState('源码')
  const dispatch = useDispatch()

  const handleClick = () => {
    if (text === '源码') {
      setText('隐藏')
      // dispatch(toggleCodeBoxWidth('6rem'))
      dispatch(changeCodeBoxVisible(true))
    } else if (text === '隐藏') {
      setText('源码')
      // dispatch(toggleCodeBoxWidth('0rem'))
      dispatch(changeCodeBoxVisible(false))
    }
  }
  return (
    <Button onClick={handleClick} className="code-btn">{text}</Button>
  )
}
