const teams = [
    { prefix: 'MEX', iso: 'mx', count: 20 },
    { prefix: 'RSA', iso: 'za', count: 20 },
    { prefix: 'KOR', iso: 'kr', count: 20 },
    { prefix: 'CZE', iso: 'cz', count: 20 },
    { prefix: 'CAN', iso: 'ca', count: 20 },
    { prefix: 'BIH', iso: 'ba', count: 20 },
    { prefix: 'QAT', iso: 'qa', count: 20 },
    { prefix: 'SUI', iso: 'ch', count: 20 },
    { prefix: 'BRA', iso: 'br', count: 20 },
    { prefix: 'MAR', iso: 'ma', count: 20 },
    { prefix: 'HAI', iso: 'ht', count: 20 },
    { prefix: 'SCO', iso: 'gb-sct', count: 20, padTo: 2 },
    { prefix: 'USA', iso: 'us', count: 20 },
    { prefix: 'PAR', iso: 'py', count: 20 },
    { prefix: 'AUS', iso: 'au', count: 20 },
    { prefix: 'TUR', iso: 'tr', count: 20 },
    { prefix: 'GER', iso: 'de', count: 20 },
    { prefix: 'CUW', iso: 'cw', count: 20 },
    { prefix: 'CIV', iso: 'ci', count: 20 },
    { prefix: 'ECU', iso: 'ec', count: 20 },
    { prefix: 'NED', iso: 'nl', count: 20 },
    { prefix: 'JPN', iso: 'jp', count: 20 },
    { prefix: 'SWE', iso: 'se', count: 20 },
    { prefix: 'TUN', iso: 'tn', count: 20 },
    { prefix: 'BEL', iso: 'be', count: 20 },
    { prefix: 'EGY', iso: 'eg', count: 20 },
    { prefix: 'IRN', iso: 'ir', count: 20 },
    { prefix: 'NZL', iso: 'nz', count: 20 },
    { prefix: 'ESP', iso: 'es', count: 20 },
    { prefix: 'CPV', iso: 'cv', count: 20 },
    { prefix: 'KSA', iso: 'sa', count: 20 },
    { prefix: 'URU', iso: 'uy', count: 20 },
    { prefix: 'FRA', iso: 'fr', count: 20 },
    { prefix: 'SEN', iso: 'sn', count: 20 },
    { prefix: 'IRQ', iso: 'iq', count: 20 },
    { prefix: 'NOR', iso: 'no', count: 20 },
    { prefix: 'ARG', iso: 'ar', count: 20 },
    { prefix: 'ALG', iso: 'dz', count: 20 },
    { prefix: 'AUT', iso: 'at', count: 20 },
    { prefix: 'JOR', iso: 'jo', count: 20 },
    { prefix: 'POR', iso: 'pt', count: 20 },
    { prefix: 'COD', iso: 'cd', count: 20, padTo: 2 },
    { prefix: 'UZB', iso: 'uz', count: 20 },
    { prefix: 'COL', iso: 'co', count: 20 },
    { prefix: 'ENG', iso: 'gb-eng', count: 20 },
    { prefix: 'CRO', iso: 'hr', count: 20, padTo: 2 },
    { prefix: 'GHA', iso: 'gh', count: 20 },
    { prefix: 'PAN', iso: 'pa', count: 20 },
  ];

  // Línea especial única: 00, FWC1..FWC19 (al final)
  const specialRows = {
    fwc: { label: 'FWC', codes: ['00', ...Array.from({length: 19}, (_, i) => 'FWC' + (i+1))] },
  };

  const STORAGE_KEY = 'copa2026_laminas_v1';
  const DUP_STORAGE_KEY = 'copa2026_laminas_dup_v1';
  let owned = new Set();
  let dups = {}; 

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) owned = new Set(JSON.parse(raw));
    } catch(e) { console.warn('Falla leyendo localStorage', e); }
    try {
      const rawD = localStorage.getItem(DUP_STORAGE_KEY);
      if (rawD) {
        const obj = JSON.parse(rawD);
        if (obj && typeof obj === 'object') dups = obj;
      }
    } catch(e) { console.warn('Falha ao ler dups', e); }

    // Limpia códigos obsoletos (CC*, '00', FWC>20)
    const valid = new Set(allValidCodes());
    for (const code of [...owned]) if (!valid.has(code)) owned.delete(code);
    for (const code of Object.keys(dups)) if (!valid.has(code)) delete dups[code];
  }

  function allValidCodes() {
    const list = [];
    for (const t of teams) list.push(...buildCodes(t));
    list.push(...specialRows.fwc.codes);
    return list;
  }
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...owned]));
      localStorage.setItem(DUP_STORAGE_KEY, JSON.stringify(dups));
    } catch(e) { console.warn('Falla al guardar localStorage', e); }
  }

  function pad(n, width) {
    const s = String(n);
    return width && s.length < width ? '0'.repeat(width - s.length) + s : s;
  }

  function buildCodes(team) {
    const out = [];
    for (let i = 1; i <= team.count; i++) {
      out.push(team.prefix + (team.padTo ? pad(i, team.padTo) : i));
    }
    return out;
  }

  function flagCellHTML(team) {
    if (team.iso) {
      return `<td class="flag-cell"><img src="https://flagcdn.com/w40/${team.iso}.png" alt="${team.prefix}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'placeholder',textContent:'${team.prefix}'}))"></td>`;
    }
    return `<td class="flag-cell"><div class="placeholder">${team.prefix}</div></td>`;
  }

  function specialFlagCellHTML(label) {
    return `<td class="flag-cell"><div class="placeholder">${label}</div></td>`;
  }

  function rowHTML(flagHTML, codes) {
    const cells = codes.map(code => cellHTML(code)).join('');
    return `<tr>${flagHTML}${cells}</tr>`;
  }

  function cellHTML(code) {
    const got = owned.has(code) ? ' got' : '';
    const qty = dups[code] || 0;
    const hasDup = qty > 0 ? ' has-dup' : '';
    const badge = qty > 0 ? `<span class="dup-badge">${qty}</span>` : '';
    return `<td class="code${got}${hasDup}" data-code="${code}">${code}${badge}</td>`;
  }

  function specialHeaderRow(codes) {
    const cells = codes.map((code, i) => {
      if (i === 0) return ''; // handled outside
      return `<td class="code${owned.has(code) ? ' got' : ''}" data-code="${code}">${code}</td>`;
    });
    return cells;
  }

  function render() {
    const table = document.getElementById('tabela');
    const parts = [];

    for (const team of teams) {
      parts.push(rowHTML(flagCellHTML(team), buildCodes(team)));
    }

    // FWC final (FWC1..FWC20)
    {
      const codes = specialRows.fwc.codes;
      const cells = codes.map(c => cellHTML(c)).join('');
      parts.push(`<tr>${specialFlagCellHTML('FWC')}${cells}</tr>`);
    }

    table.innerHTML = parts.join('');
    updateStat();
  }

  function totalCodes() {
    let total = specialRows.fwc.codes.length;
    for (const t of teams) total += t.count;
    return total;
  }

  function updateStat() {
    const total = totalCodes();
    document.getElementById('stat').textContent = `Obtenidas: ${owned.size} / ${total}`;
    const dupTotal = Object.values(dups).reduce((a, b) => a + b, 0);
    const dupEl = document.getElementById('dupStat');
    if (dupEl) dupEl.textContent = `Repetidas: ${dupTotal}`;
    const pct = total > 0 ? (owned.size / total) * 100 : 0;
    const fill = document.getElementById('progressFill');
    const lbl = document.getElementById('progressLabel');
    if (fill) fill.style.width = pct.toFixed(1) + '%';
    if (lbl) lbl.textContent = pct.toFixed(1) + '%';
  }

  // ===== Toast =====
  let toastTimer = null;
  function showToast(msg, type) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.classList.remove('show'); }, 2200);
  }

  function updateCellBadge(code) {
    const td = document.querySelector(`td.code[data-code="${code}"]`);
    if (!td) return;
    const existing = td.querySelector('.dup-badge');
    const qty = dups[code] || 0;
    if (qty > 0) {
      td.classList.add('has-dup');
      if (existing) existing.textContent = qty;
      else {
        const span = document.createElement('span');
        span.className = 'dup-badge';
        span.textContent = qty;
        td.appendChild(span);
      }
    } else {
      td.classList.remove('has-dup');
      if (existing) existing.remove();
    }
  }

  function changeDup(code, delta) {
    if (!owned.has(code)) return; // solo permite repetidas si ya tiene la lamina
    const cur = dups[code] || 0;
    const next = Math.max(0, cur + delta);
    if (next === 0) delete dups[code];
    else dups[code] = next;
    updateCellBadge(code);
    saveState();
    updateStat();
  }

  let mode = 'collection'; 
  function setMode(newMode) {
    mode = newMode;
    document.body.classList.toggle('mode-dup', mode === 'dup');
    document.getElementById('tabCollection').classList.toggle('active', mode === 'collection');
    document.getElementById('tabDup').classList.toggle('active', mode === 'dup');
    document.getElementById('tabCollection').setAttribute('aria-selected', mode === 'collection');
    document.getElementById('tabDup').setAttribute('aria-selected', mode === 'dup');
    document.getElementById('tabInfoCollection').style.display = mode === 'collection' ? 'block' : 'none';
    document.getElementById('tabInfoDup').style.display = mode === 'dup' ? 'block' : 'none';
  }
  document.getElementById('tabCollection').addEventListener('click', () => setMode('collection'));
  document.getElementById('tabDup').addEventListener('click', () => setMode('dup'));

  document.addEventListener('click', (e) => {
    const td = e.target.closest('td.code');
    if (!td) return;
    if (suppressNextClick) { suppressNextClick = false; return; }
    const code = td.dataset.code;
    if (mode === 'collection') {
      if (owned.has(code)) {
        owned.delete(code);
        td.classList.remove('got');
        if (dups[code]) {
          delete dups[code];
          updateCellBadge(code);
        }
      } else {
        owned.add(code);
        td.classList.add('got');
      }
      saveState();
      updateStat();
    } else {
      // modo repetidas
      if (!owned.has(code)) {
        showToast('Marque como obtenida antes de adicionar repetida', 'error');
        return;
      }
      changeDup(code, 1);
    }
  });

  document.addEventListener('contextmenu', (e) => {
    const td = e.target.closest('td.code');
    if (!td) return;
    if (mode !== 'dup') return; 
    e.preventDefault();
    const code = td.dataset.code;
    if (!owned.has(code)) return;
    changeDup(code, -1);
  });

  // ===== mobile para -1 repetida =====
  let longPressTimer = null;
  let longPressTarget = null;
  let suppressNextClick = false;
  const LONG_PRESS_MS = 500;

  function clearLongPress() {
    if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
    longPressTarget = null;
  }

  document.addEventListener('touchstart', (e) => {
    if (mode !== 'dup') return;
    const td = e.target.closest('td.code');
    if (!td) return;
    const code = td.dataset.code;
    if (!owned.has(code)) return;
    longPressTarget = td;
    longPressTimer = setTimeout(() => {
      changeDup(code, -1);
      suppressNextClick = true;
      if (navigator.vibrate) navigator.vibrate(40);
      longPressTimer = null;
    }, LONG_PRESS_MS);
  }, { passive: true });
  document.addEventListener('touchend', clearLongPress, { passive: true });
  document.addEventListener('touchmove', clearLongPress, { passive: true });
  document.addEventListener('touchcancel', clearLongPress, { passive: true });

  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!confirm('Tem certeza que deseja apagar TODAS as marcações (obtidas e repetidas)?')) return;
    owned.clear();
    dups = {};
    saveState();
    render();
  });

  document.getElementById('exportBtn').addEventListener('click', () => {
    const data = JSON.stringify({ owned: [...owned], dups }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'laminas-copa-2026.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (Array.isArray(parsed)) {
          owned = new Set(parsed.filter(x => typeof x === 'string'));
          dups = {};
        } else if (parsed && typeof parsed === 'object') {
          owned = new Set((parsed.owned || []).filter(x => typeof x === 'string'));
          dups = {};
          if (parsed.dups && typeof parsed.dups === 'object') {
            for (const [k, v] of Object.entries(parsed.dups)) {
              const n = parseInt(v, 10);
              if (typeof k === 'string' && Number.isFinite(n) && n > 0) dups[k] = n;
            }
          }
        } else {
          throw new Error('Formato inválido');
        }
        saveState();
        render();
        showToast('Importado com sucesso!', 'success');
      } catch (err) {
        showToast('Arquivo inválido: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  loadState();
  render();
  setMode('collection');

  // ===== boton copiar lista de repetidas =====
  document.getElementById('copyDupBtn').addEventListener('click', async () => {
    const entries = Object.entries(dups).sort((a, b) => a[0].localeCompare(b[0], 'pt-BR', { numeric: true }));
    if (entries.length === 0) { showToast('Você ainda não tem repetidas', 'error'); return; }
    const text = entries.map(([c, q]) => `${c} (x${q})`).join(', ');
    try {
      await navigator.clipboard.writeText(text);
      showToast('Lista de repetidas copiada!', 'success');
    } catch {
      prompt('Copie a lista abaixo:', text);
    }
  });

  const copyBtn = document.getElementById('copyPix');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const key = document.getElementById('pixKey').textContent.trim();
      try {
        await navigator.clipboard.writeText(key);
        showToast('Chave PIX copiada!', 'success');
      } catch {
        showToast('Não foi possível copiar', 'error');
      }
    });
  }