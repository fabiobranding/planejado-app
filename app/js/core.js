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
  const u = getUsuario();
  const emp = getEmpresa();
  return '<aside class="sidebar">' +
    '<div class="sidebar-logo">Orça<span>Mármore</span></div>' +
    '<nav>' +
    '<a href="dashboard.html" class="' + (active==='dashboard'?'active':'') + '">📊 Dashboard</a>' +
    '<a href="orcamentos.html" class="' + (active==='orcamentos'?'active':'') + '">📄 Orçamentos</a>' +
    '<a href="novo-orcamento.html" class="' + (active==='novo'?'active':'') + '">➕ Novo Orçamento</a>' +
    '<a href="catalogo.html" class="' + (active==='catalogo'?'active':'') + '">📦 Catálogo</a>' +
    '<a href="configuracoes.html" class="' + (active==='config'?'active':'') + '">⚙️ Configurações</a>' +
    '<a href="planos.html" class="' + (active==='planos'?'active':'') + '">💎 Planos</a>' +
    '</nav>' +
    '<div class="sidebar-bottom">' +
    '<div style="font-size:12px;color:#a5d6a7;margin-bottom:8px">' + (emp.nome || (u && u.marmoraria) || '') + '</div>' +
    '<button class="btn-logout" onclick="logout()">Sair</button>' +
    '</div></aside>';
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
