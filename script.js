/* =========================
   DATABASE
========================= */
const database = {
  personnel: [
    {
      id: 'AP-000000',
      name: '鳴瀬 可楚',
      sex: 'FEMALE',
      age: '██',
      division: '鳴響',
      rank: 'Leader',
      ability: '因報',
      status: 'ACTIVE',
      secret: true,
      secretRecord: '因果律干渉により収容理論無効。単独行動時は監視班を配置。'
    },
    {
      id: 'AP-838383',
      name: '天城 ユウラ',
      sex: 'FEMALE',
      age: '17',
      division: 'Research',
      rank: 'Analyst',
      ability: '情報分解',
      status: 'DISMISSED',
      secret: true,
      secretRecord: '失踪前にSITE-256機密層への不正アクセス履歴あり。'
    },
    {
      id: 'AP-424242',
      name: '雨宮 レン',
      sex: 'MALE',
      age: '19',
      division: 'Security',
      rank: 'Guard',
      ability: '身体強化',
      status: 'KIA',
      secret: false
    },

    {
  id: "AP-775544",
  category: "personnel",
  name: "雨宮 志乃",
  sex: "FEMALE",
  age: "19",
  division: "IA",
  rank: "ハズマットの秘書",
  ability: `未来演算
右目で短時間先の情報分岐を観測可能。
観測回数が増えるほど疲労が蓄積する。`,
  status: "MIA",
  clearance: "4",
  Description: `黒色端末を常時携帯。
演算補助用の特殊レンズを使用。`,
  record:`仮面演者結成前からハズマットの援助を行っていた。
百鬼夜行事件以降、サイト-███にて勤務中。`,
},

  ],
  objects: [
    {
      id: 'OBJ-220001',
      name: '黒箱',
      class: 'Keter',
      danger: 'HIGH',
      detail: '内部時間停止立方体。',
      secret: true,
      secretRecord: '内部に生体反応を検出。開封命令は永久凍結。'
    },
    {
      id: 'OBJ-889100',
      name: '模倣鏡',
      class: 'Euclid',
      danger: 'MEDIUM',
      detail: '映した対象と異なる表情を返す鏡。精神汚染報告あり。',
      secret: false
    },
    {
      id: 'OBJ-443210',
      name: '泣く人形',
      class: 'Safe',
      danger: 'LOW',
      detail: '深夜2時に涙を流す磁器人形。',
      secret: false
    }
  ]
};

const sfx = {
  boot: new Audio("boot.mp3"),
  click: new Audio("click.mp3"),
  error: new Audio("error.mp3"),
};

function playSound(name) {
  const audio = sfx[name];
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

let previousScreen = null;
let loginAttempts = 0; // 失敗回数を記録する変数
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/* =========================
   BOOT & LOGIN FLOW
========================= */
async function bootSystem() {
  // ★ここを追加：全音声を一度「空再生」してブラウザの制限を解く
  Object.values(sfx).forEach(a => {
    a.play().then(() => { a.pause(); a.currentTime = 0; }).catch(() => {});
  });

  document.getElementById('bootScreen').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  await startSequence();
}

async function typeLog(text, isDot = false) {
  const consoleEl = document.getElementById('loginConsole');
  if (!consoleEl) return;
  const div = document.createElement('div');
  consoleEl.appendChild(div);

  // HTMLタグを1文字として扱わないための正規表現
  const chars = text.match(/<[^>]+>|[^<]/g) || [];

  // 通常のテキストタイピング
  for (const char of chars) {
    div.innerHTML += char;
    consoleEl.scrollTop = consoleEl.scrollHeight;
    
    // タグ以外なら音を鳴らす
    if (!char.startsWith('<')) playSound('click');
    
    await wait(15);
  }

  // ローディングの点々処理（必ず関数の内側に置く）
  if (isDot) {
    for (let i = 0; i < 3; i++) {
      await wait(700);
      div.innerHTML += '.';
      playSound('click'); // 点が出る時もカチッと鳴らす
    }
  }
} // ← ここで初めて関数を閉じる！


async function startSequence() {
  await typeLog("Welcome to Tenri Network OS");
  await typeLog("Loading Kernel", true);
  await typeLog("<br>Enter ID");
  
  const idInput = document.createElement('input');
  idInput.className = "terminal-input";
  document.getElementById('loginConsole').appendChild(idInput);
  idInput.focus();

  idInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const val = idInput.value.trim();
      idInput.disabled = true;

      if (val.length > 0) {
        // 入力したIDを緑色で表示して「Verified（検証済み）」とする演出
        await typeLog(`<br>ID: <span style="color:var(--green)">${val}</span> Verified.`);
        // パスワード入力へ進む
        promptPassword();
      } else {
        // 空欄だった場合だけやり直し
        await typeLog("<br><span style='color:var(--red)'>ID REQUIRED.</span>");
        await wait(600);
        // 入力欄を出し直すために自分自身を呼ぶ
        startSequence(); 
      }
    }
  });
}

