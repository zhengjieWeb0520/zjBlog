import React, { useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import esriLoader from 'esri-loader'
import Header from '../../component/template/header'
import NewMap from '../../utils/arcgis3x/arcgisTool'
import { initMap } from '../../store/map'
import './index.scss'

/* 首页 */
export default (props) => {
  const history = useHistory()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initMap('mapContent', [112, 32], 4, 'gaode', ['st']))
  }, [])
  return (
    <div className="page page-index">
      <Header />
      <section className="page-index-content">
        <ul>
          <li>
            <Link to='/main/summary'>介绍</Link>
          </li>
          <li>
            <Link to='/main/demo'>
              demo
            </Link>
          </li>
          <li>下载</li>
        </ul>
      </section>
      <div id="mapContent" className="map-content"></div>
    </div>
  )
}
