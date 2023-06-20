<script setup>
import { reactive, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getInfo } from '@/libs/electron'
import { useEsptool } from '@/libs/esptool'

let appInfo = reactive({
  info: {}
})

const {
  firmwareVersion,
  loadFile
} = useEsptool()

onMounted(() => {
  loadFile()
  appInfo.info = getInfo()
})
</script>

<template>
  <div>
    <div class="flex">
      <img class="logo" src="@/assets/platzi.svg" alt="platzi" />
    </div>
    <h2>Platzi Ground Station</h2>
    <p>Haz click en comenzar para iniciar el proceso de instalación del firmware.</p>
    <div class="flex">
      <RouterLink class="btn" to="/select-device">Comenzar</RouterLink>
      <p class="badge">Versión del firmware: v{{ firmwareVersion }}</p>
    </div>
  </div>
</template>