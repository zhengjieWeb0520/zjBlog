/*
 * @Author: 郑杰14
 * @Date: 2021-04-20 10:28:59
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-04-20 21:05:32
 * @Description: 学习页面
 */
import React from 'react'
import { Tabs } from 'antd'
import TodoListHooks from './todoListHooks'
import TodoListRedux from './todoListRedux'
import TodoListClass from './todoListClass'

const { TabPane } = Tabs
const Study: React.FC = () => {
  const handleChange = () => {}
  return (
    <div>
      <Tabs defaultActiveKey="1" onChange={handleChange}>
        <TabPane tab="todoListHooks" key="1">
          <TodoListHooks />
        </TabPane>
        <TabPane tab="todoListRedux" key="2">
          <TodoListRedux />
        </TabPane>
        <TabPane tab="todoListClass" key="3">
          <TodoListClass />
        </TabPane>
      </Tabs>
    </div>
  )
}
export default Study
