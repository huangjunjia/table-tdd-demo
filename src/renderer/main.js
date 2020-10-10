import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'

import 'ant-design-vue/dist/antd.css'
import '@/assets/css/reset.css'
import '@/assets/css/customer.css'

const app = createApp(App)
  .use(store)
  .use(router)
  .use(Antd)

app.mount('#app')
