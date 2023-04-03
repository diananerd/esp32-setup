import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import './libs/electron'

const app = createApp(App)

app.use(router)

app
.mount('#app')
.$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
