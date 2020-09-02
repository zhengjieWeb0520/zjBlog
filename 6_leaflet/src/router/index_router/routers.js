import React, { Suspense } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Spin } from 'antd'
import routerConfig from './route_config'
import utils from './../../utils/utilitis'

const routers = utils.arrObjSteamroller(routerConfig, 'children')
const routerConfigClone = utils.deepCloneObject(routerConfig)
for (const item of routers) {
  if (item) {
    routerConfigClone.push(item)
  }
}

export default () => (
  <Switch>
    {
      routerConfigClone.map(item => {
        return (
          <Route
            path={item.path}
            exact={item.path === '/main'}
            key={item.path}
          >
            <Suspense fallback={<Spin size="large" />}>
              {item.component}
            </Suspense>
          </Route>
        )
      })
    }
  </Switch>
)
