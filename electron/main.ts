import { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, globalShortcut } from 'electron';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js
// │ ├─┬ preload
// │ │ └── index.js
// │ └── index.html
// ├── dist
// └── index.html

process.env.DIST_ELECTRON = path.join(__dirname, '../dist-electron');
process.env.DIST = path.join(__dirname, '../dist');
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(__dirname, '../public');

const PUBLIC_PATH = process.env.PUBLIC || '';

let mainWindow: BrowserWindow | null = null;
let trayWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;

// constant for preload path
// constant for preload path
const preload = path.join(__dirname, 'preload.mjs');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = path.join(process.env.DIST, 'index.html');

function createMainWindow() {
	mainWindow = new BrowserWindow({
		title: 'Meld Deck',
		icon: path.join(PUBLIC_PATH, 'favicon.ico'),
		width: 1280,
		height: 800,
		webPreferences: {
			preload,
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	if (url) {
		mainWindow.loadURL(url);
		// Open devNode for debugging
		// mainWindow.webContents.openDevTools();
	} else {
		mainWindow.loadFile(indexHtml);
	}

	// Hide on close instead of destroying
	mainWindow.on('close', (event) => {
		if (!isQuitting) {
			event.preventDefault();
			mainWindow?.hide();
			if (app.dock) app.dock.hide(); // Optional: Logic to hide from dock if only in tray? 
			// Actually per PRD: "Accessible via Dock icon", so keep dock icon.
		}
		return false;
	});

	mainWindow.on('show', () => {
		if (app.dock) app.dock.show();
	});
}

function createTrayWindow() {
	trayWindow = new BrowserWindow({
		width: 300,
		height: 400,
		show: false,
		frame: false,
		fullscreenable: false,
		resizable: false,
		transparent: true,
		skipTaskbar: true, // Don't show in dock/taskbar
		webPreferences: {
			preload,
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	// Allow tray window to show on all desktops/fullscreen apps
	trayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

	if (url) {
		trayWindow.loadURL(`${url}#/tray`);
	} else {
		trayWindow.loadFile(indexHtml, { hash: '#/tray' });
	}

	// Hide instead of close
	trayWindow.on('blur', () => {
		if (!trayWindow?.webContents.isDevToolsOpened()) {
			trayWindow?.hide();
		}
	});
}

function createTray() {
	const icon = nativeImage.createFromPath(path.join(PUBLIC_PATH, 'tray-icon.png')); // Placeholder
	tray = new Tray(icon);
	tray.setTitle('Meld Deck'); // Default Title
	tray.setToolTip('Meld Deck');

	// Handle Tray Click - Simply toggle the custom window
	tray.on('click', (event, bounds) => {
		const { x, y } = bounds;
		const { height, width } = trayWindow!.getBounds();
		const yPos = process.platform === 'darwin' ? y : y - height;

		if (trayWindow?.isVisible()) {
			trayWindow.hide();
		} else {
			trayWindow!.setBounds({
				x: x - width / 2 + (process.platform === 'darwin' ? (bounds.width / 2) : 0),
				y: yPos,
				height,
				width
			});
			trayWindow!.show();
		}
	});

	// Cleanup native context menu to avoid overlap
	// tray.setContextMenu(contextMenu);
}

// IPC Handlers
ipcMain.on('app:quit', () => {
	isQuitting = true;
	app.quit();
});

ipcMain.on('tray:set-title', (_event, title: string) => {
	tray?.setTitle(title);
});

ipcMain.on('app:show-main', () => {
	mainWindow?.show();
	if (app.dock) app.dock.show();
});

ipcMain.on('tray:hide', () => {
	trayWindow?.hide();
});

ipcMain.on('hotkey:register', (_event, hotkeys: Record<string, string>) => {
	globalShortcut.unregisterAll();

	for (const [actionId, shortcut] of Object.entries(hotkeys)) {
		try {
			if (!shortcut) continue;

			// Basic sanitization/check? Electron handles most.
			const ret = globalShortcut.register(shortcut, () => {
				// Send to mainWindow
				mainWindow?.webContents.send('hotkey:triggered', actionId);
			});

			if (!ret) {
				console.warn('Registration failed for shortcut:', shortcut);
			}
		} catch (e) {
			console.error(`Failed to register shortcut ${shortcut} for ${actionId}`, e);
		}
	}
});

app.whenReady().then(() => {
	createMainWindow();
	createTrayWindow();
	createTray();
});

app.on('window-all-closed', () => {
	// Do not quit when all windows are closed!
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	const allWindows = BrowserWindow.getAllWindows();
	if (allWindows.length) {
		allWindows[0].show();
	} else {
		createMainWindow();
	}
});

// App properties
// @ts-ignore
// app.isQuiting = false;
