<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEsptool } from '@/libs/esptool'
const router = useRouter()
const {
  chip,
  devices,
  device,
  connected,
  flashing,
  progress,
  loadFile,
  requestDevice,
  selectPort,
  connect,
  flash
} = useEsptool()

const firmwareUrl = ref(import.meta.env.VITE_FIRMWARE_URL)
watch(
  () => device.value,
  (d, o) => d?.portId !== o?.portId ? selectPort(d?.portId) : false
)

watch(
  () => progress.value,
  (p) => p === 100 ? router.push('/about') : false
)

onMounted(async () => {
  await loadFile(firmwareUrl.value)
  await requestDevice()
  await connect()
  await flash()
})
</script>

<template>
  <main>
    ESP32 Firmware Uploader v2
    <p>Firmware: {{ firmwareUrl }}</p>
    <pre v-if="chip">chip: {{ chip }}</pre>
    <select v-if="!device" v-model="device">
      <option v-for="device in devices" :key="device.portId" :value="device">
        {{ device.displayName }} ({{ device.portName }})
      </option>
    </select>
    <div v-if="connected">Device connected</div>
    <div v-else>Unable to find device</div>
    <p v-if="flashing">Flashing device: {{ progress }}%</p>
  </main>
</template>
