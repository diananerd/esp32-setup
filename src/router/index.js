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
      path: '/upload',
      name: 'upload',
      component: () => import('../views/UploadView.vue')
    },
    {
      path: '/uploaded',
      name: 'uploaded',
      component: () => import('../views/UploadedView.vue')
    },
    {
      path: '/setup',
      name: 'setup',
      component: () => import('../views/SetupView.vue')
    }
  ]
})

export default router
