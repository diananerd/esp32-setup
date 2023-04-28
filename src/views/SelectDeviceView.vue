<template>
    Select Device
    <div v-if="!device">
        <button v-for="device in devices" :key="device.portId" @click="selectPort(device.portId)">
            {{ device.displayName }} ({{ device.portName }}) <span v-if="device.vendorId === '6790'">✨</span>
        </button>
    </div>
    <div v-else>
        Connecting to device...
    </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useEsptool } from '@/libs/esptool'
const router = useRouter()
const {
  chip,
  devices,
  device,
  selectPort,
  bootstrap,
} = useEsptool()

watch(
    () => chip.value,
    (c) => c !== '' ? router.push('/select-action') : false
)

onMounted(() => {
    bootstrap()
})
</script>

<style scoped></style>