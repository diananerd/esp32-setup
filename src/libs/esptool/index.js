import { ESPLoader, Transport } from 'esptool-js'

let device = null
let transport
let chip = null
let esploader
let file1 = null
let connected = false

const progress = (fileIndex, written, total) => {
  console.log(`File: ${fileIndex} - ${written}/${total}`)
}

const connect = async () => {
  if (device === null) {
    device = await navigator.serial.requestPort({})
    transport = new Transport(device)
  }

  try {
    esploader = new ESPLoader(transport, 115200)
    connected = true

    chip = await esploader.main_fn()
  } catch (e) {
    console.error(e)
  }

  console.log('Settings done for :' + chip)

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
    progress
  );

  if (transport) await transport.disconnect()
}

const disconnect = async () => {
  if (transport) await transport.disconnect()
}

const loadFile = async (firmwareUrl) => {
  const file = await fetch(firmwareUrl, {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }).then(res => res.blob())

  if (!file) return;

  var reader = new FileReader();

  reader.onload = (e) => {
    console.log('onload file', e)
    file1 = e.target.result;
  };

  reader.readAsBinaryString(file);
}

export { loadFile, connect, disconnect }
