// ── AUTH ──────────────────────────────────────────────────────────────
function getUsuario() { return JSON.parse(localStorage.getItem('om_usuario') || 'null'); }
function setUsuario(u) { localStorage.setItem('om_usuario', JSON.stringify(u)); }
function logout() { localStorage.removeItem('om_usuario'); window.location.href = '../login.html'; }
function requireAuth() { if (!getUsuario()) { window.location.href = '../login.html'; } }

// ── TEMA ──────────────────────────────────────────────────────────────
function getTheme() { return localStorage.getItem('om_tema') || 'default'; }
function setTheme(t) {
  localStorage.setItem('om_tema', t);
  if (t === 'glass') {
    document.body.classList.add('theme-glass');
  } else {
    document.body.classList.remove('theme-glass');
  }
}
function applyStoredTheme() {
  if (getTheme() === 'glass') document.body.classList.add('theme-glass');
}
function toggleTheme() {
  setTheme(getTheme() === 'glass' ? 'default' : 'glass');
  renderThemeToggle();
}
function renderThemeToggle() {
  var el = document.getElementById('theme-toggle');
  if (!el) return;
  var isGlass = getTheme() === 'glass';
  el.innerHTML = '<button onclick="toggleTheme()" title="Alternar tema" style="' +
    'display:flex;align-items:center;gap:8px;background:' + (isGlass ? 'rgba(255,255,255,0.15)' : '#f0f0f0') + ';' +
    'border:none;border-radius:999px;padding:6px 14px;cursor:pointer;font-size:12px;font-weight:700;' +
    'color:' + (isGlass ? '#fff' : '#1E3A5F') + ';transition:all .2s">' +
    '<span style="width:32px;height:18px;background:' + (isGlass ? 'linear-gradient(90deg,#9B59B6,#4ECDC4)' : '#ddd') + ';border-radius:999px;position:relative;display:inline-block;transition:all .3s">' +
    '<span style="position:absolute;top:2px;' + (isGlass ? 'right:2px;background:#fff' : 'left:2px;background:#fff') + ';width:14px;height:14px;border-radius:50%;transition:all .3s;box-shadow:0 1px 4px rgba(0,0,0,.2)"></span>' +
    '</span>' +
    (isGlass ? '&#10022; Glass' : '&#9728; Padrão') +
    '</button>';
}

// ── EMPRESA ───────────────────────────────────────────────────────────
function getEmpresa() {
  const u = getUsuario();
  const key = 'om_empresa_' + (u ? u.id : '0');
  return JSON.parse(localStorage.getItem(key) || '{}');
}
function setEmpresa(e) {
  const u = getUsuario();
  const key = 'om_empresa_' + (u ? u.id : '0');
  localStorage.setItem(key, JSON.stringify(e));
}

// ── ORCAMENTOS ────────────────────────────────────────────────────────
function getOrcamentos() {
  const u = getUsuario();
  const key = 'om_orcamentos_' + (u ? u.id : '0');
  return JSON.parse(localStorage.getItem(key) || '[]');
}
function setOrcamentos(list) {
  const u = getUsuario();
  const key = 'om_orcamentos_' + (u ? u.id : '0');
  localStorage.setItem(key, JSON.stringify(list));
}
function saveOrcamento(orc) {
  const list = getOrcamentos();
  const idx = list.findIndex(o => o.id === orc.id);
  if (idx >= 0) list[idx] = orc;
  else list.unshift(orc);
  setOrcamentos(list);
}
function deleteOrcamento(id) {
  setOrcamentos(getOrcamentos().filter(o => o.id !== id));
}

// ── CATALOGO ──────────────────────────────────────────────────────────
function getCatalogo() {
  const u = getUsuario();
  const key = 'om_catalogo_' + (u ? u.id : '0');
  return JSON.parse(localStorage.getItem(key) || '[]');
}
function setCatalogo(list) {
  const u = getUsuario();
  const key = 'om_catalogo_' + (u ? u.id : '0');
  localStorage.setItem(key, JSON.stringify(list));
}

// ── UTILS ─────────────────────────────────────────────────────────────
function gerarId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

