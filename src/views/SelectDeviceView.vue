<template>
    <h2>Seleccionar dispositivo</h2>
    <p>Selecciona el puerto USB de tu estación terrestre.</p>
    <div class="flex" v-if="!device">
        <button
            v-for="device in devices"
            :key="device.portId"
            @click="selectPort(device.portId)"
        >
            {{ device.displayName }} ({{ device.portName }})
            <span v-if="device.vendorId === '6790'">✨</span>
        </button>
    </div>
    <div class="flex" v-else>
        <img class="loader" src="@/assets/loading.svg" alt="loading" />
        <p class="status">Conectando dispositivo</p>
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