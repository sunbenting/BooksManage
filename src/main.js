import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel);
import XLSX from 'xlsx'
Vue.use(XLSX);
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import axios from 'axios'
Vue.prototype.$axios=axios;
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

Vue.prototype.validSe = function (value, number = 25) {
  value = value.replace(/[`～*~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, '').replace(/\s/g, "");
  if (value.length >= number) {
  this.$message({
  type: "warning",
  message: `输入内容不能超过${number}个字符`
  });
  }
  return value;
  };



/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
