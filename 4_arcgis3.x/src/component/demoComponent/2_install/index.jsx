import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Document from '../../template/document'
import demoCodes from './codes.md'
import desc from './desc'

/* 安装教程 */
export default function Install () {
  const [code, setCodes] = useState('')
  useEffect(() => {
    axios.get(demoCodes).then(res => {
      const { data } = res
      let codes = data.split('---').filter(Boolean)
      codes = codes.map(code => {
        return code
          .replace(/```jsx/, '')
          .replace(/```/, '')
          .trim()
      })
      setCodes(codes)
    })
  }, [])
  return (
    <div className="page-content">
      <h2>安装教程</h2>
      <Document codes={code} desc={desc} />
    </div>
  )
}
