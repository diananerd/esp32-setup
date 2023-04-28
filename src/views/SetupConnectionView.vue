<template>
    Setup Connection
    <div v-if="!connected">
        Device not connected
    </div>
    <form @submit.prevent="connect" v-else-if="!connecting">
        <select v-if="networks.length" v-model="network">
            <option v-for="n in networks" :key="n" :value="n">
                {{ n }}
            </option>
        </select>
        <div v-else>
            Loading networks...
        </div>
        <input v-if="network" :type="showPass ? 'text' : 'password'" v-model="password" />
        <input v-if="network" v-model="showPass" type="checkbox" />
        <button v-if="network">Connect</button>
    </form>
    <div v-else>
        Connecting...
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
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

const prevSerial = ref('')
const lastSerial = ref('')
const showPass = ref(null)
const connecting = ref(false)

const network = ref('')
const password = ref('')

const networks = computed(() => {
    const reg = /\d+\)\s.*[^\[0m]$/gm
    const str = lastSerial.value
    const list = [...str.matchAll(reg)].flat().map((e) => e.replace('\r', '')).filter((e) => !e.includes('\[0m')).map((e) => e.split(' ')[1])
    return list
})

const connection = computed(() => {
    const status = lastSerial.value.includes('WiFi Connected')
    return status
})

const fetchNetworks = () => {
    lastSerial.value = serial.value.replace(prevSerial.value, '')
    prevSerial.value = serial.value
    writeSerial('networks\n')
    if (!network.value) {
        setTimeout(fetchNetworks, 2500)
    }
}

const waitConnection = () => {
    lastSerial.value = serial.value.replace(prevSerial.value, '')
    prevSerial.value = serial.value
    if (!connection.value) {
        setTimeout(waitConnection, 2500)
    } else {
        connecting.value = false
        router.push('/connection-success')
    }
}

const connect = () => {
    connecting.value = true
    writeSerial(`join ${network.value} ${password.value}\n`)
    waitConnection()
}

onMounted(() => {
    readSerial()
    reset()
    fetchNetworks()
})
</script>
