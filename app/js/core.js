// ── AUTH ──────────────────────────────────────────────────────────────
function getUsuario() { return JSON.parse(localStorage.getItem('om_usuario') || 'null'); }
function setUsuario(u) { localStorage.setItem('om_usuario', JSON.stringify(u)); }
function logout() { localStorage.removeItem('om_usuario'); window.location.href = '../login.html'; }
function requireAuth() { if (!getUsuario()) { window.location.href = '../login.html'; } }

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
  const map = {
    'Em aberto': 'badge-aberto',
    'Aprovado': 'badge-aprovado',
    'Em producao': 'badge-producao',
    'Em produção': 'badge-producao',
    'Entregue': 'badge-entregue',
    'Recusado': 'badge-recusado'
  };
  return '<span class="badge ' + (map[status] || 'badge-aberto') + '">' + (status || 'Em aberto') + '</span>';
}

function renderSidebar(active) {
  var u = getUsuario();
  var emp = getEmpresa();
  var S = 'width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"';
  var icons = {
    dashboard: '<svg xmlns="http://www.w3.org/2000/svg" '+S+'><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    orcamentos:'<svg xmlns="http://www.w3.org/2000/svg" '+S+'><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    novo:      '<svg xmlns="http://www.w3.org/2000/svg" '+S+'><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
    catalogo:  '<svg xmlns="http://www.w3.org/2000/svg" '+S+'><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    config:    '<svg xmlns="http://www.w3.org/2000/svg" '+S+'><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    planos:    '<svg xmlns="http://www.w3.org/2000/svg" '+S+'><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
  };
  var logoImg = emp.logo
    ? '<img src="'+emp.logo+'" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.4);flex-shrink:0">'
    : '';
  return '<aside class="sidebar">' +
    '<div class="sidebar-logo" style="display:flex;align-items:center;gap:10px">' + logoImg + '<span>Orça<span style="color:#4CAF50">Mármore</span></span></div>' +
    '<nav>' +
    '<a href="dashboard.html" class="' + (active==='dashboard'?'active':'') + '">' + icons.dashboard + ' Dashboard</a>' +
    '<a href="orcamentos.html" class="' + (active==='orcamentos'?'active':'') + '">' + icons.orcamentos + ' Orçamentos</a>' +
    '<a href="novo-orcamento.html" class="' + (active==='novo'?'active':'') + '">' + icons.novo + ' Novo Orçamento</a>' +
    '<a href="catalogo.html" class="' + (active==='catalogo'?'active':'') + '">' + icons.catalogo + ' Catálogo</a>' +
    '<a href="configuracoes.html" class="' + (active==='config'?'active':'') + '">' + icons.config + ' Configurações</a>' +
    '<a href="planos.html" class="' + (active==='planos'?'active':'') + '">' + icons.planos + ' Planos</a>' +
    '</nav>' +
    '<div class="sidebar-bottom">' +
    '<div style="font-size:12px;color:#a5d6a7;margin-bottom:8px">' + (emp.nome || (u && u.marmoraria) || '') + '</div>' +
    '<button class="btn-logout" onclick="logout()">Sair</button>' +
    '</div></aside>';
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
  const emp = getEmpresa();
  const cor = emp.corPDF || '#1B5E20';
  const escuro = darkenColor(cor, 15);
  const claro  = lightenColor(cor, 88);
  const medio  = lightenColor(cor, 60);

  var s = document.getElementById('_theme');
  if (!s) { s = document.createElement('style'); s.id = '_theme'; document.head.appendChild(s); }
  s.textContent =
    '.sidebar{background:'+cor+'!important}' +
    '.sidebar nav a:hover,.sidebar nav a.active{background:'+escuro+'!important}' +
    '.sidebar-logo{color:#fff!important}' +
    '.topbar h2,.card-title,.stat-card .stat-value,.ambiente-nome{color:'+cor+'!important}' +
    '.stat-card{border-top-color:'+cor+'!important}' +
    '.btn-primary,.btn-novo,.btn-submit{background:'+cor+'!important}' +
    '.btn-primary:hover,.btn-novo:hover,.btn-submit:hover{background:'+escuro+'!important}' +
    'thead tr{background:'+cor+'!important}' +
    '.total-box{background:'+cor+'!important}' +
    '.ambiente-nome{background:'+claro+'!important;border-color:'+medio+'!important}' +
    '.btn-add-item{color:'+escuro+'!important;border-color:'+medio+'!important}' +
    '.btn-add-item:hover{background:'+claro+'!important}' +
    '.btn-add-ambiente{background:'+claro+'!important;border-color:'+medio+'!important;color:'+cor+'!important}' +
    '.form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:'+cor+'!important}' +
    '.card-title{border-bottom-color:'+claro+'!important}' +
    '.btn-logout{border-color:'+medio+'!important;color:'+medio+'!important}' +
    '.plano-nome{color:'+cor+'!important}' +
    '.plano-card.destaque{border-color:'+cor+'!important}';
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
      callback('#1B5E20');
    }
  };
  img.onerror = function() { callback('#1B5E20'); };
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
