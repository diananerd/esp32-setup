import { ipcRenderer } from 'electron'
import { useEsptool } from '../esptool'
const esptool = useEsptool()

ipcRenderer.on('select-serial-port', (_event, ports) => {
  console.log('on select-serial-port event', ports)
  esptool.setDevices(ports)
})

ipcRenderer.on('serial-port-added', (_event, port) => {
  console.log('on serial-port-added event', port)
  esptool.addDevice(port)
})

ipcRenderer.on('serial-port-removed', (_event, port) => {
  console.log('on serial-port-removed event', port)
  esptool.removeDevice(port)
})
