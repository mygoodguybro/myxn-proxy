// ============================================================================
// STUDYHUB v4 - FULL STACK
// ============================================================================

const GAMES_DATABASE = [
  { id: 'chess-com', name: 'Chess.com', category: 'Strategy', icon: '♟️', url: 'https://www.chess.com' },
  { id: 'geoguessr', name: 'GeoGuessr', category: 'Geography', icon: '🌍', url: 'https://www.geoguessr.com' },
  { id: 'skribbl', name: 'Skribbl.io', category: 'Drawing', icon: '🎨', url: 'https://skribbl.io' },
  { id: 'agar', name: 'Agar.io', category: 'Multiplayer', icon: '⚫', url: 'https://agar.io' },
  { id: 'slither', name: 'Slither.io', category: 'Multiplayer', icon: '🐍', url: 'https://slither.io' },
  { id: 'wordle', name: 'Wordle', category: 'Puzzle', icon: '🎯', url: 'https://www.nytimes.com/games/wordle' },
  { id: '2048', name: '2048', category: 'Puzzle', icon: '🔢', url: 'https://play2048.co' },
  { id: 'tetris', name: 'Tetris', category: 'Classic', icon: '⬛', url: 'https://tetris.com' },
  { id: 'flappy', name: 'Flappy Bird', category: 'Arcade', icon: '🐦', url: 'https://flappybird.io' },
  { id: 'dino', name: 'Chrome Dino', category: 'Arcade', icon: '🦖', url: 'https://chromedino.com' },
  { id: 'breakout', name: 'Breakout', category: 'Arcade', icon: '🎮', url: 'https://playbreakout.online' },
  { id: 'pacman', name: 'Pac-Man', category: 'Classic', icon: '👾', url: 'https://pacman.live' },
];

const APPS_DATABASE = [
  { id: 'geforce', name: 'GeForce NOW', icon: '🎮', url: 'https://play.geforcenow.com', category: 'Gaming' },
  { id: 'android', name: 'Android Emulator', icon: '📱', url: 'https://www.emulator.online', category: 'Tools' },
  { id: 'spotify', name: 'Spotify', icon: '🎵', url: 'https://www.spotify.com', category: 'Media' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', url: 'https://www.youtube.com', category: 'Media' },
  { id: 'reddit', name: 'Reddit', icon: '🔗', url: 'https://www.reddit.com', category: 'Social' },
  { id: 'discord', name: 'Discord', icon: '💬', url: 'https://discord.com', category: 'Social' },
  { id: 'twitter', name: 'Twitter/X', icon: '𝕏', url: 'https://twitter.com', category: 'Social' },
];

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

let appState = {
  currentWindow: 'desktop',
  windows: new Map(),
  password: 'unblock',
  passwordEntered: false,
  windowCounter: 0,
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  loadSettings();
  registerServiceWorker();
});

function initializeApp() {
  const osScreen = document.getElementById('os-screen');
  const taskbar = document.getElementById('taskbar');
  
  osScreen.addEventListener('click', (e) => {
    if (e.target === osScreen) {
      closeAllWindows();
    }
  });

  renderTaskbar();
  showPasswordPrompt();
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('Service Worker registered'))
      .catch((error) => console.error('Service Worker error:', error));
  }
}

// ============================================================================
// PASSWORD SYSTEM
// ============================================================================

function showPasswordPrompt() {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  modal.innerHTML = `
    <div style="text-align: center; color: #b794f6;">
      <h1 style="font-size: 48px; margin-bottom: 20px;">🔐 StudyHub</h1>
      <p style="font-size: 14px; color: #999; margin-bottom: 20px;">Enter password to unlock</p>
      <input 
        type="password" 
        id="passwordInput" 
        placeholder="Password" 
        style="
          padding: 12px 16px;
          background: rgba(183, 148, 246, 0.1);
          border: 1px solid #b794f6;
          border-radius: 6px;
          color: #b794f6;
          font-size: 14px;
          width: 300px;
          text-align: center;
          outline: none;
        "
      >
      <p style="font-size: 12px; color: #666; margin-top: 20px;">Hint: educational platform</p>
    </div>
  `;

  document.body.appendChild(modal);

  const input = document.getElementById('passwordInput');
  input.focus();

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (input.value === appState.password) {
        appState.passwordEntered = true;
        modal.remove();
      } else {
        input.value = '';
        input.style.borderColor = '#ff6b6b';
        setTimeout(() => {
          input.style.borderColor = '#b794f6';
        }, 500);
      }
    }
  });
}

// ============================================================================
// WINDOW MANAGEMENT
// ============================================================================

