/*
 * @Author: 郑杰14
 * @Date: 2021-04-14 14:06:13
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-04-15 17:53:34
 * @Description: 地图主页
 */
import React, { useContext } from 'react'
import { appContext } from '../../context/AppContext'

export default function index() {
  const context = useContext(appContext)
  return (
    <div>
      地图
      <p>
        作者:
        {context.username}
      </p>
    </div>
  )
}
