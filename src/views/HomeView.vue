<script setup>
import { ref, watch, onMounted } from 'vue'
import { useEsptool } from '@/libs/esptool'
const {
  chip,
  devices,
  device,
  connected,
  flashing,
  progress,
  loadFile,
  fetchDevices,
  connect,
  flash,
  disconnect
} = useEsptool()

const firmwareUrl = ref(import.meta.env.VITE_FIRMWARE_URL)

watch(
  () => devices.value,
  (val) => console.log('watch devices:', val)
)

onMounted(() => {
  loadFile(firmwareUrl.value)
  fetchDevices()
})
</script>

<template>
  <main>
    ESP32 Firmware Uploader v2
    <p>Firmware: {{ firmwareUrl }}</p>
    <pre>chip: {{ chip }}</pre>
    <pre>devices: {{ devices }}</pre>
    <pre>device: {{ device }}</pre>
    <select v-model="device">
      <option v-for="device in devices" :key="device.portId" :value="device">
        {{ device.displayName }} ({{ device.portName }})
      </option>
    </select>
    <p>Connected: {{ connected }}</p>
    <button @click="fetchDevices">List Devices</button>
    <button @click="connect">Connect Device</button>
    <button @click="disconnect">Disconnect Device</button>
    <button @click="flash">Flash Device</button>
    <p v-if="flashing">Flashing device: {{ progress }}%</p>
  </main>
</template>
