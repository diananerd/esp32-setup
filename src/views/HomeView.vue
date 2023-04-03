<script setup>
import { ref, onMounted } from 'vue'
import {
  connected,
  flashing,
  progress,
  loadFile,
  listDevices,
  connect,
  flash,
  disconnect
} from '@/libs/esptool'

const firmwareUrl = ref(import.meta.env.VITE_FIRMWARE_URL)
let devices = ref([])
let device = ref({})

const loadDevices = async () => {
  devices.value = await listDevices()
  console.log(devices.value)
  devices.value = devices.value.map((d) => d.getInfo())
}

onMounted(async () => {
  loadFile(firmwareUrl.value)
  await loadDevices()
})
</script>

<template>
  <main>
    ESP32 Firmware Uploader v2
    <p>Firmware: {{ firmwareUrl }}</p>
    <pre>{{ device }}</pre>
    <select v-model="device">
      <option v-for="(device, d) in devices" :key="d" :value="device">{{ device }}</option>
    </select>
    <p>Connected: {{ connected }}</p>
    <button v-if="!connected" @click="connect">List Devices</button>
    <button v-if="!connected" @click="connect">Connect Device</button>
    <button v-else-if="!flashing" @click="disconnect">Disconnect Device</button>
    <button v-if="connected && !flashing" @click="flash">Flash Device</button>
    <p v-if="flashing">Flashing device: {{ progress }}%</p>
  </main>
</template>
