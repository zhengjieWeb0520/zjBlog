import React from 'react'
import { Link } from 'react-router-dom'
import routerConfig from './route_config'

export default () => (
  <ul>
    {
      routerConfig.map(item => {
        return (
          <li key={item.path}>
            <Link to={item.path}>{item.name}</Link>
          </li>
        )
      })
    }
  </ul>
)
