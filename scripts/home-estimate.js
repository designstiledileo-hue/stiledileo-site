(() => {
  'use strict';
  const modal = document.getElementById('estimate-modal');
  const form = document.getElementById('estimate-form');
  if (!modal || !form || form.dataset.estimateReady) return;
  form.dataset.estimateReady = 'true';

  const byId = name => document.getElementById(`estimate-${name}`);
  const card = modal.querySelector('.estimate-card');
  const title = byId('title');
  const controls = byId('form-controls');
  const optional = byId('optional');
  const intentNote = byId('intent');
  const name = byId('name');
  const email = byId('email');
  const phone = byId('phone');
  const photo = byId('photo');
  const removePhoto = byId('remove-photo');
  const details = byId('details');
  const type = byId('project-type');
  const submit = form.querySelector('[type=submit]');
  const closeButton = byId('close');
  const sending = byId('sending');
  const success = byId('success');
  const failure = byId('failure');
  const advisorNote = byId('advisor-note');
  const maxPhotoBytes = 7 * 1024 * 1024;
  const acceptedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);
  const attributionFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'initial_landing_path', 'first_referrer', 'cta_origin_id', 'cta_origin_path', 'cta_latest_id', 'cta_latest_path'];
  const submitLabel = submit.textContent;
  const background = new Map();
  const drafts = new Map();
  const draftFields = ['name','email','phone','city','dimensions','timeline','project_note','project_type','lead_source','submission_id'];
  const intentByHash = new Map([['#estimate','estimate'],['#estimate-photo','photo'],['#estimate-commercial','commercial']]);
  let trigger = null;
  let pending = false;
  let accepted = false;
  let lane = null;

  function measure(callback) {
    try {
      return callback(window.StileAnalytics);
    } catch (_) {
      // Measurement is optional and cannot prevent an enquiry.
    }
  }

  function track(event, params = {}) {
    measure(analytics => analytics?.track(event, { cta_location: 'estimate_modal', lead_method: 'form', ...params }));
  }

  function showFieldError(group, message, fields) {
    const error = byId(`${group}-error`);
    if (error) {
      error.textContent = message;
      error.hidden = !message;
    }
    fields.forEach(field => field.setAttribute('aria-invalid', String(Boolean(message))));
  }

  function photoIssue(file) {
    if (!file) return '';
    if (!file.size) return 'This file is empty. Choose another photo or remove the attachment.';
    if (file.size > maxPhotoBytes) return 'Choose a photo up to 7 MB, or send your enquiry without it.';
    const unknownType = !file.type || file.type === 'application/octet-stream';
    if (!acceptedImageTypes.has(file.type) && !(unknownType && /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name))) {
      return 'Choose a JPG, PNG, WebP or HEIC photo, or send your enquiry without it.';
    }
    return '';
  }

  function resetReceipt() {
    if (!accepted) return;
    form.reset();
    // Updating a hidden input's value also changes its default value in browsers.
    form.elements.namedItem('submission_id').value = '';
    form.elements.namedItem('lead_source').value = 'website';
    if (optional) optional.open = false;
    accepted = false;
    submit.disabled = false;
    controls.hidden = false;
    success.hidden = true;
    success.classList.remove('is-visible');
    if (advisorNote) advisorNote.hidden = true;
    drafts.delete(lane);
    lane = null;
    updatePhoto(false);
  }

  function setFile(file) {
    photo.value = '';
    if (!file) return;
    try {
      const transfer = new DataTransfer();
      transfer.items.add(file);
      photo.files = transfer.files;
    } catch (_) { /* Browsers without file assignment can still attach manually. */ }
  }

  // Mode is intent, not attribution. Preserve each unsent draft in this page only;
  // never carry an inferred category, private note, file or receipt ID into the other lane.
  function enterLane(next) {
    if (pending || lane === next) return;
    if (lane) {
      drafts.set(lane, {
        values: draftFields.map(key => [key, form.elements.namedItem(key).value]),
        file: photo.files[0], expanded: optional?.open, advisor: advisorNote && !advisorNote.hidden
      });
    }
    const saved = drafts.get(next);
    form.reset();
    form.elements.namedItem('submission_id').value = '';
    form.elements.namedItem('lead_source').value = 'website';
    type.value = next === 'commercial' ? 'commercial' : 'general';
    if (saved) for (const [key, value] of saved.values) form.elements.namedItem(key).value = value;
    if (optional) optional.open = Boolean(saved?.expanded);
    if (advisorNote) advisorNote.hidden = !saved?.advisor;
    if (intentNote) intentNote.hidden = next !== 'commercial';
    setFile(saved?.file);
    failure.hidden = true;
    showFieldError('name', '', [name]);
    showFieldError('contact', '', [email, phone]);
    updatePhoto(false);
    lane = next;
  }

  function focusWhenReady(element) {
    const previous = document.activeElement;
    element.focus();
    // Safari can defer making newly unhidden content focusable until layout.
    if (document.activeElement !== element && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(() => {
        if (modal.classList.contains('is-open') &&
            (document.activeElement === previous || !modal.contains(document.activeElement))) element.focus();
      });
    }
  }

  function open(from, mode = 'estimate') {
    if (modal.classList.contains('is-open')) return;
    resetReceipt();
    trigger = from instanceof HTMLElement ? from : document.activeElement;
    enterLane(mode === 'commercial' ? 'commercial' : 'estimate');
    modal.inert = false;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('estimate-lock');
    // Keep the existing modal contract with Finish Advisor and the Leo controller.
    let current = modal;
    while (current.parentElement) {
      for (const sibling of current.parentElement.children) {
        if (sibling === current || /^(SCRIPT|STYLE|LINK)$/.test(sibling.tagName)) continue;
        background.set(sibling, sibling.inert);
        sibling.inert = true;
      }
      if (current.parentElement === document.body) break;
      current = current.parentElement;
    }
    card.setAttribute('aria-labelledby', title.id);
    if (mode === 'photo' && optional) optional.open = true;
    focusWhenReady(mode === 'photo' ? photo : title);
    measure(analytics => analytics?.trackFormOpen(from instanceof HTMLElement ? from : undefined));
  }

  function close() {
    if (pending || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.inert = true;
    document.body.classList.remove('estimate-lock');
    for (const [element, wasInert] of background) element.inert = wasInert;
    background.clear();
    if (trigger?.isConnected && trigger !== document.body) trigger.focus({ preventScroll: true });
  }

  function updatePhoto(reportSelection = false) {
    const file = photo.files[0];
    const message = photoIssue(file);
    const label = byId('file-label');
    if (label) label.textContent = file ? 'Photo selected' : 'JPG, PNG, WebP or HEIC up to 7 MB';
    if (removePhoto) removePhoto.hidden = !file;
    showFieldError('photo', message, [photo]);
    if (file && !message && reportSelection) track('contact_form_photo_selected');
  }

  function checkFields() {
    name.value = name.value.trim();
    email.value = email.value.trim();
    phone.value = phone.value.trim();
    const nameError = name.value.length < 1 || name.value.length > 120 ? 'Enter your name (up to 120 characters).' : '';
    const digits = phone.value.replace(/\D/g, '').length;
    const badPhone = phone.value && (!/^\+?[\d\s().-]+$/.test(phone.value) || digits < 7 || digits > 15);
    const badEmail = email.value && (!email.validity.valid || email.value.length > 254);
    let contactError = '';
    if (!email.value && !phone.value) contactError = 'Enter either an email address or phone number so we can reply.';
    else if (badEmail) contactError = 'Check your email address or leave it blank and use your phone number.';
    else if (badPhone) contactError = 'Check your phone number or leave it blank and use your email address.';
    const attachmentError = photoIssue(photo.files[0]);
    showFieldError('name', nameError, [name]);
    const affected = badEmail ? [email] : badPhone ? [phone] : [email, phone];
    showFieldError('contact', contactError, [email, phone]);
    if (contactError) [email, phone].filter(field => !affected.includes(field)).forEach(field => field.setAttribute('aria-invalid', 'false'));
    showFieldError('photo', attachmentError, [photo]);
    if (nameError) return name;
    if (contactError) return affected[0];
    if (attachmentError) return photo;
    return null;
  }

  async function send(event) {
    event.preventDefault();
    if (pending || accepted) return;
    failure.hidden = true;
    const invalid = checkFields();
    if (invalid) {
      track('contact_form_error');
      if (invalid === photo && optional) optional.open = true;
      focusWhenReady(invalid);
      return;
    }
    const context = measure(analytics => analytics?.getInquiryContext()) || {};
    const payload = new FormData(form);
    for (const key of attributionFields) payload.set(key, context[key] || '');
    const file = photo.files[0];
    payload.set('wall_photo_filename', file?.name || '');
    if (!file) payload.delete('wall_photo');
    // Keep one non-personal transaction identifier on manual retries.
    const submissionId = form.elements.namedItem('submission_id');
    if (!submissionId.value) {
      submissionId.value = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() :
        Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('');
    }
    const transactionId = submissionId.value;
    payload.set('submission_id', transactionId);
    const service = payload.get('project_type') || 'general';
    pending = true;
    submit.disabled = true;
    closeButton.disabled = true;
    controls.inert = true;
    submit.textContent = 'Sending…';
    if (sending) {
      sending.hidden = false;
      focusWhenReady(sending);
    }
    form.setAttribute('aria-busy', 'true');
    track('contact_form_submit_attempt', { service, transaction_id: transactionId });
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30000);
    let resultTarget;
    try {
      const options = { method: 'POST', redirect: 'error', signal: controller.signal };
      if (file) options.body = payload;
      else {
        options.body = new URLSearchParams(payload);
        options.headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' };
      }
      const response = await fetch('/', options);
      if (file && response.status === 400 && typeof response.json === 'function') {
        const rejected = await response.json().catch(() => null);
        if (rejected?.code === 'invalid_photo') {
          if (optional) optional.open = true;
          showFieldError('photo', 'This photo could not be accepted. Replace it or remove it to continue.', [photo]);
          track('contact_form_error');
          resultTarget = photo;
          return;
        }
      }
      if (!response.ok || response.headers.get('X-Stile-Estimate-Receipt') !== 'http_accepted') throw new Error('Unconfirmed enquiry');
      accepted = true;
      controls.hidden = true;
      success.hidden = false;
      success.classList.add('is-visible');
      card.setAttribute('aria-labelledby', success.id);
      resultTarget = success;
      measure(analytics => analytics?.trackLeadSuccess({ accepted: true, cta_location: 'estimate_modal', service, transaction_id: transactionId }));
    } catch (_) {
      failure.hidden = false;
      track('contact_form_error');
      resultTarget = failure;
    } finally {
      window.clearTimeout(timeout);
      pending = false;
      closeButton.disabled = false;
      controls.inert = false;
      if (sending) sending.hidden = true;
      form.removeAttribute('aria-busy');
      submit.disabled = accepted;
      submit.textContent = submitLabel;
      if (resultTarget && modal.classList.contains('is-open')) focusWhenReady(resultTarget);
    }
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('[data-estimate], [data-photo-intake], a[href="#estimate"], a[href="/#estimate"], a[href="#estimate-photo"], a[href="/#estimate-photo"], a[href="#estimate-commercial"], a[href="/#estimate-commercial"]');
    if (!link || modal.contains(link)) return;
    event.preventDefault();
    const mode = link.dataset.estimateType === 'commercial' ? 'commercial' : link.hasAttribute('data-photo-intake') ? 'photo' :
      intentByHash.get(link.getAttribute('href')?.replace(/^\//, '')) || 'estimate';
    open(link, mode);
  });
  closeButton.addEventListener('click', close);
  modal.addEventListener('click', event => { if (event.target === modal) close(); });
  document.addEventListener('keydown', event => {
    if (!modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'Tab') {
      const focusable = Array.from(modal.querySelectorAll('button, a[href], input, select, textarea, summary, [tabindex="0"]'))
        .filter(element => !element.disabled && element.type !== 'hidden' && element.tabIndex >= 0 && element.getClientRects().length > 0 &&
          !element.closest('[inert]') &&
          (!element.closest('details:not([open])') || element.tagName === 'SUMMARY'));
      if (pending && !focusable.length) { event.preventDefault(); return; }
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && last && (document.activeElement === first || !focusable.includes(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && first && (document.activeElement === last || !focusable.includes(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  photo.addEventListener('change', () => updatePhoto(true));
  removePhoto?.addEventListener('click', () => {
    setFile();
    updatePhoto(false);
    focusWhenReady(photo);
  });
  name.addEventListener('input', () => showFieldError('name', '', [name]));
  for (const field of [email, phone]) field.addEventListener('input', () => showFieldError('contact', '', [email, phone]));
  form.addEventListener('submit', send);

  function applyAdvisorHandoff(detail) {
    if (pending || !detail || typeof detail.summary !== 'string') return;
    open();
    if (optional) optional.open = true;
    if (!details.value.includes(detail.summary)) details.value = [details.value, detail.summary].filter(Boolean).join('\n').slice(0, 2000);
    form.elements.namedItem('lead_source').value = 'finish_advisor';
    if (advisorNote) advisorNote.hidden = false;
    if (!photo.files.length && detail.imageFile instanceof File && !photoIssue(detail.imageFile)) {
      setFile(detail.imageFile);
      if (photo.files.length) photo.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
  document.addEventListener('stile:advisor-handoff', event => applyAdvisorHandoff(event.detail));
  function openHash() {
    const mode = intentByHash.get(location.hash);
    if (!mode) return;
    open(undefined, mode);
    // Initial fragment navigation can replace deferred-script focus with the
    // (now inert) page anchor. Restore it after navigation, without stealing it
    // if a visitor has already started using the dialog.
    const restoreHashFocus = () => window.setTimeout(() => {
      if (modal.classList.contains('is-open') && !modal.contains(document.activeElement)) focusWhenReady(mode === 'photo' ? photo : title);
    }, 0);
    if (document.readyState === 'complete') restoreHashFocus();
    else window.addEventListener('load', restoreHashFocus, { once: true });
    if (mode !== 'estimate') return;
    try {
      const handoff = JSON.parse(sessionStorage.getItem('stile_advisor_handoff_v1'));
      sessionStorage.removeItem('stile_advisor_handoff_v1');
      const age = Date.now() - handoff?.time;
      if (age >= 0 && age < 10 * 60 * 1000) applyAdvisorHandoff(handoff);
    } catch (_) { /* The form works without session storage. */ }
  }
  window.addEventListener('hashchange', openHash);
  openHash();
})();