async function promptPassword() {
  await typeLog("<br>Enter PASSWORD");
  const passInput = document.createElement('input');
  passInput.type = "password";
  passInput.className = "terminal-input";
  document.getElementById('loginConsole').appendChild(passInput);
  passInput.focus();

  passInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const val = passInput.value.trim();
      passInput.disabled = true;

      if (val === "226227") {
        // --- 成功時 ---
        await typeLog("<br>Checking Credentials", true);
        if(typeof playSound === 'function') playSound('boot'); 
        await typeLog("<span style='color:var(--green);font-weight:bold;'>ACCESS GRANTED.</span>");
        await wait(600);
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainTerminal').style.display = 'flex';
        initTerminal();
      } else {
        // --- 失敗時 ---
        loginAttempts++; 
        if(typeof playSound === 'function') playSound('error');

        if (loginAttempts >= 3) {
          // 3回ミス：記憶処理
          await typeLog("<span style='color:var(--red)'>INITIATING AMNESTICS...</span>", true);

          const flash = document.createElement('div');
          flash.style.position = 'fixed';
          flash.style.top = '0';
          flash.style.left = '0';
          flash.style.width = '100vw';
          flash.style.height = '100vh';
          flash.style.backgroundColor = 'white';
          flash.style.zIndex = '9999';
          flash.style.opacity = '0';
          flash.style.transition = 'opacity 0.2s ease-in';
          document.body.appendChild(flash);

          setTimeout(() => { flash.style.opacity = '1'; }, 100);

          await wait(5000);
          location.reload();
        } else {
          // 3回未満：再入力
          await typeLog(`<br><span style='color:var(--red)'>ACCESS DENIED. (${loginAttempts}/3)</span>`);
          await wait(600);
          promptPassword(); 
        }
      }
    }
  });
}

/* =========================
   MAIN TERMINAL CORE
========================= */
function setOutput(html) {
  const output = document.getElementById('output');
  if (!output) return;
  output.innerHTML = `<div>${html}</div>`;
  output.scrollTop = 0;
  playSound('click');
}

function initTerminal() {
  previousScreen = null;
  setOutput(`
    Tenri Network OS initialized.<br>
    Administrator session connected.<br><br>
    Select command from buttons above.
  `);
}

function withBackButton(content) {
  return `
    ${content}
    <br><br>
    <button class="data-btn" onclick="goBack()">← BACK</button>
  `;
}

function goBack() {
  playSound('click');
  if (previousScreen) {
    previousScreen();
  } else {
    initTerminal();
  }
}

/* =========================
   COMMANDS
========================= */
function helpCommand() {
  previousScreen = initTerminal;
  setOutput(withBackButton(`
    === SYSTEM HELP ===<br>
    - PERSONNEL : View staff records<br>
    - OBJECTS   : View contained objects<br>
    - SECRET    : Access high-clearance data<br>
    - LOGOUT    : Termination session
  `));
}

function showPersonnelButtons() {
  previousScreen = initTerminal;
  let html = `=== PERSONNEL DATABASE ===<br>`;
  database.personnel.forEach(p => {
    html += `<button class="data-btn" onclick="searchDatabase('${p.id}')">${p.id} : ${p.name}</button><br>`;
  });
  setOutput(withBackButton(html));
}

function showObjectButtons() {
  previousScreen = initTerminal;
  let html = `=== OBJECT DATABASE ===<br>`;
  database.objects.forEach(o => {
    html += `<button class="data-btn" onclick="searchDatabase('${o.id}')">${o.id} : ${o.name}</button><br>`;
  });
  setOutput(withBackButton(html));
}

function searchDatabase(keyword) {
  const p = database.personnel.find(x => x.id === keyword);
  if (p) {
    previousScreen = showPersonnelButtons;
    setOutput(withBackButton(`
      <div class="info-panel">
        ID: ${p.id}<br>
        NAME: ${p.name}<br>
        DIVISION: ${p.division}<br>
        RANK: ${p.rank}<br>
        STATUS: ${p.status}
      </div>
      ${p.secret ? '<div class="secret-detected">[ SECRET RECORD AVAILABLE IN SECRET TAB ]</div>' : ''}
    `));
    return;
  }

  const o = database.objects.find(x => x.id === keyword);
  if (o) {
    previousScreen = showObjectButtons;
    setOutput(withBackButton(`
      <div class="info-panel">
        ID: ${o.id}<br>
        NAME: ${o.name}<br>
        CLASS: ${o.class}<br>
        DANGER: ${o.danger}<br>
        DETAIL: ${o.detail}
      </div>
      ${o.secret ? '<div class="secret-detected">[ SECRET RECORD AVAILABLE IN SECRET TAB ]</div>' : ''}
    `));
    return;
  }
}

/* =========================
   SECRET SYSTEM
========================= */
function openSecretAuth() {
  playSound('click');
  document.getElementById('secretAuth').style.display = 'flex';
  document.getElementById('secretPassInput').value = '';
  document.getElementById('secretError').innerHTML = '';
  setTimeout(() => document.getElementById('secretPassInput').focus(), 50);
}

