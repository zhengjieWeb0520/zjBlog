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
    // var image = new Image()
    // image.src = canvas.toDataURL('image/png')
    // setimageUrl(image.src)
    const origin = require('./origin.png')
    const canvas2 = document.createElement('canvas')
    canvas2.width = 80
    canvas2.height = 80
    var ctx2 = canvas2.getContext('2d')
    canvas2.crossOrigin = 'Anonymous'
    var imageObj = new Image()
    imageObj.src = 'data:image/ico;base64,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'
    ctx2.drawImage(imageObj, 0, 0, 80, 80)

    ctx2.font = '20px Calibri'
    ctx2.fillStyle = 'white'
    ctx2.fillText('My TEXT!', 0, 20)
    var useImage = new Image()

    useImage.src = canvas2.toDataURL('image/png')
    setimageUrl(useImage.src)
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
      <img src={imageUrl} alt="" />
    </header>
  )
}
