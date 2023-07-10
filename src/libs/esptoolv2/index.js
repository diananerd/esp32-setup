import { ref, reactive, computed, watch } from 'vue'
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
let networks = ref([])
let network = ref('')
let isWiFiConnected = ref(false)
let verificationUri = ref('')
let syncSuccess = ref(false)
let syncError = reactive({ error: '', message: '' })
let findNetworksTask = null

const serialList = computed(() => {
  return serial.value.split('\n')
})

const toJSON = (obj) => {
  try {
    return JSON.parse(obj)
  } catch (e) {
    return {}
  }
}

watch(() => serialList.value, (list, old) => {
  if (list.length && list !== old) {
    let _nets = new Set()
    const isNetwork = /^\d+\)\s.*\r$/gm
    const isDeviceCode = /^device_code:\s.*\r$/gm
    list.map(el => {
      if (el.match(isNetwork)) {
        // list networks
        const [_, n] = el.split(') ')
        const net = n.replace('\r', '')
        if (net) _nets.add(net)
        networks.value = Array.from(_nets)
      } else if (el === 'WiFi Connected\r') {
        isWiFiConnected.value = true
        networks.value = []
      } else if (el.match(isDeviceCode) && el.includes('verification_uri')) {
        // show code
        syncSuccess.value = false
        const [_, str] = el.split(': ')
        str.replace('\r', '')
        const obj = toJSON(str)
        console.log(obj)
        if ('verification_uri' in obj) {
          verificationUri.value = obj['verification_uri']
          console.log('verification_uri', verificationUri.value)
        } else {
          console.log('verification_uri not found')
        }
      } else if (el.match(isDeviceCode) && el.includes('access_token')) {
        // sync success
        const [_, str] = el.split(': ')
        str.replace('\r', '')
        const obj = toJSON(str)
        console.log(obj)
        if ('access_token' in obj) {
          syncSuccess.value = true
          verificationUri.value = ''
          console.log('access_token', syncSuccess.value)
        } else {
          console.log('access_token not found')
        }
      } else if (el.match(isDeviceCode) && el.includes('error')) {
        // sync error
        const [_, str] = el.split(': ')
        str.replace('\r', '')
        const obj = toJSON(str)
        console.log(obj)
        if ('error' in obj) {
          if (obj.error === 'denied') {
            console.log('Denied error!')
            syncError.error = obj.error
            syncError.message = obj.message
            verificationUri.value = ''
          } else if (obj.error === 'expired') {
            console.log('Expired error!')
            syncError.error = obj.error
            syncError.message = obj.message
            verificationUri.value = ''
          } else if (obj.error === 'validation_error') {
            console.log('Validation error!')
            syncError.error = obj.error
            syncError.message = obj.message
            verificationUri.value = ''
          }
        } else {
          console.log('error not found')
        }
      }
    })
  }
}, {
  immediate: true
})

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
    const firmwarePath = `${firmwareUrl}/${firmwareVersion.value}/firmware.bin`
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
    clearInterval(findNetworksTask)
    flashing.value = true
    await disconnect()
    await sleep(2500)
    await connect()
    await connectLoader()
    if (esploader) {
      await esploader.write_flash(
        [
          {
            address: 0x0,
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
          serial.value = Buffer.from(buff).toString()
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
    }, 500)
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
    const message = new Uint8Array(Buffer.from(msg  + '\n'))
    await transport.write(message)
    // startSerial()
  }

  const findNetworks = () => {
    findNetworksTask = setInterval(() => {
      writeSerial('networks')
      isWiFiConnected.value = false
    }, 2500)
  }

  const join = (ssid, pass = '') => {
    clearInterval(findNetworksTask)
    writeSerial(`join "${ssid}" "${pass}"`)
  }

  const stopJoin = () => {
    clearInterval(findNetworksTask)
  }

  const sync = () => {
    writeSerial(`sync`)
  }

  const clear = () => {
    writeSerial('clear')
    setTimeout(() => reset(), 1500)
  }

  return {
    chip,
    devices,
    device,
    connected,
    flashing,
    progress,
    serial,
    serialList,
    firmwareVersion,
    networks,
    network,
    isWiFiConnected,
    verificationUri,
    syncSuccess,
    syncError,
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
    writeSerial,
    findNetworks,
    join,
    stopJoin,
    sync,
    clear
  }
}