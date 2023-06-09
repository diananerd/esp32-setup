<template>
    <h2>Estación conectada a internet</h2>
    <p>Ahora puedes agregar esta estación a tu cuenta.</p>
    <div class="flex">
        <img class="icon" src="@/assets/wifi.svg" alt="wifi" />
        <RouterLink class="btn" to="/connect-account">Continuar</RouterLink>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>