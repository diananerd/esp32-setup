import { ipcRenderer } from 'electron'
import { useEsptool } from '../esptool'
const esptool = useEsptool()

export const exit = () => {
  ipcRenderer.send('exit')
}

esptool.setSelectPortHandler((portId) => {
  ipcRenderer.send('select-port', portId)
})

ipcRenderer.on('select-serial-port', (_event, ports) => {
  esptool.setDevices(ports)
})

ipcRenderer.on('serial-port-added', (_event, port) => {
  esptool.addDevice(port)
})

ipcRenderer.on('serial-port-removed', (_event, port) => {
  esptool.removeDevice(port)
})
