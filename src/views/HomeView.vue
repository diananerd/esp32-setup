<script setup>
import { onMounted } from 'vue'
import { loadFile, connect, disconnect } from '@/libs/esptool'

onMounted(() => loadFile())
</script>

<template>
  <main>
    Wellcome Home!
    <button @click="connect">Connect Device</button>
    <button @click="disconnect">Disconnect Device</button>
  </main>
</template>
