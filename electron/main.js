const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

// URL облачного сервиса (уже запущенного на Render)
const APP_URL = 'https://payment-transactions.onrender.com';

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

  // Загружаем приложение с Render
  console.log(`📡 Loading app from: ${APP_URL}`);
  mainWindow.loadURL(APP_URL);

  // Показываем окно когда загрузится
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('✅ Application window ready!');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Обработка ошибок загрузки
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('⚠️ Failed to load:', errorDescription);
    console.log('🔄 Retrying in 3 seconds...');
    // Попробуем перезагрузить через 3 секунды
    setTimeout(() => {
      if (mainWindow) {
        mainWindow.loadURL(APP_URL);
      }
    }, 3000);
  });
}

app.whenReady().then(() => {
  console.log('🎯 Electron app ready!');
  console.log(`🌐 Connecting to cloud service: ${APP_URL}`);

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
