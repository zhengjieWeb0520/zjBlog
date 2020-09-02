import React, { Suspense } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Spin } from 'antd'
import routerConfig from './route_config'

export default () => (
  <div>
    <Switch>
      {
        routerConfig.map(item => {
          return (
            <Route
              path={item.path}
              exact={item.path === '/'}
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
  </div>
)
