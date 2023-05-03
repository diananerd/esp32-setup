import { ref } from 'vue'
import { ESPLoader, Transport } from 'esptool-js'

const firmwareUrl = import.meta.env.VITE_FIRMWARE_URL
const firmwareVersion = ref('')
const devices = ref([])
const device = ref(null)
const transport = ref(null)
const esploader = ref(null)
const chip = ref(null)
const file1 = ref(null)
const flashing = ref(false)
const connected = ref(false)
const progress = ref(0)
const enableReadSerial = ref(true)
const serial = ref('')

let selectPortHandler = (portId) => {
  console.error(`selectPortHandler is not a function, portId: ${portId}`)
}

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

  const requestDevice = async () => {
    if (!navigator.serial) {
      throw new Error('Web Serial API not available')
    }
    try {
      console.log('fetchDevices')
      device.value = await navigator.serial.requestPort({})
      transport.value = new Transport(device.value)
    } catch (error) {
      console.error('Error fetching devices:', error)
      throw error
    }
  }

  const setSelectPortHandler = (handler) => selectPortHandler = handler

  const selectPort = async (portId) => {
    selectPortHandler(portId)
  }

  const connect = async () => {
    return new Promise(async (resolve, reject) => {
      if (device.value === null) {
        console.log('device is null')
        reject()
      }

      try {
        connected.value = false
        esploader.value = new ESPLoader(transport.value, 115200, espLoaderTerminal)
        chip.value = await esploader.value.main_fn()
        connected.value = true
      } catch (e) {
        console.error(e)
        reject(e)
      }

      console.log('Settings done for :' + chip.value)
      resolve()
    })
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

  const reset = async () => {
    console.log('reset')
    await esploader.value.hard_reset()
  }

  const cleanSerial = () => {
    serial.value = ''
  }

  const readSerial = async () => {
    console.log('readSerial')
    let buff = new Uint8Array()
    while (enableReadSerial.value) {
      let buf = await transport.value.rawRead();
      if (typeof buf !== 'undefined') {
        let tmp = new Uint8Array(buff.byteLength + buf.byteLength);
        tmp.set(new Uint8Array(buff), 0);
        tmp.set(new Uint8Array(buf), buff.byteLength);
        buff = tmp
        serial.value = Buffer.from(buff).toString()
      } else {
        break;
      }
    }
  }

  const writeSerial = async (msg) => {
    console.log('writeSerial', msg)
    const message = new Uint8Array(Buffer.from(msg))
    await transport.value.write(message)
  }

  const loadFile = async () => {
    firmwareVersion.value = await fetch(`${firmwareUrl}/version.txt`).then((res) => res.text())
    console.log('firmwareVersion: ', firmwareVersion.value)
    const firmwarePath = `${firmwareUrl}/${firmwareVersion.value}/ground-station.bin`
    console.log('loadFile', firmwarePath)
    const file = await fetch(firmwarePath).then((res) => res.blob())
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
    serial,
    firmwareVersion,
    setDevices,
    addDevice,
    removeDevice,
    setSelectPortHandler,
    selectPort,
    cleanSerial,
    loadFile,
    requestDevice,
    connect,
    flash,
    reset,
    readSerial,
    writeSerial
  }
}
