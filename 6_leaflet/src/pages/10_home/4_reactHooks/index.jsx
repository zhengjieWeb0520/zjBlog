import React from 'react'
import { Tabs } from 'antd'
import LifeCycleClass from './components/1_lifeCycleClass'
import LifeCycleHooks from './components/2_lifeCycleHooks'
import OriginContext from './components/3_context'
import HooksContext from './components/4_hooksContext'
import HooksReducer from './components/5_hooksReducer'
import HooksRef from './components/6_HooksRef'
import HooksLayoutEffect from './components/7_layoutEffect'
import HooksCallback from './components/8_hooksCallback'
const { TabPane } = Tabs
/* react hooks学习 */
export default function App () {
  const childrenItems = [
    {
      key: 1,
      name: '类组件生命周期',
      value: <LifeCycleClass />
    },
    {
      key: 2,
      name: 'hooks生命周期',
      value: <LifeCycleHooks />
    },
    {
      key: 3,
      name: 'context',
      value: <OriginContext />
    },
    {
      key: 4,
      name: 'hooksContext',
      value: <HooksContext />
    },
    {
      key: 5,
      name: 'hooksReducer',
      value: <HooksReducer />
    },
    {
      key: 6,
      name: 'hooksRef',
      value: <HooksRef />
    },
    {
      key: 7,
      name: 'layoutEffect',
      value: <HooksLayoutEffect />
    },
    {
      key: 8,
      name: 'hooksCallback',
      value: <HooksCallback />
    }
  ]
  return (
    <div className="container">
      <Tabs defaultActiveKey="3">
        {
          childrenItems.map(item => {
            return (
              <TabPane tab={item.name} key={item.key}>
                {item.value}
              </TabPane>
            )
          })
        }
      </Tabs>
    </div>
  )
}