function createWindow(type, title, icon = '📦') {
  if (!appState.passwordEntered) {
    showPasswordPrompt();
    return;
  }

  const windowId = `window-${appState.windowCounter++}`;
  const osScreen = document.getElementById('os-screen');

  const windowEl = document.createElement('div');
  windowEl.id = windowId;
  windowEl.className = 'window';
  windowEl.style.cssText = `
    position: absolute;
    width: 800px;
    height: 600px;
    background: #1a1a2e;
    border: 1px solid rgba(183, 148, 246, 0.2);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    left: ${50 + appState.windowCounter * 20}px;
    top: ${50 + appState.windowCounter * 20}px;
  `;

  windowEl.innerHTML = `
    <div style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: rgba(183, 148, 246, 0.1);
      border-bottom: 1px solid rgba(183, 148, 246, 0.2);
      border-radius: 8px 8px 0 0;
      cursor: move;
      user-select: none;
    " class="window-title-bar">
      <span style="font-weight: 600; font-size: 14px; color: #b794f6;">${icon} ${title}</span>
      <button class="close-btn" style="
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        font-size: 20px;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">×</button>
    </div>
    <div class="window-content" style="
      flex: 1;
      overflow: hidden;
      background: #0f0a1a;
    "></div>
  `;

  osScreen.appendChild(windowEl);

  // Window controls
  const closeBtn = windowEl.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => {
    windowEl.remove();
    appState.windows.delete(windowId);
  });

  // Dragging
  const titleBar = windowEl.querySelector('.window-title-bar');
  makeDraggable(windowEl, titleBar);

  // Window-specific content
  const contentDiv = windowEl.querySelector('.window-content');
  renderWindowContent(type, contentDiv, windowId);

  appState.windows.set(windowId, { type, title, element: windowEl });
  return windowId;
}

function makeDraggable(element, handle) {
  let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;

  handle.addEventListener('mousedown', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const rect = element.getBoundingClientRect();
    offsetX = mouseX - rect.left;
    offsetY = mouseY - rect.top;

    const moveFn = (moveEvent) => {
      element.style.left = (moveEvent.clientX - offsetX) + 'px';
      element.style.top = (moveEvent.clientY - offsetY) + 'px';
    };

    const upFn = () => {
      document.removeEventListener('mousemove', moveFn);
      document.removeEventListener('mouseup', upFn);
    };

    document.addEventListener('mousemove', moveFn);
    document.addEventListener('mouseup', upFn);
  });
}

