// js/chatbot.js
export function initChatbot(root, config = {}) {
  const {
    title = "Sohbet",
    position = "bottom-right",
    api = "/api/chat",
    storageKey = "chat_history",
    welcome = "Merhaba!",
    demo = false, // true ise backend yokken sahte cevap üretir
  } = config;

  // --- KÖK KATMAN ---
  root.innerHTML = `
    <div class="cb-container ${position}">
      <button class="cb-toggle" aria-label="Sohbeti aç/kapat">💬 ${title}</button>
      <div class="cb-panel" aria-live="polite">
        <div class="cb-header">
          <div class="cb-title">${title}</div>
          <div class="cb-status">Çevrimiçi</div>
        </div>
        <div class="cb-messages"></div>
        <div class="cb-typing" style="display:none;">
          <span class="cb-dot"></span><span class="cb-dot"></span><span class="cb-dot"></span>
        </div>
        <form class="cb-inputrow">
          <input class="cb-input" type="text" placeholder="Mesajınızı yazın..." autocomplete="off"/>
          <button class="cb-send" type="submit">Gönder</button>
        </form>
      </div>
    </div>
  `;

  const $container = root.querySelector(".cb-container");
  const $toggle    = root.querySelector(".cb-toggle");
  const $panel     = root.querySelector(".cb-panel");
  const $messages  = root.querySelector(".cb-messages");
  const $form      = root.querySelector(".cb-inputrow");
  const $input     = root.querySelector(".cb-input");
  const $typing    = root.querySelector(".cb-typing");
  const $status    = root.querySelector(".cb-status");

  let open = false;
  function setOpen(v){
    open = v;
    $container.classList.toggle("open", open);
    if (open) $input.focus();
  }

  // --- GEÇMİŞ ---
  const history = loadHistory();
  if (history.length === 0) pushMsg("bot", welcome);
  else history.forEach(m => pushExisting(m.role, m.text));

  // --- EVENTS ---
  $toggle.addEventListener("click", () => setOpen(!open));

  // Enter = gönder, Shift+Enter = yeni satır
  $form.addEventListener("submit", onSubmit);
  $input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  });

  async function onSubmit(e){
  e.preventDefault();
  const text = $input.value.trim();
  if (!text) return;

  // inputu temizle ve kullanıcı mesajını ekle
  $input.value = "";
  pushMsg("user", text);
  saveHistory();

  try {
    showTyping(true);

    // cevabı al
    const reply = await callBot(api, text, history, demo);

    // typing göstergesini kapat, typewriter başlıyor
    showTyping(false);

    // bot cevabını akıtarak yaz
    await pushMsgStream(reply || "(boş yanıt)", 14);

    // geçmişe tek bir bot mesajı olarak ekle
    history.push({ role: "bot", text: reply || "(boş yanıt)" });
    saveHistory();

  } catch (err) {
    console.error(err);
    showTyping(false);
    pushMsg("bot", "Üzgünüm, şu anda yanıt veremiyorum.");
    saveHistory();

  } finally {
    scrollToEnd();
  }
}


  function showTyping(v){
    $typing.style.display = v ? "flex" : "none";
    $status.textContent = v ? "Yazıyor…" : "Çevrimiçi";
  }

  // --- MESAJ İŞLEMLERİ ---
  function pushMsg(role, text){
    const item = document.createElement("div");
    item.className = `cb-msg ${role}`;
    item.textContent = text;
    $messages.appendChild(item);
    scrollToEnd();
    history.push({ role, text });
  }
  function pushExisting(role, text){
    const item = document.createElement("div");
    item.className = `cb-msg ${role}`;
    item.textContent = text;
    $messages.appendChild(item);
  }

  // === TYPEWRITER (bot mesajını akıtarak yaz) ===
function pushMsgStream(text, delay = 14) {
  return new Promise((resolve) => {
    const item = document.createElement("div");
    item.className = "cb-msg bot";
    item.textContent = "";
    $messages.appendChild(item);

    let i = 0;
    const len = text.length;
    const timer = setInterval(() => {
      // küçük bir hızlandırma: boşluk ve noktalama sonrası biraz beklet
      const ch = text[i++];
      item.textContent += ch;
      scrollToEnd();

      if (i >= len) {
        clearInterval(timer);
        resolve();
      }
    }, delay);
  });
}

  function scrollToEnd(){ $messages.scrollTop = $messages.scrollHeight; }

  // --- STORAGE ---
  function saveHistory(){
    try { localStorage.setItem(storageKey, JSON.stringify(history)); } catch {}
  }
  function loadHistory(){
    try { return JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch { return []; }
  }

  // --- API Katmanı ---
  async function callBot(apiUrl, userText, hist, demoMode){
    if (demoMode) {
      await new Promise(r => setTimeout(r, 500));
      return `Demo cevabı: "${userText}" mesajını aldım.`;
    }
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText, history: hist }),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    return data.reply;
  }
}
