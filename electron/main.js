const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

// Путь к Python и бэкенду
const BACKEND_DIR = path.join(__dirname, '..', 'backend');
const PYTHON_CMD = process.platform === 'win32' ? 'python' : 'python3';

function startBackend() {
  console.log('🚀 Starting FastAPI backend...');

  backendProcess = spawn(PYTHON_CMD, [
    '-m', 'uvicorn',
    'main:app',
    '--host', '127.0.0.1',
    '--port', '8000'
  ], {
    cwd: BACKEND_DIR,
    shell: true
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true // Можно отключить для production
    },
    backgroundColor: '#121212',
    show: false, // Не показывать пока не загрузится
    title: 'Payment Transactions System'
  });

  // Убираем стандартное меню
  Menu.setApplicationMenu(null);

  // Ждем 3 секунды пока backend запустится
  setTimeout(() => {
    mainWindow.loadURL('http://127.0.0.1:8000');
  }, 3000);

  // Показываем окно когда загрузится
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('✅ Application window ready!');
  });

  // Открываем DevTools автоматически (убери для production)
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Обработка ошибок загрузки
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorDescription);
    // Попробуем перезагрузить через 2 секунды
    setTimeout(() => {
      if (mainWindow) {
        mainWindow.loadURL('http://127.0.0.1:8000');
      }
    }, 2000);
  });
}

app.whenReady().then(() => {
  console.log('🎯 Electron app ready!');

  // Запускаем backend
  startBackend();

  // Создаем окно
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Останавливаем backend
  if (backendProcess) {
    console.log('🛑 Stopping backend...');
    backendProcess.kill();
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

// Обработка некорректного завершения
process.on('SIGINT', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  app.quit();
});