function formatBRL(val) {
  return Number(val || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseBRL(str) {
  return parseFloat((str || '0').toString().replace(/\./g, '').replace(',', '.')) || 0;
}

function proximoNumero() {
  const ano = new Date().getFullYear();
  const list = getOrcamentos();
  const deste_ano = list.filter(o => (o.numero || '').startsWith(String(ano)));
  return ano + '/' + String(deste_ano.length + 1).padStart(4, '0');
}

function hoje() {
  return new Date().toLocaleDateString('pt-BR');
}

function statusBadge(status) {
  var map = {
    'Em aberto':   'background:#FFF3E0;color:#E65100',
    'Aprovado':    'background:#E3F2FD;color:#1565C0',
    'Em produção': 'background:#FFF8E1;color:#F57F17',
    'Entregue':    'background:#E8F5E9;color:#2E7D32',
    'Atrasado':    'background:#FFEBEE;color:#C62828',
    'Recusado':    'background:#F5F5F5;color:#757575'
  };
  var style = map[status] || 'background:#F5F5F5;color:#757575';
  return '<span style="'+style+';padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600;white-space:nowrap">' + (status || 'Em aberto') + '</span>';
}

function renderSidebar(active) {
  var u = getUsuario();
  var emp = getEmpresa();
  var orcs = getOrcamentos();
  var pendentes = orcs.filter(function(o){ return o.status === 'Em aberto'; }).length;

  // Logo
  var logoHTML = emp.logo
    ? '<img src="'+emp.logo+'" style="width:36px;height:36px;border-radius:50%;object-fit:cover">'
    : '<div style="width:36px;height:36px;border-radius:50%;background:#1A1A1A;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:700">'+(emp.nome?emp.nome[0]:'M')+'</div>';

  // Avatar
  var nomeUser = (u && (u.nome || u.marmoraria)) || 'U';
  var avatarHTML = '<div style="width:36px;height:36px;border-radius:50%;background:#E8E8E8;display:flex;align-items:center;justify-content:center;color:#666;font-size:13px;font-weight:600">'+nomeUser[0].toUpperCase()+'</div>';

  function navItem(page, icon, label) {
    var isActive = active === page;
    var baseStyle = 'width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;margin:0 auto;';
    var style = isActive
      ? baseStyle + 'background:#1A1A1A;color:#fff'
      : baseStyle + 'background:transparent;color:#999';
    var hoverAttr = isActive ? '' : 'onmouseover="this.style.background=\'#F0F0F0\'" onmouseout="this.style.background=\'transparent\'"';
    return '<div class="nav-item-wrap" style="padding:3px 0;position:relative">'+
      '<a href="'+page+'.html" style="display:block;text-decoration:none">'+
        '<div style="'+style+'" '+hoverAttr+'>'+icon+'</div>'+
      '</a>'+
      '<div class="nav-tooltip">'+label+'</div>'+
    '</div>';
  }

  var S = 'width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  var icons = {
    dashboard:  '<svg xmlns="http://www.w3.org/2000/svg" '+S+'><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    orcamentos: '<svg xmlns="http://www.w3.org/2000/svg" '+S+'><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    financeiro: '<svg xmlns="http://www.w3.org/2000/svg" '+S+'><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    novo:       '<svg xmlns="http://www.w3.org/2000/svg" '+S+'><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
    colar:     '<svg xmlns="http://www.w3.org/2000/svg" '+S+'><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>',
    catalogo:   '<svg xmlns="http://www.w3.org/2000/svg" '+S+'><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
    config:     '<svg xmlns="http://www.w3.org/2000/svg" '+S+'><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    planos:     '<svg xmlns="http://www.w3.org/2000/svg" '+S+'><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
  };

  // Badge para financeiro
  var finBadge = pendentes > 0
    ? '<div style="position:relative;display:inline-block;width:100%"><a href="financeiro.html" title="Financeiro — '+pendentes+' pendentes" style="display:block;padding:4px 0;text-decoration:none"><div style="width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;'+(active==='financeiro'?'background:#1A1A1A;color:#fff':'background:transparent;color:#999')+';margin:0 auto">'+icons.financeiro+'</div></a><span style="position:absolute;top:2px;right:14px;background:#FF6B35;color:#fff;border-radius:50%;width:16px;height:16px;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center">'+pendentes+'</span></div>'
    : navItem('financeiro', icons.financeiro, 'Financeiro');

  return '<aside style="width:68px;background:#F8F8F8;border-right:1px solid #F0F0F0;display:flex;flex-direction:column;align-items:center;padding:16px 0;min-height:100vh;position:sticky;top:0;height:100vh">'+
    '<div style="margin-bottom:20px">'+logoHTML+'</div>'+
    '<div style="width:32px;height:1px;background:#F0F0F0;margin-bottom:16px"></div>'+
    '<nav style="flex:1;display:flex;flex-direction:column;gap:4px;width:100%;padding:0 8px">'+
      navItem('dashboard',  icons.dashboard,  'Dashboard')  +
      navItem('orcamentos', icons.orcamentos, 'Orçamentos') +
      finBadge +
      navItem('novo-orcamento', icons.novo, 'Novo Orçamento') +
      navItem('catalogo',   icons.catalogo,   'Catálogo')   +
      navItem('configuracoes', icons.config,  'Configurações') +
      navItem('planos',     icons.planos,     'Planos')     +
    '</nav>'+
    '<div style="display:flex;flex-direction:column;align-items:center;gap:8px;margin-top:auto;padding-top:16px">'+
      '<div id="theme-toggle"></div>'+
      '<a href="../login.html" onclick="logout();return false;" title="Sair" style="display:flex;align-items:center;justify-content:center;text-decoration:none;opacity:.5;transition:opacity .2s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.5">'+
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>'+
      '</a>'+
      avatarHTML+
    '</div>'+
  '</aside>';
}

// ── TEMA DINÂMICO POR LOGO ────────────────────────────────────────────
function hexToRgb(hex) {
  hex = hex.replace('#','');
  if (hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
  return { r: parseInt(hex.slice(0,2),16), g: parseInt(hex.slice(2,4),16), b: parseInt(hex.slice(4,6),16) };
}
function rgbToHex(r,g,b) {
  return '#' + [r,g,b].map(v => Math.min(255,Math.max(0,Math.round(v))).toString(16).padStart(2,'0')).join('');
}
function darkenColor(hex, pct) {
  const {r,g,b} = hexToRgb(hex);
  return rgbToHex(r*(1-pct/100), g*(1-pct/100), b*(1-pct/100));
}
function lightenColor(hex, pct) {
  const {r,g,b} = hexToRgb(hex);
  return rgbToHex(r+(255-r)*pct/100, g+(255-g)*pct/100, b+(255-b)*pct/100);
}

function applyCompanyTheme() {
  // No design Framer o tema é monocromático — a cor da empresa aparece só em acentos mínimos
  var emp = getEmpresa();
  var cor = emp.corPDF || '#1A1A1A';
  var s = document.getElementById('_theme');
  if (!s) { s = document.createElement('style'); s.id = '_theme'; document.head.appendChild(s); }
  s.textContent =
    '.stat-card{border-left-color:'+cor+'!important}'+
    '.card-title{color:'+cor+'!important}';
}

function extractDominantColor(imgSrc, callback) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    var canvas = document.createElement('canvas');
    var size = 80;
    canvas.width = size; canvas.height = size;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, size, size);
    var data = ctx.getImageData(0, 0, size, size).data;
    var counts = {};
    for (var i = 0; i < data.length; i += 4) {
      var r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
      if (a < 100) continue;
      if (r > 230 && g > 230 && b > 230) continue;
      if (r < 30 && g < 30 && b < 30) continue;
      // Detecta se é muito cinza (sem saturação)
      var max = Math.max(r,g,b), min = Math.min(r,g,b);
      if (max - min < 30) continue;
      var qr = Math.round(r/24)*24, qg = Math.round(g/24)*24, qb = Math.round(b/24)*24;
      var k = qr+','+qg+','+qb;
      counts[k] = (counts[k]||0) + 1;
    }
    var best = null, bestN = 0;
    for (var k in counts) { if (counts[k] > bestN) { bestN = counts[k]; best = k; } }
    if (best) {
      var parts = best.split(',');
      callback(rgbToHex(+parts[0], +parts[1], +parts[2]));
    } else {
      callback('#1E3A5F');
    }
  };
  img.onerror = function() { callback('#1E3A5F'); };
  img.src = imgSrc;
}

