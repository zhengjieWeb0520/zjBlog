/*
 * @Author: 郑杰14
 * @Date: 2021-04-13 10:48:33
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-04-17 20:32:30
 * @Description:
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { routes } from './router/router_config'
import RenderRoutes from './router/RenderRoutes'
import { ContextProvider } from './context/AppContext'
import store from './store/store'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <ContextProvider>
          <RenderRoutes routes={routes} type="hash" />
        </ContextProvider>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
