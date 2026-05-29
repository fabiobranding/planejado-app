/* ============================================
   Planejado.app — core.js
   Auth, localStorage helpers, utilitários
   ============================================ */

// ─── Auth ──────────────────────────────────────
function getUsuario() {
  try { return JSON.parse(localStorage.getItem('usuario') || 'null'); }
  catch { return null; }
}
function setUsuario(u) { localStorage.setItem('usuario', JSON.stringify(u)); }
function logout() { localStorage.removeItem('usuario'); window.location.href = '../login.html'; }
function requireAuth() { if (!getUsuario()) window.location.href = '../login.html'; }

// ─── Empresa ───────────────────────────────────
function getEmpresa() {
  try { return JSON.parse(localStorage.getItem('empresa') || '{}'); }
  catch { return {}; }
}
function setEmpresa(e) { localStorage.setItem('empresa', JSON.stringify(e)); }

// ─── Orçamentos ────────────────────────────────
function getOrcamentos() {
  try { return JSON.parse(localStorage.getItem('orcamentos') || '[]'); }
  catch { return []; }
}
function setOrcamentos(o) { localStorage.setItem('orcamentos', JSON.stringify(o)); }
function saveOrcamento(orc) {
  const lista = getOrcamentos();
  const idx = lista.findIndex(o => o.id === orc.id);
  if (idx >= 0) lista[idx] = orc;
  else lista.unshift(orc);
  setOrcamentos(lista);
}
function getOrcamento(id) { return getOrcamentos().find(o => o.id === id) || null; }
function deleteOrcamento(id) {
  const lista = getOrcamentos().filter(o => o.id !== id);
  setOrcamentos(lista);
}

// ─── Catálogo ──────────────────────────────────
function getCatalogo() {
  try { return JSON.parse(localStorage.getItem('catalogo') || '[]'); }
  catch { return []; }
}
function setCatalogo(c) { localStorage.setItem('catalogo', JSON.stringify(c)); }
function saveCatalogoItem(item) {
  const lista = getCatalogo();
  const idx = lista.findIndex(i => i.id === item.id);
  if (idx >= 0) lista[idx] = item;
  else lista.push(item);
  setCatalogo(lista);
}
function deleteCatalogoItem(id) {
  setCatalogo(getCatalogo().filter(i => i.id !== id));
}

// ─── Helpers ───────────────────────────────────
function gerarId() { return Date.now().toString(36) + Math.random().toString(36).substr(2); }

function formatBRL(val) {
  return Number(val || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseBRL(str) {
  if (typeof str === 'number') return str;
  return parseFloat(String(str || '0').replace(/\./g, '').replace(',', '.')) || 0;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR');
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function proximoNumero() {
  const ano = new Date().getFullYear();
  const lista = getOrcamentos();
  const count = lista.filter(o => o.numero && String(o.numero).startsWith(String(ano))).length;
  return `${ano}/${String(count + 1).padStart(4, '0')}`;
}

// ─── Status helpers ────────────────────────────
const STATUS_LABELS = {
  'em_aberto':     'Em aberto',
  'aprovado':      'Aprovado',
  'em_producao':   'Em produção',
  'entregue':      'Entregue',
  'recusado':      'Recusado',
};
const STATUS_BADGES = {
  'em_aberto':   'badge-yellow',
  'aprovado':    'badge-green',
  'em_producao': 'badge-blue',
  'entregue':    'badge-gray',
  'recusado':    'badge-red',
};
function statusBadge(status) {
  const cls = STATUS_BADGES[status] || 'badge-gray';
  const label = STATUS_LABELS[status] || status;
  return `<span class="badge ${cls}">${label}</span>`;
}

// ─── Render sidebar ativo ──────────────────────
function setActiveNav(page) {
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === page || a.href.endsWith(page));
  });
}

// ─── Preencher nome empresa no header ─────────
function renderHeader() {
  const empresa = getEmpresa();
  const usuario = getUsuario();
  const el = document.getElementById('headerEmpresa');
  if (el) el.textContent = empresa.nome || (usuario && usuario.marcenaria) || 'Minha Empresa';
}

