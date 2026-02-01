import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
	quitApp: () => ipcRenderer.send('app:quit'),
	setTrayTitle: (title: string) => ipcRenderer.send('tray:set-title', title),
	showMainWindow: () => ipcRenderer.send('app:show-main'),
});
