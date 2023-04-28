<script setup>
import { RouterLink } from 'vue-router'
import { useEsptool } from '@/libs/esptool'
const { serial, reset } = useEsptool()
</script>

<template>
  <div>
    <p>Firmware uploaded!</p>
    <a href="https://platzi.com/esp32" target="_blank">Go to panel</a>
    <pre>
      {{ serial }}
    </pre>
    <button @click="reset">Reset</button>
    <RouterLink to="/upload">Upload</RouterLink>
    <RouterLink to="/setup">Setup</RouterLink>
  </div>
</template>