"use strict";
const electron = require("electron");
const path = require("path");
require("os");
const fsExtra = require("fs-extra");
const crypto = require("node:crypto");
const is = {
  dev: !electron.app.isPackaged
};
({
  isWindows: process.platform === "win32",
  isMacOS: process.platform === "darwin",
  isLinux: process.platform === "linux"
});
const optimizer = {
  watchWindowShortcuts(window, shortcutOptions) {
    if (!window)
      return;
    const { webContents } = window;
    const { escToCloseWindow = false, zoom = false } = shortcutOptions || {};
    webContents.on("before-input-event", (event, input) => {
      if (input.type === "keyDown") {
        if (!is.dev) {
          if (input.code === "KeyR" && (input.control || input.meta))
            event.preventDefault();
        } else {
          if (input.code === "F12") {
            if (webContents.isDevToolsOpened()) {
              webContents.closeDevTools();
            } else {
              webContents.openDevTools({ mode: "undocked" });
              console.log("Open dev tool...");
            }
          }
        }
        if (escToCloseWindow) {
          if (input.code === "Escape" && input.key !== "Process") {
            window.close();
            event.preventDefault();
          }
        }
        if (!zoom) {
          if (input.code === "Minus" && (input.control || input.meta))
            event.preventDefault();
          if (input.code === "Equal" && input.shift && (input.control || input.meta))
            event.preventDefault();
        }
      }
    });
  },
  registerFramelessWindowIpc() {
    electron.ipcMain.on("win:invoke", (event, action) => {
      const win2 = electron.BrowserWindow.fromWebContents(event.sender);
      if (win2) {
        if (action === "show") {
          win2.show();
        } else if (action === "showInactive") {
          win2.showInactive();
        } else if (action === "min") {
          win2.minimize();
        } else if (action === "max") {
          const isMaximized = win2.isMaximized();
          if (isMaximized) {
            win2.unmaximize();
          } else {
            win2.maximize();
          }
        } else if (action === "close") {
          win2.close();
        }
      }
    });
  }
};
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
const rnds8Pool = new Uint8Array(256);
let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}
const native = {
  randomUUID: crypto.randomUUID
};
function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  return unsafeStringify(rnds);
}
const getRootDir = () => {
  return `${__dirname}/notes-app-tailwind`;
};
const getNoteInfoFromFile = async (filename) => {
  console.log("getRootDir: ", getRootDir);
  const fileStats = await fsExtra.stat(`${getRootDir()}/${filename}`);
  return {
    id: v4(),
    title: filename.replace(/\.md$/, ""),
    lastEditTime: fileStats.mtimeMs
  };
};
const getNotes = async () => {
  const rootDir = getRootDir();
  await fsExtra.ensureDir(rootDir);
  try {
    const notesFileNames = await fsExtra.readdir(rootDir, {
      encoding: "utf8",
      withFileTypes: false
    });
    const notes = notesFileNames.filter((fileName) => fileName.endsWith(".md"));
    const noteDetails = await Promise.all(notes.map(getNoteInfoFromFile));
    return noteDetails;
  } catch (error) {
    console.error("Error in getNotes:", error);
    throw error;
  }
};
const readNote = async (filename) => {
  const rootDir = getRootDir();
  return fsExtra.readFile(`${rootDir}/${filename}.md`, { encoding: "utf8" });
};
const writeNote = async (filename, content) => {
  const rootDir = getRootDir();
  console.info(`Writing note ${filename} to ${rootDir}`);
  return fsExtra.writeFile(`${rootDir}/${filename}.md`, content, { encoding: "utf8" });
};
const createNote = async () => {
  const rootDir = getRootDir();
  await fsExtra.ensureDir(rootDir);
  const { filePath, canceled } = await electron.dialog.showSaveDialog({
    title: "New Note",
    defaultPath: `${rootDir}/${v4()}.md`,
    buttonLabel: "Create",
    properties: ["showOverwriteConfirmation"],
    showsTagField: false,
    filters: [{ name: "Markdown", extensions: ["md"] }]
  });
  if (canceled || !filePath) {
    console.info(`Note create canceled`);
    return false;
  }
  const { name: filename, dir: parentDir } = path.parse(filePath);
  if (parentDir !== rootDir) {
    await electron.dialog.showMessageBox({
      type: "error",
      title: "Creation failed",
      message: `All notes must be saved under ${rootDir}`
    });
    return false;
  }
  console.info(`Creating note ${filePath}`);
  await fsExtra.writeFile(filePath, "");
  return filename;
};
const deleteNote = async (filename) => {
  const rootDir = getRootDir();
  const { response } = await electron.dialog.showMessageBox({
    type: "warning",
    title: "Delete Note",
    message: `Delete  ${filename} ?`,
    buttons: ["Удалить", "Отмена"],
    defaultId: 1,
    cancelId: 1
  });
  if (response === 1) {
    console.info("Note Deletion canceled");
    return false;
  }
  console.info(`Deleting note ${filename}`);
  await fsExtra.remove(`${rootDir}/${filename}.md`);
  return true;
};
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
const preload = path.join(__dirname, "preload.js");
const distPath = path.join(__dirname, "../.output/public");
let win = null;
async function createWindow() {
  win = new electron.BrowserWindow({
    width: 1200,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    center: true,
    title: "Note App",
    frame: false,
    vibrancy: "under-window",
    visualEffectState: "active",
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 15, y: 10 },
    backgroundMaterial: "acrylic",
    webPreferences: {
      preload,
      sandbox: true,
      contextIsolation: true
    }
  });
  win.on("ready-to-show", () => {
    win == null ? void 0 : win.show();
  });
  win.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (electron.app.isPackaged) {
    win.loadFile(path.join(distPath, "index.html"));
  } else {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  }
}
electron.app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") electron.app.quit();
});
electron.app.whenReady().then(() => {
  electron.app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });
  electron.ipcMain.handle("getNotes", (_, ...args) => getNotes(...args));
  electron.ipcMain.handle("readNote", (_, ...args) => readNote(...args));
  electron.ipcMain.handle("writeNote", (_, ...args) => writeNote(...args));
  electron.ipcMain.handle("createNote", (_, ...args) => createNote(...args));
  electron.ipcMain.handle("deleteNote", (_, ...args) => deleteNote(...args));
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