function renderWindowContent(type, container, windowId) {
  container.style.cssText = `
    padding: 20px;
    color: #e0e0e0;
    font-size: 14px;
    overflow-y: auto;
  `;

  switch (type) {
    case 'browser':
      container.innerHTML = `
        <div style="height: 100%; display: flex; flex-direction: column;">
          <input type="text" id="browser-url-${windowId}" placeholder="Enter URL..." style="
            padding: 8px;
            background: rgba(183, 148, 246, 0.1);
            border: 1px solid #b794f6;
            border-radius: 4px;
            color: #e0e0e0;
            margin-bottom: 12px;
          ">
          <button onclick="launchBrowser('${windowId}')" style="
            padding: 8px 16px;
            background: #b794f6;
            border: none;
            border-radius: 4px;
            color: #0f0a1a;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 12px;
          ">Open in Proxy</button>
          <iframe id="browser-frame-${windowId}" style="
            flex: 1;
            border: none;
            border-radius: 4px;
            display: none;
          "></iframe>
        </div>
      `;
      break;

    case 'games':
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; height: 100%; overflow-y: auto;">
          ${GAMES_DATABASE.map(game => `
            <div onclick="launchGame('${game.url}', '${game.name}')" style="
              padding: 16px;
              background: rgba(183, 148, 246, 0.1);
              border: 1px solid rgba(183, 148, 246, 0.3);
              border-radius: 6px;
              cursor: pointer;
              transition: all 0.3s;
              text-align: center;
            " class="game-card" onmouseover="this.style.background='rgba(183, 148, 246, 0.2)'" onmouseout="this.style.background='rgba(183, 148, 246, 0.1)'">
              <div style="font-size: 32px; margin-bottom: 8px;">${game.icon}</div>
              <div style="font-weight: 600; font-size: 13px;">${game.name}</div>
              <div style="font-size: 11px; color: #999; margin-top: 4px;">${game.category}</div>
            </div>
          `).join('')}
        </div>
      `;
      break;

    case 'apps':
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; height: 100%; overflow-y: auto;">
          ${APPS_DATABASE.map(app => `
            <div onclick="launchApp('${app.url}', '${app.name}')" style="
              padding: 16px;
              background: rgba(16, 185, 129, 0.1);
              border: 1px solid rgba(16, 185, 129, 0.3);
              border-radius: 6px;
              cursor: pointer;
              transition: all 0.3s;
              text-align: center;
            " onmouseover="this.style.background='rgba(16, 185, 129, 0.2)'" onmouseout="this.style.background='rgba(16, 185, 129, 0.1)'">
              <div style="font-size: 32px; margin-bottom: 8px;">${app.icon}</div>
              <div style="font-weight: 600; font-size: 13px;">${app.name}</div>
              <div style="font-size: 11px; color: #999; margin-top: 4px;">${app.category}</div>
            </div>
          `).join('')}
        </div>
      `;
      break;

    case 'chat':
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; height: 100%;">
          <div id="chat-messages" style="
            flex: 1;
            overflow-y: auto;
            margin-bottom: 12px;
            padding: 12px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 4px;
          "></div>
          <div style="display: flex; gap: 8px;">
            <input 
              type="text" 
              id="chat-input-${windowId}" 
              placeholder="Type a message..." 
              style="
                flex: 1;
                padding: 8px;
                background: rgba(183, 148, 246, 0.1);
                border: 1px solid #b794f6;
                border-radius: 4px;
                color: #e0e0e0;
                font-size: 12px;
              "
            >
            <button onclick="sendChatMessage('${windowId}')" style="
              padding: 8px 16px;
              background: #b794f6;
              border: none;
              border-radius: 4px;
              color: #0f0a1a;
              font-weight: 600;
              cursor: pointer;
              font-size: 12px;
            ">Send</button>
          </div>
        </div>
      `;
      
      const chatInput = document.getElementById(`chat-input-${windowId}`);
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          sendChatMessage(windowId);
        }
      });
      break;

    case 'settings':
      renderSettings(container);
      break;

    default:
      container.innerHTML = `<p>Window type: ${type}</p>`;
  }
}

function renderSettings(container) {
  const settings = JSON.parse(localStorage.getItem('studyhubSettings') || '{}');

  container.innerHTML = `
    <div style="max-width: 400px;">
      <div style="margin-bottom: 24px;">
        <h3 style="color: #10b981; margin-bottom: 12px; font-size: 14px;">🔗 Proxy Service</h3>
        <select id="proxySelect" onchange="setProxyService(this.value)" style="
          width: 100%;
          padding: 8px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid #10b981;
          border-radius: 4px;
          color: #10b981;
          font-size: 12px;
          margin-bottom: 8px;
        ">
          <option value="sj2" ${settings.proxyService === 'sj2' ? 'selected' : ''}>Scramjet v2 (Default)</option>
          <option value="sj1" ${settings.proxyService === 'sj1' ? 'selected' : ''}>Scramjet v1</option>
          <option value="uv" ${settings.proxyService === 'uv' ? 'selected' : ''}>UV (Ultraviolet)</option>
        </select>
        <p style="font-size: 11px; color: #999; margin: 0;">Current: ${settings.proxyService === 'uv' ? 'UV' : settings.proxyService === 'sj1' ? 'Scramjet v1' : 'Scramjet v2 (Default)'}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="color: #b794f6; margin-bottom: 12px; font-size: 14px;">🎨 Color Theme</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
          ${['Purple', 'Cyan', 'Magenta', 'Blue', 'Green'].map(theme => `
            <button onclick="setColorTheme('${theme}')" style="
              padding: 10px;
              background: ${settings.colorTheme === theme ? '#b794f6' : 'rgba(183, 148, 246, 0.1)'};
              border: 1px solid ${settings.colorTheme === theme ? '#b794f6' : 'rgba(183, 148, 246, 0.3)'};
              border-radius: 4px;
              color: ${settings.colorTheme === theme ? '#0f0a1a' : '#b794f6'};
              font-weight: 600;
              cursor: pointer;
              font-size: 12px;
            ">${theme}</button>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="color: #b794f6; margin-bottom: 12px; font-size: 14px;">🎭 Proxy Mask</h3>
        <select id="maskSelect" onchange="setProxyMask(this.value)" style="
          width: 100%;
          padding: 8px;
          background: rgba(183, 148, 246, 0.1);
          border: 1px solid #b794f6;
          border-radius: 4px;
          color: #b794f6;
          font-size: 12px;
        ">
          <option value="ixl" ${settings.proxyMask === 'ixl' ? 'selected' : ''}>IXL - Math & English</option>
          <option value="khan" ${settings.proxyMask === 'khan' ? 'selected' : ''}>Khan Academy</option>
          <option value="canvas" ${settings.proxyMask === 'canvas' ? 'selected' : ''}>Canvas</option>
          <option value="google" ${settings.proxyMask === 'google' ? 'selected' : ''}>Google Classroom</option>
          <option value="schoology" ${settings.proxyMask === 'schoology' ? 'selected' : ''}>Schoology</option>
        </select>
        <p style="font-size: 11px; color: #999; margin-top: 8px;">The proxy will be labeled as your selected study app</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="color: #b794f6; margin-bottom: 12px; font-size: 14px;">🎨 Background</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
          ${['Deep Space', 'Ocean Blue', 'Forest Green', 'Sunset', 'Neon Cyan', 'Dark Purple', 'Midnight'].map(bg => `
            <button onclick="setBackground('${bg}')" style="
              padding: 10px;
              background: ${settings.background === bg ? '#10b981' : 'rgba(16, 185, 129, 0.1)'};
              border: 1px solid ${settings.background === bg ? '#10b981' : 'rgba(16, 185, 129, 0.3)'};
              border-radius: 4px;
              color: ${settings.background === bg ? '#0f0a1a' : '#10b981'};
              font-weight: 600;
              cursor: pointer;
              font-size: 11px;
            ">${bg}</button>
          `).join('')}
        </div>
      </div>

      <div style="padding: 12px; background: rgba(183, 148, 246, 0.1); border-radius: 4px; border: 1px solid rgba(183, 148, 246, 0.2);">
        <p style="font-size: 12px; color: #999; margin: 0;">StudyHub v4.0 | Proxy: Scramjet v2 (Default)</p>
        <p style="font-size: 12px; color: #999; margin: 8px 0 0 0;">Password: ${appState.password}</p>
      </div>
    </div>
  `;
}

// ============================================================================
// PROXY LAUNCHER
// ============================================================================

function launchGame(url, name) {
  const mask = JSON.parse(localStorage.getItem('studyhubSettings') || '{}').proxyMask || 'ixl';
  sessionStorage.setItem('proxyMask', mask);
  
  const masks = {
    'ixl': 'IXL - Math & English',
    'khan': 'Khan Academy',
    'canvas': 'Canvas - Learning Management',
    'google': 'Google Classroom',
    'schoology': 'Schoology',
  };
  
  sessionStorage.setItem('proxyMaskTitle', masks[mask] || 'IXL - Math & English');
  
  // Redirect through aboutblank for history hiding
  window.location.href = `/aboutblank.html?mask=${mask}`;
  
  // After redirect, proxy will load
  setTimeout(() => {
    const encoded = btoa(url);
    window.location.href = `/proxy.html?url=${encoded}`;
  }, 100);
}

function launchApp(url, name) {
  launchGame(url, name);
}

function launchBrowser(windowId) {
  const urlInput = document.getElementById(`browser-url-${windowId}`);
  const url = urlInput.value.trim();

  if (!url) return;

  let fullUrl = url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    fullUrl = 'https://' + url;
  }

  const encoded = btoa(fullUrl);
  const proxyUrl = `/uv/service?url=${encoded}`;

  const frame = document.getElementById(`browser-frame-${windowId}`);
  frame.src = proxyUrl;
  frame.style.display = 'block';
}

// ============================================================================
// SETTINGS MANAGEMENT
// ============================================================================

function setColorTheme(theme) {
  const settings = JSON.parse(localStorage.getItem('studyhubSettings') || '{}');
  settings.colorTheme = theme;
  localStorage.setItem('studyhubSettings', JSON.stringify(settings));
  applyTheme();

  // Refresh settings window
  const settingsWindow = Array.from(appState.windows.values()).find(w => w.type === 'settings');
  if (settingsWindow) {
    const content = settingsWindow.element.querySelector('.window-content');
    renderSettings(content);
  }
}

function setProxyService(service) {
  const settings = JSON.parse(localStorage.getItem('studyhubSettings') || '{}');
  settings.proxyService = service;
  localStorage.setItem('studyhubSettings', JSON.stringify(settings));
  
  // Refresh settings window
  const settingsWindow = Array.from(appState.windows.values()).find(w => w.type === 'settings');
  if (settingsWindow) {
    const content = settingsWindow.element.querySelector('.window-content');
    renderSettings(content);
  }
}

function setProxyMask(mask) {
  const settings = JSON.parse(localStorage.getItem('studyhubSettings') || '{}');
  settings.proxyMask = mask;
  localStorage.setItem('studyhubSettings', JSON.stringify(settings));
}

function setBackground(bg) {
  const settings = JSON.parse(localStorage.getItem('studyhubSettings') || '{}');
  settings.background = bg;
  localStorage.setItem('studyhubSettings', JSON.stringify(settings));
  applyBackground();

  // Refresh settings window
  const settingsWindow = Array.from(appState.windows.values()).find(w => w.type === 'settings');
  if (settingsWindow) {
    const content = settingsWindow.element.querySelector('.window-content');
    renderSettings(content);
  }
}

function applyTheme() {
  const settings = JSON.parse(localStorage.getItem('studyhubSettings') || '{}');
  const themes = {
    'Purple': ['#b794f6', '#10b981', '#d97706'],
    'Cyan': ['#00d4ff', '#10b981', '#fbbf24'],
    'Magenta': ['#ec4899', '#10b981', '#fbbf24'],
    'Blue': ['#3b82f6', '#06b6d4', '#f59e0b'],
    'Green': ['#10b981', '#06b6d4', '#f59e0b'],
  };

  const [primary, secondary, accent] = themes[settings.colorTheme] || themes['Purple'];
  document.documentElement.style.setProperty('--primary', primary);
  document.documentElement.style.setProperty('--secondary', secondary);
  document.documentElement.style.setProperty('--accent', accent);
}

function applyBackground() {
  const settings = JSON.parse(localStorage.getItem('studyhubSettings') || '{}');
  const backgrounds = {
    'Deep Space': 'radial-gradient(circle at 20% 50%, #1a0033 0%, #0f0a1a 100%)',
    'Ocean Blue': 'linear-gradient(135deg, #0a1a3a 0%, #0f0a1a 100%)',
    'Forest Green': 'linear-gradient(135deg, #0a3a1a 0%, #0f0a1a 100%)',
    'Sunset': 'linear-gradient(135deg, #3a1a0a 0%, #0f0a1a 100%)',
    'Neon Cyan': 'linear-gradient(135deg, #0a3a3a 0%, #0f0a1a 100%)',
    'Dark Purple': 'linear-gradient(135deg, #2a0a4a 0%, #0f0a1a 100%)',
    'Midnight': 'linear-gradient(135deg, #0a0a2a 0%, #0f0a1a 100%)',
  };

  const bg = backgrounds[settings.background] || backgrounds['Deep Space'];
  document.getElementById('os-screen').style.background = bg;
}

function loadSettings() {
  applyTheme();
  applyBackground();
}

function closeAllWindows() {
  appState.windows.forEach((w) => w.element.remove());
  appState.windows.clear();
}

function sendChatMessage(windowId) {
  const input = document.getElementById(`chat-input-${windowId}`);
  const message = input.value.trim();
  
  if (!message) return;
  
  const messagesDiv = document.querySelector(`#${windowId.replace(/[^a-zA-Z0-9-]/g, '')} .window-content #chat-messages`);
  if (!messagesDiv) return;
  
  // Add user message
  const userMsg = document.createElement('div');
  userMsg.style.cssText = `
    margin-bottom: 8px;
    padding: 8px 12px;
    background: rgba(183, 148, 246, 0.2);
    border-radius: 4px;
    text-align: right;
    font-size: 12px;
    color: #b794f6;
  `;
  userMsg.textContent = message;
  messagesDiv.appendChild(userMsg);
  
  // Simulate response
  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.style.cssText = `
      margin-bottom: 8px;
      padding: 8px 12px;
      background: rgba(16, 185, 129, 0.2);
      border-radius: 4px;
      text-align: left;
      font-size: 12px;
      color: #10b981;
    `;
    botMsg.textContent = 'Got it! ' + message.split(' ')[0].toUpperCase();
    messagesDiv.appendChild(botMsg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }, 500);
  
  input.value = '';
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function renderTaskbar() {
  const taskbarApps = document.getElementById("taskbar-apps");
  if (!taskbarApps) return;
  const taskbarApps = document.getElementById('taskbar-apps');
  if (!taskbarApps) return;
  
  taskbarApps.innerHTML = `
    <button onclick="createWindow('browser', 'Browser', '🌐')" class="taskbar-btn">🌐 Browser</button>
    <button onclick="createWindow('games', 'Games', '🎮')" class="taskbar-btn">🎮 Games</button>
    <button onclick="createWindow('apps', 'Apps', '📦')" class="taskbar-btn">📦 Apps</button>
    <button onclick="createWindow('chat', 'Chat', '💬')" class="taskbar-btn">💬 Chat</button>
    <button onclick="createWindow('settings', 'Settings', '⚙️')" class="taskbar-btn">⚙️ Settings</button>
  `;
}

console.log('StudyHub v4 loaded. Password: unblock');
