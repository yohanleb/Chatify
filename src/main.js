import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueRouter from 'vue-router'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import VueCookie from 'vue-cookie'
import moment from 'moment'

import Index from './components/Index.vue'
import Chat from './components/Chat.vue'
import PageNotFound from './components/PageNotFound.vue'

const ENV = 'DEV'

const routes = [
  { path: '/', name: 'index', component: Index },
  { path: '/chat/:chatID', name: 'chat', component: Chat },
  { path: '*', name: 'pagenotfound', component: PageNotFound }
]

Vue.use(VueCookie)
Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

Vue.config.productionTip = false
// cette ligne est importante pour les sessions (en mode développement)
axios.defaults.withCredentials = true
Vue.use(VueAxios, axios)

// Global variables
if (ENV === 'PROD') {
  Vue.prototype.$apiURL = ''
} else {
  Vue.prototype.$apiURL = 'http://127.0.0.1:4000'
}
Vue.prototype.$genericErrorMessage = 'Error, try again !'

Vue.filter('format_date', function (value) {
  if (!value) return ''
  return moment(new Date(value)).format('LLLL')
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
