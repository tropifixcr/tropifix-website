// Turns the static request form into 5 steps: validation per step, photo
// compression, submission to Netlify Forms, the thank-you state and the
// WhatsApp hand-off. All visible text lives in the HTML, not here.

const MAX_PHOTOS = 5;
const MAX_SIDE = 1600; // px, longest side after compression
const QUALITY = 0.8;

const root = document.querySelector<HTMLElement>('.rf');
const form = root?.querySelector<HTMLFormElement>('.rf__form');
if (root && form) init(root, form);

function init(root: HTMLElement, form: HTMLFormElement) {
  const $ = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const steps = [...form.querySelectorAll<HTMLElement>('.rf__step')];
  const back = $<HTMLButtonElement>('.rf__back');
  const next = $<HTMLButtonElement>('.rf__next');
  const submit = $<HTMLButtonElement>('.rf__submit');
  const stepLabel = $('.rf__step-label');
  const bar = $('.rf__bar span');
  const zone = $<HTMLSelectElement>('#rf-zone');
  const townSelect = $<HTMLSelectElement>('#rf-town-select');
  const town = $<HTMLInputElement>('#rf-town');
  const liveZones = (form.dataset.liveZones || '').split(',');
  const labels = JSON.parse(form.dataset.summary || '{}') as Record<string, string>;
  const photos: File[] = [];
  let current = 0;
  let started = false;

  // ?test=1 marks the request as a test: [TEST] email subject, no analytics.
  const isTest = new URLSearchParams(location.search).has('test');
  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement;
  if (isTest) field('test').value = '1';

  const track = (event: string, params: Record<string, unknown> = {}) => {
    if (isTest) return;
    window.tfTrack(event, params);
  };

  // --- Steps -------------------------------------------------------------
  form.noValidate = true;
  form.classList.add('is-stepped');
  $('.rf__progress').hidden = false;
  $('.rf__photos').hidden = false;

  const show = (index: number, focus = true) => {
    form.classList.toggle('is-back', index < current);
    current = index;
    steps.forEach((s, i) => s.classList.toggle('is-active', i === index));
    back.hidden = index === 0;
    next.hidden = index === steps.length - 1;
    submit.hidden = !next.hidden;
    const title = steps[index].querySelector('legend')!.textContent;
    stepLabel.textContent = `${form.dataset.stepLabel!.replace('{n}', String(index + 1))}: ${title}`;
    bar.style.transform = `scaleX(${(index + 1) / steps.length})`;
    if (focus) root.scrollIntoView({ block: 'start' });
  };

  // --- Validation --------------------------------------------------------
  const setError = (wrapper: Element, control: HTMLElement | null, invalid: boolean) => {
    const error = wrapper.querySelector<HTMLElement>('.rf__error');
    if (!error) return;
    error.hidden = !invalid;
    error.toggleAttribute('role', false);
    if (invalid) error.setAttribute('role', 'alert');
    control?.setAttribute('aria-invalid', String(invalid));
  };

  const isValid = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
    const value = el.value.trim();
    if (el.name === 'phone') return /^\d{6,15}$/.test(value.replace(/[\s().-]/g, ''));
    if (el.type === 'checkbox') return (el as HTMLInputElement).checked;
    if (el.type === 'email') return value === '' || /^\S+@\S+\.\S+$/.test(value);
    return !el.required || value !== '';
  };

  /** Validates one step, shows its errors and returns the first invalid control. */
  const validate = (step: HTMLElement): HTMLElement | null => {
    let first: HTMLElement | null = null;
    step.querySelectorAll<HTMLElement>('[data-required]').forEach((group) => {
      const radios = [...group.querySelectorAll<HTMLInputElement>('input[type=radio]')];
      const invalid = !radios.some((r) => r.checked);
      setError(group, null, invalid);
      if (invalid) first ||= radios[0];
    });
    step.querySelectorAll<HTMLInputElement>('.rf__field :is(input, select, textarea)[name]').forEach((el) => {
      if (el.type === 'file') return;
      const invalid = !isValid(el);
      setError(el.closest('.rf__field')!, el, invalid);
      if (invalid) first ||= el.closest<HTMLElement>('[hidden]') ? townSelect : el;
    });
    return first;
  };

  next.addEventListener('click', () => {
    const invalid = validate(steps[current]);
    if (invalid) return invalid.focus();
    track('form_step_completed', { step: current + 1 });
    show(current + 1);
  });
  back.addEventListener('click', () => show(current - 1));
  form.addEventListener('input', () => {
    if (!started) track('form_started');
    started = true;
  });

  // --- Zone and town -----------------------------------------------------
  // Zone 1 shows the list of beaches and towns; "Other" and the other zones show a text field.
  const syncTown = () => {
    const listed = liveZones.includes(zone.value);
    const typed = !listed || townSelect.value === 'other';
    root.querySelector<HTMLElement>('[data-town-select]')!.hidden = !listed;
    root.querySelector<HTMLElement>('[data-town-text]')!.hidden = !typed;
    if (!typed) town.value = townSelect.value;
  };
  zone.addEventListener('change', () => { town.value = ''; townSelect.value = ''; syncTown(); });
  townSelect.addEventListener('change', () => { town.value = ''; syncTown(); });
  syncTown();

  // --- Photos ------------------------------------------------------------
  const picker = $<HTMLInputElement>('#rf-photo-picker');
  const thumbs = $<HTMLUListElement>('.rf__thumbs');
  const renderThumbs = () => {
    thumbs.replaceChildren(
      ...photos.map((file, i) => {
        const li = document.createElement('li');
        const img = Object.assign(document.createElement('img'), { src: URL.createObjectURL(file), alt: '' });
        const remove = Object.assign(document.createElement('button'), { type: 'button', textContent: thumbs.dataset.removeLabel });
        remove.setAttribute('aria-label', `${thumbs.dataset.removeLabel} ${i + 1}`);
        remove.addEventListener('click', () => { photos.splice(i, 1); renderThumbs(); });
        li.append(img, remove);
        return li;
      }),
    );
    picker.closest('label')!.hidden = photos.length >= MAX_PHOTOS;
  };
  picker.addEventListener('change', async () => {
    const wrapper = picker.closest('.rf__field')!;
    setError(wrapper, null, false);
    for (const file of [...picker.files!].slice(0, MAX_PHOTOS - photos.length)) {
      try { photos.push(await compress(file)); } catch { setError(wrapper, null, true); }
    }
    picker.value = '';
    renderThumbs();
  });

  // --- Submit ------------------------------------------------------------
  const chosen = (name: string) => {
    const input = form.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
    return input?.closest('label')?.textContent?.trim() || '';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Enter in a text field submits the form: treat it as "Next" until the last step.
    if (current < steps.length - 1) return next.click();
    const invalid = validate(steps[current]);
    if (invalid) return invalid.focus();

    const data = new FormData(form);
    const name = String(data.get('name')).trim();
    const service = chosen('service');
    const zoneName = zone.selectedOptions[0].text;
    data.set('subject', `${isTest ? '[TEST] ' : ''}${labels.subject}: ${service}, ${town.value}`);
    for (let i = 1; i <= MAX_PHOTOS; i++) {
      const photo = photos[i - 1];
      if (photo) data.set(`photo${i}`, photo, photo.name);
      else data.delete(`photo${i}`);
    }

    const sendError = $('.rf__send-error');
    const submitText = submit.textContent;
    sendError.hidden = true;
    submit.disabled = true;
    submit.textContent = form.dataset.sending!;
    try {
      // A filled honeypot means a bot: show the thank-you state but send nothing.
      if (!data.get('bot-field')) {
        const res = await fetch(form.action, { method: 'POST', body: data });
        if (!res.ok) throw new Error(String(res.status));
      }
    } catch {
      sendError.hidden = false;
      submit.disabled = false;
      submit.textContent = submitText;
      return;
    }
    track('form_step_completed', { step: steps.length });
    track('form_submitted', { service: data.get('service'), zone: zone.value });

    // Thank-you state, honest to the zone.
    const thanks = $('.rf__thanks');
    const heading = thanks.querySelector('h2')!;
    heading.textContent = heading.dataset.template!.replace('{name}', name);
    const live = liveZones.includes(zone.value);
    thanks.querySelector<HTMLElement>('[data-thanks=live]')!.hidden = !live;
    thanks.querySelector<HTMLElement>('[data-thanks=other]')!.hidden = live;

    const summary = [
      labels.intro,
      `${labels.service}: ${service}`,
      `${labels.zone}: ${zoneName}`,
      `${labels.town}: ${town.value}`,
      `${labels.urgency}: ${chosen('urgency')}`,
      `${labels.budget}: ${chosen('budget')}`,
      `${labels.name}: ${name}`,
      `${labels.description}: ${String(data.get('description')).trim().slice(0, 300)}`,
    ].join('\n');
    const wa = thanks.querySelector<HTMLAnchorElement>('.rf__wa')!;
    wa.href = `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(summary)}`;
    wa.addEventListener('click', () => track('whatsapp_click', { from: 'thank_you' }));

    form.hidden = true;
    thanks.hidden = false;
    thanks.focus();
    root.scrollIntoView({ block: 'start' });
  });

  // On a service page the service is already chosen, so start on the second step.
  show(form.querySelector('input[name=service]:checked') ? 1 : 0, false);
}

/**
 * Shrinks a photo to MAX_SIDE and re-encodes it as WebP. Safari cannot encode
 * WebP from a canvas and silently returns PNG, so it falls back to JPEG there.
 */
async function compress(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const encode = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, QUALITY));
  let blob = await encode('image/webp');
  if (blob?.type !== 'image/webp') blob = await encode('image/jpeg');
  if (!blob) throw new Error('encode failed');
  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
  return new File([blob], file.name.replace(/\.[^.]+$/, '') + `.${ext}`, { type: blob.type });
}
