// /* demo主页 */
import React from 'react'
import { withRouter } from 'react-router-dom'
import { Routers } from '../../router/demo_router'
import './index.scss'

function App (props) {
  const { match } = props
  const { url } = match
  return (
    <div id="demo-index" className="page page-demo">
      <Routers url={url} />
    </div>
  )
}

const AppRouter = withRouter(App)
export default AppRouter
