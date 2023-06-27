<template>
    <h2>Agregar estación</h2>
    <p>Accede a tu cuenta de Platzi en el navegador, luego haz click en agregar.</p>
    <div class="flex">
        <img class="icon rotate" src="@/assets/sync.svg" alt="sync" />
        <p class="status" style="margin-bottom: 24px;" v-if="error">
            {{ message }}
        </p>
        <a v-if="verificationUri" class="btn" target="_blank" :href="verificationUri">Agregar</a>
    </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
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
  verificationUri,
  syncSuccess,
  syncError,
  sync
} = useEsptool()

watch(() => syncSuccess.value, (success) => {
    if (success) {
        router.push('/success-sync')
    }
})

watch(() => syncError.error, (error) => {
    if (error) {
        toError()
    }
})

onMounted(async () => {
    sync()
})
</script>