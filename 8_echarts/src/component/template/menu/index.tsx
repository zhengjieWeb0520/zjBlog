/*
 * @Author: 郑杰14
 * @Date: 2021-04-22 10:36:08
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-05-11 18:07:31
 * @Description: 导航
 */
import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd'
import axios from 'axios'
import { menuConfig } from './menuConfig'
import DemoContent from '../../demo/index'

const { TabPane } = Tabs

const Slider: React.FC = () => {
  const [charList, setCharList] = useState({})
  return (
    <div className="page-menu">
      <Tabs tabPosition="left">
        {
          menuConfig.map((panel) => {
            return (
              <TabPane
                tab={(
                  <span>
                    <i className={`icon iconfont ${panel.icon}`}></i>
                    <span style={{ marginLeft: '8px' }}>{panel.name}</span>
                  </span>
                )}
                key={panel.id}
              >
                <DemoContent />
              </TabPane>
            )
          })
        }
      </Tabs>
    </div>
  )
}
export default Slider
