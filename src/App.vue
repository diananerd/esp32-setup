<script setup>
import { ref, watch } from 'vue'
import { RouterView } from 'vue-router'
const showDebug = ref(false)
const serialEl = ref(null)
const text = ref('')
const command = ref('')
const autoscroll = ref(true)

const clearText = () => text.value = ''

const scrollToBottom = (t) => {
  t.scrollTop = t.scrollHeight
};

watch(() => text.value, () => {
  if (serialEl.value && autoscroll.value) {
    scrollToBottom(serialEl.value)
  }
}, {
  immediate: true
})

const flashDevice = () => {
  console.log('flashDevice')
}

const resetTerminal = () => {
  console.log('resetTerminal')
  clearText()
}

const sendCommand = (e) => {
  console.log('sendCommand', command.value)
  command.value = ''
}
</script>

<template>
  <div class="container">
    <RouterView />
  </div>
  <div class="debug">
    <button class="toggler" @click="showDebug = !showDebug"></button>
    <textarea readonly v-if="showDebug" ref="serialEl">{{ text }}</textarea>
    <form @submit.prevent="sendCommand" v-if="showDebug" class="controls">
      <div class="group">
        <label>Command&nbsp;&nbsp;<input type="text" v-model="command" placeholder="Input command and use Enter..." /></label>
      </div>
      <div class="group">
        <button class="action" @click="flashDevice">flash</button>
        <button class="action" @click="resetTerminal">reset</button>
        <button class="action" @click="clearText">clear</button>
        <label><input type="checkbox" v-model="autoscroll" /> autoscroll</label>
      </div>
    </form>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100vh;
}
.debug {
  position: absolute;
  display: block;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: white;
}
.toggler {
  display: block;
  width: 100%;
  height: 8px;
  margin: 0;
  background-color: #202020;
  border-radius: 0;
  border: none;
}
button.action {
  width: auto;
  padding: 2px 8px;
  border: 1px solid #202020;
  border-radius: 4px;
}
button.action:hover {
  color: #202020;
  background-color: white;
}
textarea {
  position: relative;
  display: block;
  width: 100%;
  min-height: 240px;
  margin: 0;
  padding: 4px;
  resize: none;
  overflow-y: scroll;
  color: white;
  background-color: #202020;
}
.controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.group {
  display: flex;
}
label {
  display: flex;
  align-items: center;
  justify-content: start;
  margin: 0;
  padding: 4px 8px;
  width: auto;
}
input {
  display: block;
  margin: 0;
  padding: 2px 4px;
  width: 100%;
  border: 1px solid #202020;
  border-radius: 2px;
}
</style>