<template>
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <div class="flex">
        <img class="icon" src="@/assets/fail.svg" alt="fail" />
    </div>
    <button class="btn" @click="exit">Terminar</button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { exit } from '@/libs/electron'

const route = useRoute()
const title = ref('')
const description = ref('')

onMounted(() => {
    title.value = route.query?.title || 'Lo sentimos';
    description.value = route.query?.description || 'Ocurrió un error desconocido';
})
</script>
