<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div>
    <h2>Firmware Updater</h2>
    <p>Haz click en comenzar para iniciar el proceso de instalación del firmware.</p>
    <RouterLink class="btn" to="/select-device">Comenzar</RouterLink>
  </div>
</template>