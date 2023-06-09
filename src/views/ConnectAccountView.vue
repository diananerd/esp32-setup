<template>
    <h2>Agregar estación</h2>
    <p>Accede a tu cuenta de Platzi en el navegador, luego haz click en agregar.</p>
    <div class="flex">
        <img class="icon rotate" src="@/assets/sync.svg" alt="sync" />
        <p class="status" style="margin-bottom: 24px;" v-if="error">
            {{ message }}
        </p>
        <!-- <a v-if="verification_uri" class="btn" target="_blank" :href="verification_uri">Agregar</a> -->
        <a v-if="code" class="btn" target="_blank" :href="`https://space.platzi.com/stations/add/${code}`">Agregar</a>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useEsptool } from '@/libs/esptool'

const router = useRouter()

const toError = (title, description) => router.push({
  name: 'error',
  query: {
    title,
    description
  }
})

const {
  serial,
  reset,
  readSerial,
  writeSerial
} = useEsptool()

const prevSerial = ref('')
const lastSerial = ref('')
const syncAttempts = ref(0)
const syncAttemptsLimit = 50
const elapsedTime = ref(0)

const error = ref('get_code')
const message = ref('Generando enlace')
const code = ref('')
const verification_uri = ref('')
const access_token = ref('')

const codes = computed(() => {
    const reg = /device_code\:\s.*[^\[0m]$/gm
    const str = lastSerial.value
    const list = [...str.matchAll(reg)].flat().map((el) => el.replace('device_code: ', '').replace('\r', ''));
    return list
})

watch(() => codes.value, (list) => {
    const c = list[list.length-1];
    if (c) {
        console.log('device_code:', c);
        if (c.includes('"code"')) {
            const obj = JSON.parse(c);
            console.log('Update code: ', obj);
            code.value = obj.code;
            verification_uri.value = obj.verification_uri;
        } else if (c.includes('"error"')) {
            const err = JSON.parse(c);
            console.log('Update error: ', err);
            error.value = err.error;
            message.value = err.message;
        } else if (c.includes('"access_token"')) {
            const tokens = JSON.parse(c);
            console.log('Update token: ', tokens);
            access_token.value = tokens.access_token;
        }
    }
}, { immediate: true })

const fetchCode = () => {
    if (!codes.value.length) {
        syncAttempts.value++
        if (syncAttempts.value >= syncAttemptsLimit) {
            console.log('codes attempts error')
            return toError('Error de autorización', 'No se obtuvo el codigo')
        }
    }
    lastSerial.value = serial.value.replace(prevSerial.value, '')
    prevSerial.value = serial.value
    console.log('last serial', lastSerial.value)
    if (!access_token.value || error.value !== 'denied' || ) {
        setTimeout(fetchCode, 2500)
    } else if (error.value === 'denied') {
        toError('Operación cancelada', 'No se autorizó esta acción')
    } else if (error.value === 'expired') {
        toError('Operación cancelada', 'El código expiró')
    } else {
        router.push('/success-sync')
    }
}

onMounted(async () => {
    syncAttempts.value = 0
    elapsedTime.value = 0
    readSerial()
    reset()
    fetchCode()
    setTimeout(() => {
        writeSerial('sync\n')
    }, 5000)
})
</script>