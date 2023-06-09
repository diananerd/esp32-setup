<template>
    <div class="flex" v-if="!device">
        <div class="flex" v-if="!devicesFiltered.length">
            <img class="icon rotate" src="@/assets/sync.svg" alt="sync" />
            <p class="badge">Buscando estación terrestre</p>
        </div>
        <div v-else>
            <h2>Seleccionar puerto</h2>
            <p>Selecciona el puerto USB de tu estación terrestre.</p>
        </div>
        <button
            v-for="device in devicesFiltered"
            :key="device.portId"
            @click="selectPort(device.portId)"
        >
            {{ device.displayName }} ({{ device.portName }})
            <span v-if="device.vendorId === '6790'">✨</span>
        </button>
    </div>
    <div class="flex" v-else>
        <img class="loader" src="@/assets/loading.svg" alt="loading" />
        <p class="status">Conectando estación</p>
    </div>
</template>

<script setup>
import { onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEsptool } from '@/libs/esptool'
const router = useRouter()
const {
  chip,
  devices,
  device,
  selectPort,
  requestDevice,
  connect
} = useEsptool()

const devicesFiltered = computed(() => {
    return devices.value?.filter((device) => device?.vendorId === '6790')
})

watch(
    () => chip.value,
    (c) => c !== '' ? router.push('/select-action') : false
)

onMounted(async () => {
    await requestDevice()
    await connect()
})
</script>
