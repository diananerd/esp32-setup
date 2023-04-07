<script setup>
import { RouterView } from 'vue-router'
import { exit } from '@/libs/electron'
</script>

<template>
  <button @click="exit">Exit</button>
  <RouterView />
</template>