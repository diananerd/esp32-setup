import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'start',
      component: () => import('../views/StartView.vue')
    },
    {
      path: '/select-board',
      name: 'select-board',
      component: () => import('../views/SelectBoardView.vue')
    },
    {
      path: '/select-device',
      name: 'select-device',
      component: () => import('../views/SelectDeviceView.vue')
    },
    {
      path: '/select-action',
      name: 'select-action',
      component: () => import('../views/SelectActionView.vue')
    },
    {
      path: '/upload-firmware',
      name: 'upload-firmware',
      component: () => import('../views/UploadFirmwareView.vue')
    },
    {
      path: '/firmware-uploaded',
      name: 'firmware-uploaded',
      component: () => import('../views/FirmwareUploadedView.vue')
    },
    {
      path: '/setup-connection',
      name: 'setup-connection',
      component: () => import('../views/SetupConnectionView.vue')
    },
    {
      path: '/connection-success',
      name: 'connection-success',
      component: () => import('../views/ConnectionSuccessView.vue')
    },
    {
      path: '/connect-account',
      name: 'connect-account',
      component: () => import('../views/ConnectAccountView.vue')
    },
    {
      path: '/success-sync',
      name: 'success-sync',
      component: () => import('../views/SuccessSyncView.vue')
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('../views/ErrorView.vue')
    },
  ]
})

export default router
