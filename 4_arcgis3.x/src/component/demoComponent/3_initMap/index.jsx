import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import CodeBtn from '../../template/codeBtn'
import CodeSource from '../../template/codeSource'
import { initMap } from '../../../store/map'
import demoCodes from './code/codes.md'

export default function InitMap () {
  const [codes, setCodes] = useState('')
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initMap('mapContent', [112, 32], 4, 'gaode', ['st']))
    readCodes()
  }, [])

  const readCodes = () => {
    axios.get(demoCodes).then(res => {
      console.warn(res)
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
  }
  const style = {
    width: '100%',
    height: '100%'
  }
  return (
    <div className="page-content">
      <CodeSource codes={codes} />
      <div id="mapContent" className="map-content" style={style}></div>
      <CodeBtn />
    </div>
  )
}
