import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './index.scss'
import logo from '../../../images/demo/logo.png'

/* 头部 */
export default function App () {
  const [imageUrl, setimageUrl] = useState('')
  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 20
    canvas.height = 20
    if (canvas.getContext) {
      // 获取对应的CanvasRenderingContext2D对象(画笔)
      var ctx = canvas.getContext('2d')

      // 开始一个新的绘制路径
      ctx.beginPath()
      // 设置弧线的颜色为蓝色
      ctx.strokeStyle = 'blue'
      var circle = {
        x: 10,
        y: 10,
        r: 10
      }
      // 以canvas中的坐标点(100,100)为圆心，绘制一个半径为50px的圆形
      ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, true)
      // 按照指定的路径绘制弧线
      ctx.stroke()
    }
    var image = new Image()
    image.src = canvas.toDataURL('image/png')
    setimageUrl(image.src)
  }, [])
  const style = {
    width: '8px',
    height: '8px'
  }
  return (
    <header>
      <a>
        <Link to='/'>
          <img src={logo} />
          <span>郑杰的个人主页---arcgis api for js 4.x</span>
        </Link>
      </a>
      <img style={style} src={imageUrl} alt="" />
    </header>
  )
}
