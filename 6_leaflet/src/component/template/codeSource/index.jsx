import React from 'react'
import { useSelector } from 'react-redux'
import Highlight from '../highlight'
import Clipboard from '../clipBoard'
import './index.scss'

/* 源码按钮 */
export default function CodeSource (props) {
  const width = useSelector(state => state.main.width)
  const style = {
    width: width,
    marginRight: '0.05rem',
    backgroundColor: '#1D2542',
    color: 'white',
    overflow: 'auto'
  }
  return (
    <div className="code-box" style={style}>
      <Clipboard codes={props.codes[0]} />
      <Highlight className="javascript,js,jsx">{props.codes[0]}</Highlight>
    </div>
  )
}
