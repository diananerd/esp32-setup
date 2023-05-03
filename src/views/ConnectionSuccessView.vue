<template>
    <h2>Dispositivo conectado</h2>
    <p>Ahora puedes vincular el dispositivo a tu cuenta.</p>
    <div class="flex">
        <img class="icon" src="@/assets/wifi.svg" alt="wifi" />
        <RouterLink class="btn" to="/connect-account">Continuar</RouterLink>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>