<script setup>
import { ref, onMounted } from 'vue'
import { loadFile, connect, disconnect } from '@/libs/esptool'

const firmwareUrl = ref(import.meta.env.VITE_FIRMWARE_URL)
onMounted(() => loadFile(firmwareUrl.value))
</script>

<template>
  <main>
    Wellcome Home!
    <p>Firmware: {{ firmwareUrl }}</p>
    <button @click="connect">Connect Device</button>
    <button @click="disconnect">Disconnect Device</button>
  </main>
</template>
