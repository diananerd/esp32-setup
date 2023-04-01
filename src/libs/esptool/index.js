import { ref } from 'vue'
import { ESPLoader, Transport } from 'esptool-js'

let device = null
let transport
let chip = null
let esploader
let file1 = null
let flashing = ref(false)
let connected = ref(false)
let progress = ref(0)

const updateProgress = (fileIndex, written, total) => {
  console.log(`Progress ${written}/${total}`)
  progress.value = Math.round((100 * written) / total)
}

const connect = async () => {
  if (device === null) {
    device = await navigator.serial.requestPort({})
    transport = new Transport(device)
  }

  try {
    esploader = new ESPLoader(transport, 115200)
    chip = await esploader.main_fn()
    connected.value = true
  } catch (e) {
    console.error(e)
  }

  console.log('Settings done for :' + chip)
}

const flash = async () => {
  flashing.value = true
  await esploader.write_flash(
    [{
      address: 0x10000,
      data: file1
    }],
    'keep',
    undefined,
    undefined,
    false,
    true,
    updateProgress
  );
  flashing.value = false
  progress.value = 0
}

const disconnect = async () => {
  if (transport) await transport.disconnect()
  connected.value = false
}

const loadFile = async (firmwareUrl) => {
  const file = await fetch(firmwareUrl).then(res => res.blob())

  if (!file) return;

  var reader = new FileReader();

  reader.onload = (e) => {
    console.log('onload file', e)
    file1 = e.target.result;
  };

  reader.readAsBinaryString(file);
}

export { connected, flashing, progress, loadFile, connect, flash, disconnect }
