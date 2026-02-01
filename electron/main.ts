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

let mainWindow: BrowserWindow | null = null;
let trayWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

// constant for preload path
// constant for preload path
const preload = path.join(__dirname, 'preload.mjs');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = path.join(process.env.DIST, 'index.html');

function createMainWindow() {
	mainWindow = new BrowserWindow({
		title: 'Meld Deck',
		icon: path.join(process.env.PUBLIC, 'favicon.ico'),
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
		if (!app.isQuiting) {
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
	const icon = nativeImage.createFromPath(path.join(process.env.PUBLIC, 'tray-icon.png')); // Placeholder
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
	app.isQuiting = true;
	app.quit();
});

ipcMain.on('tray:set-title', (_event, title: string) => {
	tray?.setTitle(title);
});

ipcMain.on('app:show-main', () => {
	mainWindow?.show();
	if (app.dock) app.dock.show();
});

app.whenReady().then(() => {
	createMainWindow();
	createTrayWindow();
	createTray();

	// Basic Global Shortcut Stub
	// globalShortcut.register('CommandOrControl+Shift+K', () => {
	//   mainWindow?.webContents.send('global-shortcut:trigger', 'test');
	// });
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
app.isQuiting = false;
