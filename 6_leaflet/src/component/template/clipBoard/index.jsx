import React, { useState } from 'react'
import Clipboard from 'react-clipboard.js'
import { Tooltip } from 'antd'
import './index.scss'

function CodeMeta (props) {
  const [copyTips, setCopyTips] = useState('复制代码')
  const [copyClass, setCopyClass] = useState('iconcopy')

  // 复制代码成功
  const onSuccess = () => {
    setCopyTips('复制成功')
    setCopyClass('iconai210')
  }

  // 鼠标离开复制按钮
  const leaveCopyBtn = () => {
    setCopyTips('复制代码')
    setCopyClass('iconcopy')
  }

  const { codes } = props
  return (
    <section className="code-box-meta">
      <Clipboard data-clipboard-text={codes} onSuccess={onSuccess}>
        <Tooltip title={copyTips}>
          <i className={`icon iconfont ${copyClass}`} onMouseLeave={leaveCopyBtn} />
        </Tooltip>
      </Clipboard>
    </section>
  )
}

export default CodeMeta
