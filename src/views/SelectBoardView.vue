<template>
    <form class="flex" @submit.prevent="select">
        <div v-if="boardConfigs.list.length">
            <h2>Seleccionar tarjeta </h2>
            <p>Selecciona el modelo de tu tarjeta de desarrollo.</p>
            <select v-model="boardConfigs.board">
                <option v-for="n in boardConfigs.list" :key="n" :value="n.name">
                    {{ n.name }}
                </option>
            </select>
            <div class="flex">
                <!-- <input type="checkbox" v-model="customConfig" /> -->
                <label v-if="customConfig">
                    <span>Configuración manual</span>
                </label>
                <button>Continuar</button>
            </div>
        </div>
        <div class="flex" v-else>
            <img class="loader" src="@/assets/loading.svg" alt="loading" />
            <p class="status">Cargando tarjetas</p>
        </div>
    </form>
</template>

<script setup>
import { onMounted, ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useEsptool } from '@/libs/esptoolv2'

const router = useRouter()

const customConfig = ref(false)

const boardConfigs = reactive({
    list: [],
    board: null
})

const {
  getBoardConfigs,
  setBoardConfig
} = useEsptool()

watch(() => boardConfigs.board, (config) => {
    setBoardConfig(config)
})

const select = () => {
    console.log('selected board', boardConfigs.board)
    router.push('/setup-connection')
}

onMounted(async () => {
    boardConfigs.list = await getBoardConfigs()
})
</script>
