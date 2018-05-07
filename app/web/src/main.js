import Vue from 'vue'
import App from './App'
import router from './router'
import 'at-ui-style'
import AtUI from 'at-ui'
import axios from 'axios'


Vue.config.productionTip = false
Vue.use(AtUI)
Vue.prototype.$http = axios
Vue.prototype.$siteName = ''
Vue.prototype.$siteLayout = ''

axios.get("site-api/api/currentsite").then(response => {
  console.log('current site: ', response.data.payload)
  Vue.prototype.$siteName = response.data.payload.current
  return axios.get("site-api/api/sites/" + response.data.payload.current)
}).then(response => {
  Vue.prototype.$siteLayout = response.data.payload.pages
}).then(function () {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    render: h => h(App),
    beforeCreate: function () {
    },
    created: function () {
    },
  })
})





