<template>
    Upload Firmware
    <p v-if="flashing">Flashing device: {{ progress }}%</p>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useEsptool } from '@/libs/esptool'
const router = useRouter()
const {
  flashing,
  progress,
  flash,
} = useEsptool()

watch(
  () => progress.value,
  (p) => p === 100 ? router.push('/firmware-uploaded') : false
)

onMounted(() => {
    flash()
})
</script>