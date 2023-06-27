<template>
    <div class="flex" v-if="!connected">
        <img class="icon" src="@/assets/fail.svg" alt="fail" />
        <p class="status">Estación no conectada</p>
    </div>
    <form class="flex" @submit.prevent="connect" v-else-if="!connecting">
        <div v-if="networks.length">
            <h2>Configurar conexión</h2>
            <p>Selecciona una red e ingresa la contraseña para conectar tu estación terrestre a internet.</p>
            <select v-model="network">
                <option v-for="n in networks" :key="n" :value="n">
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
import { onMounted, ref, watch } from 'vue'
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
  connected,
  networks,
  network,
  isWiFiConnected,
  findNetworks,
  join,
  stopJoin
} = useEsptool()

const showPass = ref(null)
const connecting = ref(false)

const password = ref('')

watch(() => isWiFiConnected.value, (connected) => {
    if (connected) {
        stopJoin()
        router.push('/connection-success')
    }
})

const connect = () => {
    connecting.value = true
    join(network.value, password.value)
    setTimeout(() => {
        if (!isWiFiConnected.value) {
            stopJoin()
            toError()
        }
    }, 15000)
}

onMounted(() => {
    findNetworks()
})
</script>
