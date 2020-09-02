import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware } from 'redux'
import { ConfigProvider } from 'antd'
import thunk from 'redux-thunk'
import reducer from '../../store/reducer'
import zhCN from 'antd/es/locale/zh_CN'
import '../../css/reset.scss'
import '../../css/index.scss'
import * as serviceWorker from '../../serviceWorker'
import App from './App'
import Header from '../../component/layout/header'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))

ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </Provider>,
  document.getElementById('root')
)

serviceWorker.unregister()
