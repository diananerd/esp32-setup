<template>
    Setup Connection
    <div v-if="!connected">
        Device not connected
    </div>
    <div v-else>
        <pre>{{ serial }}</pre>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useEsptool } from '@/libs/esptool'
const router = useRouter()
const {
  serial,
  connected,
  reset,
  readSerial,
  writeSerial
} = useEsptool()

const next = () => {
    router.push('/connect-account')
}

const t = ref(null)

onMounted(() => {
    readSerial()
    reset()
    t.value = setInterval(() => {
        writeSerial('help\n')
    }, 3000)
})

onBeforeUnmount(() => {
    clearInterval(t.value)
})
</script>
