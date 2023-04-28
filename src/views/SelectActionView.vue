<template>
    Select Action
    <div>
        <RouterLink to="/upload-firmware">Upload firmware</RouterLink>
        <RouterLink to="/setup-connection">Setup connection</RouterLink>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>