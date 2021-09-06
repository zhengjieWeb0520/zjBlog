/*
 * @Author: 郑杰
 * @Date: 2021-04-14 15:38:01
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-04-14 20:53:17
 * @Description: route-config
 */
import React, { Suspense } from 'react'
import { Spin } from 'antd'
import { BrowserRouter, HashRouter, Switch, Route } from 'react-router-dom'

export interface RouteConfig {
  /**
   * 路由名
  */
  path: string;
  /**
   * 是否精确匹配
  */
  exact: boolean;
  /**
   * 名称
  */
  name?: string;
  /**
   * 图标
  */
  icon?: string;
  /**
   * 懒加载组件
  */
  lazyComponent?: React.ReactNode;
  /**
   * 不需要懒加载的模块
  */
  component?: React.ReactNode;
  /**
   * 子组件
   */
  children?: Array<any>
}

/**
 * 遍历路由方法
 * @param routes
 * @returns
 */
const renderRoutesMap = (routes: Array<RouteConfig>): React.ReactNode[] => {
  return routes.map((route: RouteConfig) => {
    const LoaderComponent = route.lazyComponent ? route.lazyComponent : route.component
    return (
      <Route
        key={route.path}
        exact={route.exact}
        path={route.path}
      >
        { route.lazyComponent ?
          <Suspense fallback={<Spin size="large" />}>{LoaderComponent}</Suspense>
          : LoaderComponent }
        { route.children && renderRoutesMap(route.children) }
      </Route>
    )
  })
}

/**
 * 渲染路由组件
 * @param props 路由配置参数
 * @returns
 */
const RenderRoutes: React.FC<{ routes: Array<RouteConfig>, type: String }> = (props) => {
  const { routes, type } = props
  /**
   * type:hash HashRouter
   * type:browser BrowserRouter
   */
  const UseRouter: any = type === 'hash' ? HashRouter : BrowserRouter
  return (
    <UseRouter>
      <Switch>
        {renderRoutesMap(routes)}
      </Switch>
    </UseRouter>
  )
}

export default RenderRoutes
