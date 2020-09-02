import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware } from 'redux'
import { ConfigProvider } from 'antd'
import thunk from 'redux-thunk'
import reducer from './store/reducer'
import { Routers } from './router/main_router'
import zhCN from 'antd/es/locale/zh_CN'
import './css/reset.scss'
import './css/index.scss'
import * as serviceWorker from './serviceWorker'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <ConfigProvider locale={zhCN}>
        <Routers />
      </ConfigProvider>
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)

serviceWorker.unregister()
