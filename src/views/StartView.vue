<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useEsptool } from '@/libs/esptool'

const {
  firmwareVersion,
  loadFile
} = useEsptool()

onMounted(() => {
  loadFile()
})
</script>

<template>
  <div>
    <h2>Firmware Updater</h2>
    <p>Haz click en comenzar para iniciar el proceso de instalación del firmware.</p>
    <RouterLink class="btn" to="/select-device">Comenzar</RouterLink>
    <div class="flex">
      <p class="badge">Firmware version v{{ firmwareVersion }}</p>
    </div>
  </div>
</template>