<template>
    <h2>Firmware actualizado</h2>
    <p>Se actualizó el firmware correctamente, ahora es necesario configurar la conexión a internet.</p>
    <div class="flex">
        <img class="icon" src="@/assets/success.svg" alt="success" />
        <RouterLink class="btn" to="/select-board">Configurar hardware</RouterLink>
    </div>
    </template>

<script setup>
import { RouterLink } from 'vue-router'
</script>