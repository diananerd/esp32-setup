<template>
    <div class="flex" v-if="!connected">
        <img class="icon" src="@/assets/fail.svg" alt="fail" />
        <p class="status">Estación no conectada</p>
    </div>
    <form class="flex" @submit.prevent="connect" v-else-if="!connecting">
        <div v-if="networksFiltered.length">
            <h2>Configurar conexión</h2>
            <p>Selecciona una red e ingresa la contraseña para conectar tu estación terrestre a internet.</p>
            <select v-model="network">
                <option v-for="n in networksFiltered" :key="n" :value="n">
                    {{ n }}
                </option>
            </select>
            <div class="flex">
                <input :type="showPass ? 'text' : 'password'" v-model="password" />
                <label>
                    <input v-model="showPass" type="checkbox" />
                    <span>Mostrar contraseña</span>
                </label>
                <button>Conectar</button>
            </div>
        </div>
        <div class="flex" v-else>
            <img class="loader" src="@/assets/loading.svg" alt="loading" />
            <p class="status">Buscando redes</p>
        </div>
    </form>
    <div class="flex" v-else>
        <img class="loader" src="@/assets/loading.svg" alt="loading" />
        <p class="status">Conectando a la red&nbsp;<span class="underline">{{ network }}</span></p>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEsptool } from '@/libs/esptoolv2'

const router = useRouter()

const toError = (title, description) => router.push({
  name: 'error',
  query: {
    title,
    description
  }
})

const {
  serial,
  connected,
  reset,
  readSerial,
  writeSerial,
  stopSerial
} = useEsptool()

const prevSerial = ref('')
const lastSerial = ref('')
const showPass = ref(null)
const connecting = ref(false)
const connectionAttempts = ref(0)
const connectionAttemptsLimit = 5
const elapsedTime = ref(0)
const waitConnectionTime = 2500
const waitConnectionLimit = 15000

const network = ref('')
const password = ref('')

const networks = computed(() => {
    const reg = /\d+\)\s.*[^\[0m]$/gm
    const str = lastSerial.value
    const list = [...str.matchAll(reg)].flat().map((e) => e.replace('\r', '')).filter((e) => !e.includes('\[0m')).map((e) => e.split(' ')[1])
    return list
})

const networksFiltered = computed(() => {
    return networks.value?.filter((net) => !net.includes('wifi:'))
})

const connection = computed(() => {
    const status = lastSerial.value.includes('WiFi Connected')
    return status
})

const fetchNetworks = () => {
    if (!networks.value.length) {
        connectionAttempts.value++
        console.log('connection attempts', connectionAttempts.value)
        if (connectionAttempts.value >= connectionAttemptsLimit) {
            console.log('connection attempts error')
            return toError('Error de conexión', 'No se encontraron redes disponibles')
        }
    }
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
        elapsedTime.value += waitConnectionTime
        console.log('elapsed time', elapsedTime.value)
        if (elapsedTime.value >= waitConnectionLimit) {
            console.log('elapsed time limit error')
            return toError('Error de conexión', 'No se pudo conectar a la red')
        }
        setTimeout(waitConnection, waitConnectionTime)
    } else {
        connecting.value = false
        stopSerial()
        router.push('/connection-success')
    }
}

const connect = () => {
    connecting.value = true
    writeSerial(`join ${network.value} ${password.value}\n`)
    waitConnection()
}

onMounted(() => {
    connectionAttempts.value = 0
    elapsedTime.value = 0
    readSerial()
    reset()
    fetchNetworks()
})
</script>
