<template>
    <h2>¡Todo listo!</h2>
    <p>Ya se agregó esta estación a tu cuenta</p>
    <div class="flex">
        <img class="icon" src="@/assets/success.svg" alt="success" />
    </div>
    <button class="btn" @click="exit">Terminar</button>
</template>

<script setup>
import { exit } from '@/libs/electron'
</script>
