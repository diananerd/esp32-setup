<template>
    <h2>Selecciona una acción</h2>
    <p>Actualiza el firmware o ve directamente a la configuración de red.</p>
    <div class="flex">
        <RouterLink class="btn" to="/upload-firmware">Actualizar firmware</RouterLink>
        <RouterLink to="/setup-connection">Configurar conexión</RouterLink>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>