function closeSecretAuth() {
  playSound('click');
  document.getElementById('secretAuth').style.display = 'none';
}

function confirmSecretAccess() {
  const val = document.getElementById('secretPassInput').value.trim();
  if (val === "NULL") {
    playSound('boot');
    document.getElementById('secretAuth').style.display = 'none';
    showSecretMenu();
  } else {
    playSound('error');
    document.getElementById('secretError').innerHTML = 'ACCESS DENIED.';
  }
}

function showSecretMenu() {
  previousScreen = initTerminal;
  setOutput(withBackButton(`
    === CLASSIFIED RECORDS ===<br>
    <button class="data-btn" onclick="showSecretPersonnel()">SECRET PERSONNEL</button><br>
    <button class="data-btn" onclick="showSecretObjects()">SECRET OBJECTS</button>
  `));
}

function showSecretPersonnel() {
  previousScreen = showSecretMenu;
  let html = `=== TOP SECRET PERSONNEL ===<br>`;
  database.personnel.filter(p => p.secret).forEach(p => {
    html += `<button class="data-btn" onclick="openSecretFile('P','${p.id}')">${p.name}</button><br>`;
  });
  setOutput(withBackButton(html));
}

function showSecretObjects() {
  previousScreen = showSecretMenu;
  let html = `=== TOP SECRET OBJECTS ===<br>`;
  database.objects.filter(o => o.secret).forEach(o => {
    html += `<button class="data-btn" onclick="openSecretFile('O','${o.id}')">${o.name}</button><br>`;
  });
  setOutput(withBackButton(html));
}

function openSecretFile(type, id) {
  playSound('click');
  const target = type === 'P' ? database.personnel.find(x => x.id === id) : database.objects.find(x => x.id === id);
  previousScreen = type === 'P' ? showSecretPersonnel : showSecretObjects;
  setOutput(withBackButton(`
    <div style="color:var(--red)">[ CLASSIFIED RECORD ]</div><br>
    TARGET: ${target.name}<br><br>
    ${target.secretRecord}
  `));
}

/* =========================
   LOGOUT
========================= */
function openLogoutConfirm() {
  playSound('click');
  document.getElementById('logoutConfirm').style.display = 'flex';
}

function closeLogoutConfirm() {
  playSound('click');
  document.getElementById('logoutConfirm').style.display = 'none';
}

async function confirmLogout() {
  playSound('click');
  const box = document.querySelector('#logoutConfirm .terminal-box');
  box.innerHTML = `<div id="rebootLog"></div>`;
  const rebootLog = document.getElementById('rebootLog');

  async function rbType(text) {
    const d = document.createElement('div');
    d.innerHTML = text;
    rebootLog.appendChild(d);
    playSound('click');
    await wait(500);
  }

  await rbType("Closing session...");
  await rbType("Clearing cache...");
  await rbType("Rebooting...");
  await wait(500);
  location.reload();
}

/* =========================
   INITIALIZE
========================= */
window.addEventListener('DOMContentLoaded', () => {
  const bootBtn = document.getElementById('bootScreen');
  if (bootBtn) {
    // ↓ ここに async を追加！
    bootBtn.addEventListener('click', async () => { 
      await bootSystem(); 
    }, { once: true });
  }
});

// ステータスに応じたクラス名を返す関数
function getStatusClass(status) {
  switch (status) {
    case 'ACTIVE': return 'status-active';
    case 'KIA':    return 'status-kia';
    case 'MIA':    return 'status-mia';
    default:       return '';
  }
}

// 表示部分の書き換え例（innerHTMLに入れている場所）
// <span class="${getStatusClass(agent.status)}">${agent.status}</span> 
// のようにクラスを付与します。

// キャラクター情報を表示する関数内での処理例
function getStatusColor(status) {
  switch (status.toUpperCase()) {
    case 'ACTIVE': return '#00ff00'; // 生存・活動中
    case 'KIA':    return '#ff4444'; // 死亡
    case 'MIA':    return '#888888'; // 行方不明
    case 'DISMISSED': return '#ffae00'; // 解任
    default:       return '#ffffff'; // その他
  }
}

// HTML生成時のイメージ
const statusColor = getStatusColor(member.status);
const statusHTML = `<span style="color: ${statusColor}; border: 1px solid ${statusColor}; padding: 2px 5px;">${member.status}</span>`;

function renderAgentStatus(status) {
    let color = "#ffffff";
    let className = "status-tag";

    switch (status) {
        case 'ACTIVE':
            color = "#00ff00"; // 鮮やかな緑
            break;
        case 'KIA':
            color = "#ff4444"; // 警告の赤
            className += " blink"; // 殉職は点滅させると不穏
            break;
        case 'MIA':
            color = "#888888"; // 沈んだグレー
            break;
        default:
            color = "#00ffff"; // その他はシアン
    }

    return `<span class="${className}" style="color: ${color}; border: 1px solid ${color}; padding: 2px 8px;">${status}</span>`;
}