// ─── Hamburger menu ────────────────────────────
function initHamburger() {
  const btn = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');
  if (!btn || !sidebar) return;
  btn.addEventListener('click', () => sidebar.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !btn.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

// ─── Dados de demonstração ─────────────────────
function seedDemoData() {
  if (localStorage.getItem('_demo_seeded')) return;
  localStorage.setItem('_demo_seeded', '1');

  // Catálogo demo
  const catalogo = [
    { id: gerarId(), nome: 'Armário de Cozinha Aéreo', descricao: 'Armário aéreo com 2 portas', preco: 850, unidade: 'unidade' },
    { id: gerarId(), nome: 'Armário Inferior', descricao: 'Balcão inferior com gaveta', preco: 720, unidade: 'unidade' },
    { id: gerarId(), nome: 'Guarda-roupa 3 Portas', descricao: 'Guarda-roupa em MDF com espelho', preco: 2400, unidade: 'unidade' },
    { id: gerarId(), nome: 'Nicho Decorativo', descricao: 'Nicho em MDF 30x30cm', preco: 180, unidade: 'unidade' },
    { id: gerarId(), nome: 'Painel TV', descricao: 'Painel para TV até 65" com prateleiras', preco: 1600, unidade: 'unidade' },
  ];
  setCatalogo(catalogo);

  // Orçamentos demo
  const now = new Date();
  const mesAtual = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  const orcamentos = [
    {
      id: gerarId(),
      numero: `${now.getFullYear()}/0001`,
      cliente: 'Ana Paula Ferreira',
      clienteTel: '11999990001',
      data: mesAtual + '-05',
      validade: '15',
      status: 'aprovado',
      material: 'MDF 18mm BP Branco',
      desconto: 0,
      total: 8500,
      ambientes: [
        {
          id: gerarId(),
          nome: 'Cozinha',
          itens: [
            { id: gerarId(), descricao: 'Armário de Cozinha Aéreo', dimensoes: '2,40x0,35', qtd: 4, acabamento: 'BP Branco', preco: 850, obs: '' },
            { id: gerarId(), descricao: 'Armário Inferior', dimensoes: '2,40x0,60', qtd: 3, acabamento: 'BP Branco', preco: 720, obs: 'Com gavetas' },
          ]
        },
        {
          id: gerarId(),
          nome: 'Área de Serviço',
          itens: [
            { id: gerarId(), descricao: 'Armário Inferior', dimensoes: '1,20x0,60', qtd: 1, acabamento: 'BP Branco', preco: 720, obs: '' },
          ]
        }
      ],
      obs: '1. Prazo de entrega: 30 dias após aprovação\n2. Montagem inclusa\n3. Garantia de 1 ano',
    },
    {
      id: gerarId(),
      numero: `${now.getFullYear()}/0002`,
      cliente: 'Roberto Almeida',
      clienteTel: '11988880002',
      data: mesAtual + '-10',
      validade: '30',
      status: 'em_aberto',
      material: 'MDF 15mm',
      desconto: 200,
      total: 5700,
      ambientes: [
        {
          id: gerarId(),
          nome: 'Quarto Master',
          itens: [
            { id: gerarId(), descricao: 'Guarda-roupa 3 Portas', dimensoes: '2,20x2,10', qtd: 1, acabamento: 'Carvalho', preco: 2400, obs: '' },
            { id: gerarId(), descricao: 'Nicho Decorativo', dimensoes: '0,30x0,30', qtd: 6, acabamento: 'Carvalho', preco: 180, obs: '' },
          ]
        }
      ],
      obs: '1. Prazo de entrega: 25 dias\n2. Frete por conta do cliente',
    },
    {
      id: gerarId(),
      numero: `${now.getFullYear()}/0003`,
      cliente: 'Carla Mendes',
      clienteTel: '11977770003',
      data: mesAtual + '-15',
      validade: '15',
      status: 'em_producao',
      material: 'MDF 18mm Carvalho',
      desconto: 0,
      total: 12800,
      ambientes: [
        {
          id: gerarId(),
          nome: 'Sala de Estar',
          itens: [
            { id: gerarId(), descricao: 'Painel TV', dimensoes: '3,00x2,20', qtd: 1, acabamento: 'Carvalho Natural', preco: 1600, obs: '' },
            { id: gerarId(), descricao: 'Nicho Decorativo', dimensoes: '0,40x0,40', qtd: 8, acabamento: 'Carvalho Natural', preco: 180, obs: '' },
          ]
        },
        {
          id: gerarId(),
          nome: 'Home Office',
          itens: [
            { id: gerarId(), descricao: 'Armário Inferior', dimensoes: '1,80x0,55', qtd: 2, acabamento: 'Grafite', preco: 720, obs: 'Com puxa-puxa' },
          ]
        }
      ],
      obs: '1. Prazo de entrega: 45 dias\n2. Montagem inclusa\n3. Pagamento: 50% entrada + 50% na entrega',
    },
  ];
  setOrcamentos(orcamentos);
}

// ─── Inicialização ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  renderHeader();
});
