import { ipcRenderer } from 'electron'
import { useEsptool } from '../esptoolv2'
const esptool = useEsptool()

export const getInfo = () => {
  return ipcRenderer.sendSync('get-app-info')
}

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