// ── SEED DE DADOS DEMO ────────────────────────────────────────────────
function seedDemoData() {
  if (getCatalogo().length > 0) return; // ja tem dados

  setCatalogo([
    { id: gerarId(), nome: 'Nicho embutido', descricao: 'Nicho em mármore sob medida', unidade: 'unidade' },
    { id: gerarId(), nome: 'Alisar 3cm', descricao: 'Alisar em mármore 3cm de espessura', unidade: 'metro linear' },
    { id: gerarId(), nome: 'Bancada', descricao: 'Bancada em mármore sob medida', unidade: 'm²' },
    { id: gerarId(), nome: 'Piso sob medida', descricao: 'Piso em mármore com rodapé', unidade: 'm²' },
    { id: gerarId(), nome: 'Soleira', descricao: 'Soleira em mármore', unidade: 'metro linear' },
    { id: gerarId(), nome: 'Peitoril', descricao: 'Peitoril em mármore', unidade: 'metro linear' },
    { id: gerarId(), nome: 'Prateleira', descricao: 'Prateleira em mármore', unidade: 'unidade' },
    { id: gerarId(), nome: 'Pia de banheiro', descricao: 'Pia esculpida em mármore', unidade: 'unidade' },
  ]);

  const ano = new Date().getFullYear();
  const orc1 = {
    id: gerarId(), numero: ano+'/0001', cliente: 'Maria Silva', data: '15/05/'+ano,
    validade: '15 dias', material: 'Mármore Champagne', valor: 8500, status: 'Aprovado',
    valor_pago: 8500, forma_pagamento: 'Pix', data_pagamento: '15/05/2026',
    ambientes: [
      { nome: 'Suíte Master', itens: [
        { desc: 'Nicho embutido', dim: '89 x 36 cm', qtd: '2 unidades', obs: '' },
        { desc: 'Alisar 3cm', dim: '3 cm', qtd: '', obs: '' }
      ]},
      { nome: 'Banho Master', itens: [
        { desc: 'Nicho embutido', dim: '1,12 x 36 cm', qtd: '2 unidades', obs: '' },
        { desc: 'Bancada', dim: '1,20 x 0,60 m', qtd: '1 unidade', obs: '' }
      ]}
    ]
  };
  const orc2 = {
    id: gerarId(), numero: ano+'/0002', cliente: 'João Pereira', data: '18/05/'+ano,
    validade: '15 dias', material: 'Granito Preto São Gabriel', valor: 3200, status: 'Em aberto',
    valor_pago: 1600, forma_pagamento: 'Débito', data_pagamento: '18/05/2026',
    ambientes: [
      { nome: 'Cozinha', itens: [
        { desc: 'Bancada', dim: '2,40 x 0,60 m', qtd: '1 unidade', obs: 'Com cuba embutida' },
        { desc: 'Soleira', dim: '0,90 x 0,15 m', qtd: '1 unidade', obs: '' }
      ]}
    ]
  };
  const orc3 = {
    id: gerarId(), numero: ano+'/0003', cliente: 'Ana Rodrigues', data: '22/05/'+ano,
    validade: '30 dias', material: 'Quartzo Branco Polar', valor: 12800, status: 'Em produção',
    valor_pago: 0, forma_pagamento: '', data_pagamento: '',
    ambientes: [
      { nome: 'Cozinha Gourmet', itens: [
        { desc: 'Bancada', dim: '3,60 x 0,70 m', qtd: '1 unidade', obs: 'Ilha central' },
        { desc: 'Piso sob medida', dim: '12 m²', qtd: '', obs: 'Com rodapé' }
      ]},
      { nome: 'Área Gourmet', itens: [
        { desc: 'Bancada', dim: '2,00 x 0,60 m', qtd: '1 unidade', obs: '' }
      ]}
    ]
  };
  setOrcamentos([orc3, orc2, orc1]);
}
