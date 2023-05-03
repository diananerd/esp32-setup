<template>
    <h2>Configurar conexión</h2>
    <p>Selecciona una red e ingresa la contraseña para conectar tu estación terrestre a internet.</p>
    <div class="flex" v-if="!connected">
        <img class="icon" src="@/assets/fail.svg" alt="fail" />
        <p class="status">Dispositivo no conectado</p>
    </div>
    <form class="flex" @submit.prevent="connect" v-else-if="!connecting">
        <select v-if="networks.length" v-model="network">
            <option v-for="n in networks" :key="n" :value="n">
                {{ n }}
            </option>
        </select>
        <div class="flex" v-else>
            <img class="loader" src="@/assets/loading.svg" alt="loading" />
            <p class="status">Buscando redes</p>
        </div>
        <div class="flex" v-if="network">
            <input :type="showPass ? 'text' : 'password'" v-model="password" />
            <label>
                <input v-model="showPass" type="checkbox" />
                <span>Mostrar contraseña</span>
            </label>
            <button>Conectar</button>
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
