<script setup>
import { ref, onMounted } from 'vue'
import { connected, flashing, progress, loadFile, connect, flash, disconnect } from '@/libs/esptool'

const firmwareUrl = ref(import.meta.env.VITE_FIRMWARE_URL)
onMounted(() => loadFile(firmwareUrl.value))
</script>

<template>
  <main>
    ESP32 Firmware Uploader
    <p>Firmware: {{ firmwareUrl }}</p>
    <p>Connected: {{ connected }}</p>
    <button v-if="!connected" @click="connect">Connect Device</button>
    <button v-else-if="!flashing" @click="disconnect">Disconnect Device</button>
    <button v-if="connected && !flashing" @click="flash">Flash Device</button>
    <p v-if="flashing">Flashing device: {{ progress }}%</p>
  </main>
</template>
