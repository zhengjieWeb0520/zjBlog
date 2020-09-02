import React from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import { Links } from '../../../router/index_router'
import routerConfig from '../../../router/index_router/route_config'
import './index.scss'
import logoPng from './../../../images/demo/logo.png'
const SubMenu = Menu.SubMenu

function MenuBar () {
  return (
    <Menu
      mode="horizontal"
    >
      {
        routerConfig.map(firstItem => {
          if (firstItem.children) {
            return (
              <SubMenu
                key={firstItem.name}
                title={
                  <span className="submenu-title-wrapper">
                    <i
                      className={`icon iconfont ${firstItem.icon}`}
                    />
                    <span>{firstItem.name}</span>
                  </span>
                }
              >
                {
                  firstItem.children.map(secondItem => {
                    return (
                      <Menu.Item
                        key={secondItem.name}
                        title={secondItem.name}
                      >
                        <Link to={secondItem.path}>
                          <i className={`icon iconfont ${secondItem.icon}`} />
                          <span>
                            {secondItem.name}
                          </span>
                        </Link>
                      </Menu.Item>
                    )
                  })
                }
              </SubMenu>
            )
          } else {
            return (
              <Menu.Item
                key={firstItem.name}
                title={firstItem.name}
              >
                <Link to={firstItem.path}>
                  <i className={`icon iconfont ${firstItem.icon}`} />
                  <span>
                    {firstItem.name}
                  </span>
                </Link>
              </Menu.Item>
            )
          }
        })
      }
    </Menu>
  )
}

function Header () {
  return (
    <header className="header" id="header">
      <section className="header-name" id="logo">
        <img src={logoPng} />
        <span>Z-Map 地图前端可视化信息平台</span>
      </section>
      <section className="header-menu">
        <MenuBar />
        {/* <Links /> */}
      </section>
    </header>
  )
}

export default Header
