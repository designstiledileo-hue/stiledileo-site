(function () {
  if (document.getElementById('stile-advisor')) return;
  const key = 'stile_advisor_session_v1';
  const pendingKey = 'stile_advisor_handoff_v1';
  const safePaths = new Set(['/projects.html','/venetian-plaster-vancouver.html','/marmorino-vancouver.html','/fireplace-wall-vancouver.html','/plaster-range-hood-vancouver.html','/feature-wall-vancouver.html','/custom-architectural-rock-installation.html','/marmorino-retail-interiors.html','/microcement-vancouver.html','/venetian-plaster-cost-vancouver.html','/brookswood-langley-fireplace-transformation.html','/west-vancouver-fireplace-transformation.html']);
  let history = [], image = null, pending = false, processing = false, generation = 0, activeRequest = null, lastSend = 0;
  try {
    const stored = JSON.parse(sessionStorage.getItem(key));
    if (stored && Date.now() - stored.time < 2 * 60 * 60 * 1000 && Array.isArray(stored.history)) {
      history = stored.history.filter(m => m && ['user','assistant'].includes(m.role) && typeof m.text === 'string' && m.text.length <= 2000).slice(-8);
    }
  } catch (_) { /* Storage is optional. */ }
  const track = name => { try { window.StileAnalytics?.track(name); } catch (_) { /* Never block UI. */ } };
  const save = () => { try { sessionStorage.setItem(key, JSON.stringify({ time: Date.now(), history })); } catch (_) { /* In-memory conversation still works. */ } };
  const make = (tag, className, text) => { const el = document.createElement(tag); if (className) el.className = className; if (text) el.textContent = text; return el; };
  const button = (text, className, fn) => { const b = make('button', className, text); b.type = 'button'; b.dataset.track = 'none'; if (fn) b.addEventListener('click', fn); return b; };
  const root = make('div'); root.id = 'stile-advisor';
  if (document.getElementById('floating-quote')) root.classList.add('sa-has-photo-cta');
  const dialog = make('dialog'); dialog.id = 'stile-advisor-dialog'; dialog.setAttribute('aria-labelledby', 'sa-title');
  const launcher = button('Ask about your project', 'sa-launcher', () => { dialog.showModal(); track('finish_advisor_open'); input.focus(); resize(); });
  launcher.setAttribute('aria-haspopup', 'dialog'); launcher.setAttribute('aria-controls', dialog.id);
  const close = () => { dialog.close(); launcher.focus(); };
  const header = make('div', 'sa-header'), titleRow = make('div', 'sa-title-row');
  const title = make('div', 'sa-title', 'Stile di Leo Finish Advisor'); title.id = 'sa-title';
  const closeButton = button('×', '', close); closeButton.setAttribute('aria-label', 'Close Finish Advisor');
  titleRow.append(title, closeButton); header.append(titleRow, make('p', 'sa-subtitle', "Tell me what you're planning, or upload a photo."), make('p', 'sa-small', 'AI finish advisor · Final scope confirmed by Stile di Leo'));
  const clear = button('New conversation', 'sa-clear', () => {
    generation++; activeRequest?.abort(); pending = false; history = []; image = null; input.value = ''; file.value = ''; thumb.removeAttribute('src'); log.replaceChildren(); photo.hidden = true; chips.hidden = false; status.textContent = ''; handoff.hidden = true; direct.hidden = true; save(); update(); track('finish_advisor_clear'); input.focus();
    try { sessionStorage.removeItem(pendingKey); } catch (_) { /* Optional storage. */ }
  }); header.append(clear);
  const scroll = make('div', 'sa-scroll'), chips = make('div', 'sa-chips'), log = make('div');
  log.setAttribute('role', 'log'); log.setAttribute('aria-live', 'polite'); log.setAttribute('aria-relevant', 'additions'); log.setAttribute('aria-label', 'Project conversation');
  ['Fireplace','Feature Wall','Range Hood','Venetian Plaster / Marmorino','Retail / Commercial','Sculpted Surface','Other'].forEach(label => chips.append(button(label, '', () => { input.value = label === 'Other' ? 'I would like to discuss a decorative finish for ' : `I’m planning a ${label.toLowerCase()} project.`; input.focus(); })));
  scroll.append(chips, log);
  const composer = make('div', 'sa-compose'), photo = make('div', 'sa-photo'); photo.hidden = true;
  const thumb = make('img'); thumb.alt = 'Selected project photo';
  photo.append(thumb, button('Remove photo', '', () => { image = null; file.value = ''; thumb.removeAttribute('src'); photo.hidden = true; update(); }));
  const input = make('textarea'); input.maxLength = 2000; input.placeholder = 'What surface are you working with?'; input.setAttribute('aria-label', 'Your project question');
  const status = make('p', 'sa-status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  const controls = make('div', 'sa-controls'), file = make('input'); file.type = 'file'; file.accept = 'image/jpeg,image/png,image/webp'; file.hidden = true;
  const upload = button('Upload a photo', '', () => file.click());
  const sendButton = button('Send', 'sa-send', send);
  controls.append(upload, sendButton);
  const handoff = button('Request a project review', 'sa-handoff', () => {
    track('finish_advisor_lead_cta');
    const words = history.filter(m => m.role === 'user').map(m => m.text).join('\n');
    const summary = `Finish Advisor — visitor’s project notes (please review):\n${words.slice(-1700)}${words.length > 1700 ? '\n[Earlier notes omitted — please add anything important.]' : ''}`;
    const detail = { summary, imageFile: image?.file || null };
    close();
    if (document.getElementById('estimate-form')) document.dispatchEvent(new CustomEvent('stile:advisor-handoff', { detail }));
    else {
      try { sessionStorage.setItem(pendingKey, JSON.stringify({ summary, time: Date.now() })); window.location.assign('/#estimate'); }
      catch (_) { status.textContent = 'Session storage is unavailable. Please copy your project notes before continuing.'; direct.hidden = false; dialog.showModal(); }
    }
  }); handoff.hidden = history.length === 0;
  const direct = make('a', 'sa-links', 'Continue to the photo form without saved notes'); direct.href = '/#estimate'; direct.dataset.track = 'none'; direct.hidden = true;
  composer.append(photo, input, controls, file, status, handoff, direct, make('p', 'sa-small', 'Sending shares your text and selected photo with OpenAI. Avoid personal or sensitive information. Photos stay out of browser storage; attach again if you change pages.'));
  dialog.append(header, scroll, composer); root.append(launcher, dialog); document.body.append(root);
  // The existing inquiry can open before this asynchronously loaded widget arrives.
  const estimateModal = document.getElementById('estimate-modal');
  if (estimateModal) {
    const syncInquiry = () => { root.inert = estimateModal.classList.contains('is-open'); };
    new MutationObserver(syncInquiry).observe(estimateModal, { attributes: true, attributeFilter: ['class'] });
    syncInquiry();
  }
  dialog.addEventListener('cancel', e => { e.preventDefault(); close(); });
  dialog.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const controls = Array.from(dialog.querySelectorAll('button, textarea, a[href], input')).filter(el => !el.disabled && el.getClientRects().length);
    const first = controls[0], last = controls[controls.length - 1];
    if (e.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (document.activeElement === last || !controls.includes(document.activeElement))) { e.preventDefault(); first.focus(); }
  });
  function resize() { dialog.style.setProperty('--sa-height', `${Math.max(220, (window.visualViewport?.height || innerHeight) - 24)}px`); }
  window.visualViewport?.addEventListener('resize', resize);
  function update() { sendButton.disabled = pending || processing; upload.disabled = pending || processing; sendButton.textContent = pending ? 'Thinking…' : 'Send'; input.disabled = pending; clear.disabled = processing; }
  function add(role, text, links = []) {
    const item = make('div', `sa-message${role === 'user' ? ' sa-user' : ''}`);
    item.append(make('span', 'sa-speaker', role === 'user' ? 'You' : 'Finish Advisor'), document.createTextNode(text));
    const nav = make('div', 'sa-links');
    links.filter(l => l && safePaths.has(l.path) && typeof l.label === 'string').slice(0,2).forEach(l => { const a = make('a', '', l.label.slice(0,80)); a.href = l.path; a.dataset.track = 'none'; nav.append(a); });
    if (nav.childNodes.length) item.append(nav); log.append(item); scroll.scrollTop = scroll.scrollHeight;
  }
  history.forEach(m => add(m.role, m.text)); chips.hidden = history.length > 0;
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(); } });
  async function send() {
    if (pending || processing || Date.now() - lastSend < 1500) return;
    const text = input.value.trim() || (image ? 'Please discuss a decorative finish direction for this photo.' : '');
    if (!text || text.length > 2000) { status.textContent = 'Please enter a question of up to 2,000 characters.'; return; }
    lastSend = Date.now(); const run = generation; pending = true; update(); status.textContent = 'Considering your project…';
    const controller = new AbortController(); activeRequest = controller; const timeout = setTimeout(() => controller.abort(), 25000);
    if (!history.length) track('finish_advisor_started');
    add('user', text); chips.hidden = true;
    const prior = history.slice(-8); history.push({ role: 'user', text }); history = history.slice(-8); save(); input.value = ''; handoff.hidden = false;
    try {
      const response = await fetch('/api/finish-advisor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal, body: JSON.stringify({ message: text, history: prior, ...(image ? { image: image.data } : {}) }) });
      if (!response.ok) throw new Error(response.status === 429 ? 'rate' : 'unavailable');
      const result = await response.json();
      if (typeof result.reply !== 'string' || result.reply.length > 2000 || !Array.isArray(result.links)) throw new Error('unavailable');
      if (run !== generation) return;
      add('assistant', result.reply, result.links); history.push({ role: 'assistant', text: result.reply }); history = history.slice(-8); save(); status.textContent = '';
    } catch (error) {
      if (run !== generation) return;
      status.textContent = error.message === 'rate' ? 'Please wait a minute before asking again. You can also request a project review below.' : 'The Finish Advisor is temporarily unavailable. You can still send your project photo directly to Stile di Leo using Request a project review below.';
      input.value = text;
    } finally { clearTimeout(timeout); if (run === generation) { pending = false; activeRequest = null; update(); } }
  }
  file.addEventListener('change', async () => {
    const selected = file.files[0]; if (!selected) return;
    image = null; photo.hidden = true;
    if (!['image/jpeg','image/png','image/webp'].includes(selected.type) || selected.size > 7 * 1024 * 1024) { status.textContent = 'Choose a JPEG, PNG or WebP photo up to 7 MB. HEIC and GIF are not supported here.'; file.value = ''; return; }
    processing = true; update(); status.textContent = 'Preparing your photo…'; let bitmap;
    try {
      bitmap = await createImageBitmap(selected);
      if (bitmap.width * bitmap.height > 40000000) throw new Error('dimensions');
      const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
      let blob; for (const quality of [.85,.7,.55]) { blob = await new Promise(resolve => canvas.toBlob(resolve,'image/jpeg',quality)); if (blob && blob.size <= 1048576) break; }
      if (!blob || blob.size > 1048576) throw new Error('size');
      const data = await new Promise((resolve,reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(blob); });
      image = { data, file: new File([blob], 'project-photo.jpg', { type: 'image/jpeg' }) }; thumb.src = data; photo.hidden = false;
      status.textContent = 'Photo ready. Send your question to discuss it; it has not been sent yet.'; track('finish_advisor_photo_added');
    } catch (_) { status.textContent = 'This photo could not be prepared. Please choose another JPEG, PNG or WebP.'; file.value = ''; }
    finally { bitmap?.close(); processing = false; update(); }
  });
})();
