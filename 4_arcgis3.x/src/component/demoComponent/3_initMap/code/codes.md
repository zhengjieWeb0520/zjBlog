```jsx
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initMap } from '../../../store/map'

export default function InitMap () {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initMap('mapContent', [112, 32], 4, 'gaode', ['st']))
  }, [])

  const style = {
    width: '100%',
    height: '100%'
  }
  return (
    <div className="page-content">
      <div id="mapContent" className="map-content" style={style}></div>
    </div>
  )
```