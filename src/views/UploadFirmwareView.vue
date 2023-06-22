<template>
    <h2>Actualizando firmware</h2>
    <p>Por favor, no desconectes la estación.</p>
    <div v-if="flashing" class="flex">
      <img class="icon" src="@/assets/alert.svg" alt="alert" />
      <div class="progress">
        <div class="progress-bar" :style="`width: ${progress}%`"></div>
      </div>
      <p class="small">Programando estación: {{ progress }}%</p>
    </div>
</template>

<style scoped>
.progress {
  display: block;
  width: 220px;
  height: 14px;
  margin: 1rem 0;
  border: 2px solid black;
  border-radius: 8px;
}
.progress-bar {
  width: 0px;
  height: 100%;
  background-color: black;
  border: none;
  border-radius: 8px;
}
</style>

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
  flashing,
  progress,
  flash,
} = useEsptool()

watch(
  () => progress.value,
  (p) => p === 100 ? router.push('/firmware-uploaded') : false
)

onMounted(async () => {
  try {
    await flash()
  } catch (e) {
    toError('Error de conexión', 'La estación se desconectó inesperadamente')
  }
})
</script>