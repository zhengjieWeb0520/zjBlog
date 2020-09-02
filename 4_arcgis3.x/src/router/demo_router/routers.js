/*
 * @Author: 郑杰14
 * @Date: 2020-06-11 09:03:48
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-08-26 18:37:57
 * @Description:
 */
import React, { Suspense, Fragment } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Spin } from 'antd'
import Slider from '../../component/template/slider'
import routerConfig from './router_config'

import { uObject, uArray } from '../../utils/utils'

function getRoute (data) {
  return data.map(item => {
    if (item.children) {
      const childrens = item.children.map(ele => {
        const children = uObject.deepCloneObject(ele)
        children.path = `${item.path}/${ele.path}`
        return children
      })
      return getRoute(childrens)
    }
    return item
  })
}

const data = uArray.flattenArr(getRoute(routerConfig))

export default props => {
  const { url } = props
  console.warn(url)
  return (
    <Fragment>
      <Suspense fallback={<Spin size="large" />}>
        <Slider menuConfig={routerConfig} />
        <Switch>
          {data.map(item => {
            return (
              <Route path={`${url}/${item.path}`} key={item.path}>
                {item.component}
              </Route>
            )
          })}
          {/* <Redirect to={`${url}/${data[0].path}`} /> */}
        </Switch>
      </Suspense>
    </Fragment>
  )
}
