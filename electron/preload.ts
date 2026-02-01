import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
	quitApp: () => ipcRenderer.send('app:quit'),
	setTrayTitle: (title: string) => ipcRenderer.send('tray:set-title', title),
	showMainWindow: () => ipcRenderer.send('app:show-main'),
	hideTray: () => ipcRenderer.send('tray:hide'),
	registerHotkeys: (hotkeys: Record<string, string>) => ipcRenderer.send('hotkey:register', hotkeys),
	onHotkeyTriggered: (callback: (actionId: string) => void) => ipcRenderer.on('hotkey:triggered', (_event, actionId) => callback(actionId)),
});
