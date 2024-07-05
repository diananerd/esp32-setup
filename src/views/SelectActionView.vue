<template>
    <h2>Selecciona una acción</h2>
    <p>Actualiza el firmware o ve directamente a la configuración de red.</p>
    <div class="flex">
        <RouterLink class="btn" to="/upload-firmware">Actualizar firmware</RouterLink>
        <RouterLink class="link" to="/select-board">Configurar hardware</RouterLink>
        <RouterLink class="link" to="/setup-connection">Configurar conexión</RouterLink>
    </div>
</template>

<style scoped>
.link {
    margin: 4px 0;
}
</style>

<script setup>
import { RouterLink } from 'vue-router'
</script>