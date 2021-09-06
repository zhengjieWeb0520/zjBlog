/*
 * @Author: 郑杰14
 * @Date: 2020-07-30 16:09:55
 * @LastEditors: 郑杰14
 * @LastEditTime: 2021-08-04 10:27:58
 * @Description:
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import fastClick from 'fastclick'
import store from './store'
import { Button, Select, Input, Option, Message, Upload } from 'element-ui'
import VueClipboard from 'vue-clipboard2'
// import './assets/styles/reset.css'
import './assets/styles/border.css'

Vue.config.productionTip = false
fastClick.attach(document.body)

Vue.use(Vuex)

Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }
Vue.use(Button)
Vue.use(Select)
Vue.use(Input)
Vue.use(Option)
Vue.use(Upload)

VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)

Vue.prototype.$message = Message

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
