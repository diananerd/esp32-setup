<script setup>
import { watch, onMounted } from 'vue'
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
  selectPort,
  bootstrap
} = useEsptool()
watch(
  () => device.value,
  (d, o) => d?.portId !== o?.portId ? selectPort(d?.portId) : false
)

watch(
  () => progress.value,
  (p) => p === 100 ? router.push('/uploaded') : false
)

onMounted(async () => {
  bootstrap()
})
</script>

<template>
  <main>
    <select v-if="!device" v-model="device">
      <option v-for="device in devices" :key="device.portId" :value="device">
        {{ device.displayName }} ({{ device.portName }})
      </option>
    </select>
    <div v-else>
      <p v-if="connected">Device {{ chip }}</p>
      <p v-if="flashing">Flashing device: {{ progress }}%</p>
    </div>
  </main>
</template>
