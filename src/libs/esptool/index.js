import { ref } from 'vue'
import { ESPLoader, Transport } from 'esptool-js'

const devices = ref([])
const device = ref(null)
const transport = ref(null)
const chip = ref(null)
const esploader = ref(null)
const file1 = ref(null)
const flashing = ref(false)
const connected = ref(false)
const progress = ref(0)

const espLoaderTerminal = {
  clean() {
    console.log('clean terminal')
  },
  writeLine(data) {
    console.log('writeLine', data, '\n')
  },
  write(data) {
    console.log('write', data)
  }
}

const updateProgress = (fileIndex, written, total) => {
  console.log(`Progress ${written}/${total}`)
  progress.value = Math.round((100 * written) / total)
}

export function useEsptool() {
  const setDevices = async (ports) => {
    console.log('setDevices', ports)
    devices.value = ports
    if (Array.isArray(ports) && ports.length) {
      device.value = ports[0]
    }
  }

  const addDevice = async (device) => {
    console.log('addDevice', device)
    if (device) {
      devices.value.push(device)
    }
  }

  const removeDevice = async (device) => {
    console.log('removeDevice', device)
    if (device) {
      devices.value = devices.value.filter((d) => d.portId !== device.portId)
    }
  }

  const fetchDevices = async () => {
    if (!navigator.serial) {
      throw new Error('Web Serial API not available')
    }

    console.log('fetchDevices')
    try {
      await navigator.serial.requestPort({})
      console.log('devices: ', devices.value)
    } catch (error) {
      console.error('Error fetching devices:', error)
      throw error
    }
  }

  const connect = async () => {
    if (device.value === null) {
      device.value = await navigator.serial.requestPort({})
      transport.value = new Transport(device.value)
    }

    try {
      esploader.value = new ESPLoader(transport.value, 115200, espLoaderTerminal)
      chip.value = await esploader.value.main_fn()
      connected.value = true
    } catch (e) {
      console.error(e)
    }

    console.log('Settings done for :' + chip.value)
  }

  const flash = async () => {
    flashing.value = true
    await esploader.value.write_flash(
      [
        {
          address: 0x10000,
          data: file1.value
        }
      ],
      'keep',
      undefined,
      undefined,
      false,
      true,
      updateProgress
    )
    flashing.value = false
    progress.value = 0
  }

  const disconnect = async () => {
    if (transport.value) await transport.value.disconnect()
    connected.value = false
  }

  const loadFile = async (firmwareUrl) => {
    const file = await fetch(firmwareUrl).then((res) => res.blob())

    if (!file) return

    var reader = new FileReader()

    reader.onload = (e) => {
      console.log('onload file', e)
      file1.value = e.target.result
    }

    reader.readAsBinaryString(file)
  }

  return {
    chip,
    devices,
    device,
    connected,
    flashing,
    progress,
    loadFile,
    setDevices,
    addDevice,
    removeDevice,
    fetchDevices,
    connect,
    flash,
    disconnect
  }
}
