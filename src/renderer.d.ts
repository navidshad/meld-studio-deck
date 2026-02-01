/// <reference types="vite/client" />
/// <reference types="vite-plugin-electron/electron-env" />

interface Window {
	electronAPI: {
		quitApp: () => void;
		setTrayTitle: (title: string) => void;
		showMainWindow: () => void;
		hideTray: () => void;
		registerHotkeys: (hotkeys: Record<string, string>) => void;
		onHotkeyTriggered: (callback: (actionId: string) => void) => void;
	};
}
