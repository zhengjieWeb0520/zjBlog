/*
 * @Author: 郑杰14
 * @Date: 2021-04-15 22:28:14
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-04-15 22:56:44
 * @Description: store
 */
import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'

const composeEnhancers = compose
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)))

export type RootState = ReturnType<typeof store.getState>

export default store
