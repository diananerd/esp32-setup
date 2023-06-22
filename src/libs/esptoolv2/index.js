import { ref } from 'vue'
import { ESPLoader, Transport } from 'esptool-js'

const firmwareUrl = import.meta.env.VITE_FIRMWARE_URL
let firmwareVersion = ref('')
let devices = ref([])
let device = ref(null)
let transport = null
let esploader = null
let chip = ref(null)
let file = null
let flashing = ref(false)
let connected = ref(false)
let progress = ref(0)
let serial = ref('')
let serialTask = null
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let selectPortHandler = (portId) => {
  console.error(`selectPortHandler is not a function, portId: ${portId}`)
}

const espLoaderTerminal = {
  clean() {
    console.log('clean terminal')
    serial.value = ''
  },
  writeLine(data) {
    serial.value += `${data}\n`
  },
  write(data) {
    serial.value += data
  }
}

const updateProgress = (fileIndex, written, total) => {
  console.log(`Progress ${written}/${total}`)
  progress.value = Math.round((100 * written) / total)
}

export function useEsptool() {
  const loadFile = async () => {
    firmwareVersion.value = await fetch(`${firmwareUrl}/version.txt`, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    }).then((res) => res.text())
    console.log('firmwareVersion: ', firmwareVersion.value)
    const firmwarePath = `${firmwareUrl}/${firmwareVersion.value}/ground-station.bin`
    console.log('loadFile', firmwarePath)
    const fileBlob = await fetch(firmwarePath).then((res) => res.blob())
    if (!fileBlob) return

    var reader = new FileReader()
    reader.onload = (e) => {
      console.log('onload file', e)
      file = e.target.result
    }
    reader.readAsBinaryString(fileBlob)
  }

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
    console.log('requestDevice')
    if (!navigator.serial) {
      throw new Error('Web Serial API not available')
    }
    try {
      console.log('fetchDevices')
      device.value = await navigator.serial.requestPort({})
      console.log('device info', device.value.getInfo())
    } catch (error) {
      console.error('Error fetching devices:', error)
      throw error
    }
  }

  const setSelectPortHandler = (handler) => selectPortHandler = handler

  const selectPort = async (portId) => {
    console.log('selectPort', portId)
    selectPortHandler(portId)
  }

  const connect = async () => {
    console.log('connect', device.value, transport)
    if (device.value && !transport) {
      console.log('open device')
      connected.value = false
      transport = new Transport(device.value)
      console.log('transport created', transport)
      console.log('connect to transport...')
      transport.connect(115200)
      console.log('transport connected')
      connected.value = true
      setTimeout(() => {
        startSerialTask()
        reset()
      }, 1500)
    } else {
      console.log('device not found, cancel connection')
    }
  }

  const connectLoader = async () => {
    return new Promise(async (resolve, reject) => {
      if (!transport) {
        console.log('transport not found, reject connection')
        reject()
      }

      try {
        if (!esploader) {
          connected.value = false
          console.log('esploader not found, create new')
          esploader = new ESPLoader(transport, 115200, espLoaderTerminal)
          chip.value = await esploader.main_fn()
          connected.value = true
        }
      } catch (e) {
        console.log('cancel connection')
        console.error(e)
        reject(e)
      }

      console.log('Settings done for :' + chip.value)
      resolve()
    })
  }

  const flash = async () => {
    console.log('flash device')
    flashing.value = true
    await disconnect()
    await connect()
    await connectLoader()
    if (esploader) {
      await esploader.write_flash(
        [
          {
            address: 0x10000,
            data: file
          }
        ],
        'keep',
        undefined,
        undefined,
        false,
        true,
        updateProgress
      )
      await esploader.flash_finish()
      reset()
      flashing.value = false
      progress.value = 0
    } else {
      console.log('esploader not found')
    }
  }

  const reset = async () => {
    console.log('reset', transport)
    if (transport) {
      console.log('transport hard reset')
      await transport.setRTS(true); // EN->LOW
      await sleep(100);
      await transport.setRTS(false);
    } else {
      console.log('esploader not found')
    }
  }

  const cleanSerial = () => {
    serial.value = ''
  }

  const startSerial = async () => {
    // console.log('readSerial', transport)
    let buff = new Uint8Array()
    try {
      while (transport) {
        let buf = await transport.rawRead(500);
        if (typeof buf !== 'undefined' && buf.byteLength) {
          let tmp = new Uint8Array(buff.byteLength + buf.byteLength);
          tmp.set(new Uint8Array(buff), 0);
          tmp.set(new Uint8Array(buf), buff.byteLength);
          buff = tmp
          serial.value += Buffer.from(buff).toString()
        } else {
          // console.log('end of read')
          break;
        }
      }
    } catch (e) {
      // console.log('end readSerial')
    }
  }

  const startSerialTask = () => {
    // console.log('program readSerial')
    serialTask = setInterval(() => {
      if (flashing.value) {
        // console.log('skip startSerial')
        return
      }
      // console.log('recall startSerial')
      startSerial()
    }, 1500)
  }

  const stopSerialTask = () => clearInterval(serialTask)

  const disconnect = async () => {
    console.log('disconnect', transport);
    if (transport) {
      console.log('transport exist')
      await transport.disconnect();
      connected.value = false
      chip.value = null
      console.log('transport disconnected')
    } else {
      console.log('transport not found');
    }
  }

  const writeSerial = async (msg) => {
    console.log('writeSerial', msg)
    const message = new Uint8Array(Buffer.from(msg))
    await transport.write(message)
    // startSerial()
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
    connectLoader,
    flash,
    reset,
    startSerialTask,
    stopSerialTask,
    disconnect,
    writeSerial
  }
}