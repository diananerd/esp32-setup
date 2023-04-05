<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEsptool } from '@/libs/esptool'
const router = useRouter()
const {
  chip,
  devices,
  device,
  serial,
  connected,
  flashing,
  progress,
  selectPort,
  bootstrap,
  flash,
  reset,
  readSerial,
  writeSerial
} = useEsptool()

const input = ref('')

const send = () => {
  writeSerial(`${input.value}\n`)
}

watch(
  () => device.value,
  (d, o) => d?.portId !== o?.portId ? selectPort(d?.portId) : false
)

watch(
  () => progress.value,
  (p) => p === 100 ? router.push('/uploaded') : false
)

onMounted(async () => {
  bootstrap()
})
</script>

<template>
  <main>
    <select v-if="!device" v-model="device">
      <option v-for="device in devices" :key="device.portId" :value="device">
        {{ device.displayName }} ({{ device.portName }})
      </option>
    </select>
    <div v-else>
      <p v-if="connected">Device {{ chip }}</p>
      <button @click="flash">Flash</button>
      <button @click="readSerial">Read</button>
      <button @click="reset">Reset</button>
      <p v-if="flashing">Flashing device: {{ progress }}%</p>
      <pre>
        {{ serial }}
      </pre>
      <form @submit.prevent="send">
        <input type="text" v-model="input" placeholder="Command" />
        <button>Send</button>
      </form>
    </div>
  </main>
</template>
