/* ============================================
   Planejado.app — pdf.js
   Geração do PDF de orçamento
   ============================================ */

function gerarPDF(orcamento) {
  const empresa = getEmpresa();
  const usuario = getUsuario();

  const nomeEmpresa = empresa.nome || (usuario && usuario.marcenaria) || 'Minha Marcenaria';
  const tel = empresa.tel || '';
  const whats = empresa.whats || '';
  const insta = empresa.insta || '';
  const email = empresa.email || '';
  const endereco = empresa.endereco || '';
  const cnpj = empresa.cnpj || '';
  const logoBase64 = empresa.logo || '';
  const corPDF = empresa.corPDF || '#3E2723';
  const obsDefault = empresa.obsDefault || '1. Prazo de entrega sujeito à confirmação no fechamento do pedido.\n2. Montagem inclusa no valor apresentado.\n3. Garantia de 1 ano contra defeitos de fabricação.\n4. Validade deste orçamento conforme indicado acima.\n5. Pagamento: 50% entrada + 50% na entrega.';
  const msgWA = empresa.msgWA || '';

  const obsTexto = orcamento.obs || obsDefault;

  // Calcular total real
  let subtotalGeral = 0;
  const ambientesHTML = (orcamento.ambientes || []).map(amb => {
    let subtotalAmb = 0;
    const itensHTML = (amb.itens || []).map((item, i) => {
      const subtItem = (Number(item.qtd) || 1) * (Number(item.preco) || 0);
      subtotalAmb += subtItem;
      return `
        <tr style="background:${i % 2 === 0 ? '#fff' : '#FAFAFA'}">
          <td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:13px">${item.descricao || ''}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:13px;text-align:center">${item.dimensoes || '-'}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:13px;text-align:center">${item.qtd || 1}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:13px">${item.acabamento || '-'}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:13px;text-align:right">R$ ${formatBRL(item.preco)}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:13px;text-align:right">R$ ${formatBRL(subtItem)}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:13px">${item.obs || '-'}</td>
        </tr>`;
    }).join('');
    subtotalGeral += subtotalAmb;
    return `
      <tr>
        <td colspan="7" style="padding:10px 10px 4px;background:#F5F0E8;font-weight:700;font-size:13px;color:${corPDF};border-bottom:1px solid #ddd">
          &#9654; ${amb.nome || 'Ambiente'}
        </td>
      </tr>
      ${itensHTML}
      <tr>
        <td colspan="5" style="padding:6px 10px;text-align:right;font-size:12px;color:#666;background:#f5f5f5">Subtotal ${amb.nome || 'Ambiente'}:</td>
        <td style="padding:6px 10px;text-align:right;font-weight:700;font-size:13px;background:#f5f5f5">R$ ${formatBRL(subtotalAmb)}</td>
        <td style="background:#f5f5f5"></td>
      </tr>`;
  }).join('');

  const desconto = Number(orcamento.desconto) || 0;
  const totalFinal = Number(orcamento.total) || (subtotalGeral - desconto);

  const validadeLabel = (() => {
    const v = orcamento.validade;
    if (v === '7') return '7 dias';
    if (v === '15') return '15 dias';
    if (v === '30') return '30 dias';
    return v ? `${v} dias` : '15 dias';
  })();

  const obsLinhas = String(obsTexto).split('\n').map(l => `<p style="margin:0 0 4px;font-size:13px">${l}</p>`).join('');

  const logoHTML = logoBase64
    ? `<img src="${logoBase64}" alt="Logo" style="max-height:70px;max-width:180px;object-fit:contain">`
    : `<div style="width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:#fff">${nomeEmpresa.charAt(0)}</div>`;

  const contatos = [
    tel ? `&#128222; ${tel}` : '',
    whats ? `&#128241; ${whats}` : '',
    insta ? `&#128247; ${insta}` : '',
    email ? `&#128140; ${email}` : '',
  ].filter(Boolean).join('&nbsp;&nbsp;|&nbsp;&nbsp;');

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Orçamento ${orcamento.numero || ''} - ${nomeEmpresa}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', Arial, sans-serif;
      background: #f0f0f0;
      color: #222;
      font-size: 14px;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      background: #fff;
      margin: 0 auto;
      box-shadow: 0 4px 20px rgba(0,0,0,.15);
    }
    @media print {
      body { background: #fff; }
      .page { box-shadow: none; width: 100%; margin: 0; }
      .no-print { display: none !important; }
    }
    table { border-collapse: collapse; width: 100%; }
  </style>
</head>
<body>

<div class="no-print" style="text-align:center;padding:16px;background:#333;color:#fff;font-family:Arial,sans-serif">
  <strong>Pré-visualização do PDF</strong> &nbsp;|&nbsp;
  <button onclick="window.print()" style="background:#FF8F00;color:#fff;border:none;padding:8px 20px;border-radius:4px;cursor:pointer;font-weight:700">Imprimir / Salvar PDF</button>
  &nbsp;
  <button onclick="window.close()" style="background:#666;color:#fff;border:none;padding:8px 20px;border-radius:4px;cursor:pointer">Fechar</button>
</div>

<div class="page">

  <!-- CABEÇALHO -->
  <div style="background:${corPDF};padding:24px 28px;display:flex;align-items:center;gap:20px">
    <div>${logoHTML}</div>
    <div style="flex:1">
      <div style="font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.5px">${nomeEmpresa}</div>
      ${cnpj ? `<div style="font-size:11px;color:rgba(255,255,255,.7);margin-top:2px">CNPJ: ${cnpj}</div>` : ''}
      ${contatos ? `<div style="font-size:12px;color:rgba(255,255,255,.85);margin-top:6px">${contatos}</div>` : ''}
      ${endereco ? `<div style="font-size:11px;color:rgba(255,255,255,.7);margin-top:2px">&#128205; ${endereco}</div>` : ''}
    </div>
  </div>

  <!-- TÍTULO ORÇAMENTO -->
  <div style="text-align:center;padding:18px;border-bottom:2px solid ${corPDF}">
    <div style="font-size:13px;font-weight:700;color:#666;letter-spacing:4px;text-transform:uppercase">Orçamento</div>
    <div style="font-size:22px;font-weight:900;color:${corPDF};letter-spacing:-0.5px">Nº ${orcamento.numero || '—'}</div>
  </div>

  <!-- DADOS DO CLIENTE -->
  <div style="background:#F5F0E8;padding:14px 28px;display:flex;gap:32px;flex-wrap:wrap;border-bottom:1px solid #ddd">
    <div>
      <div style="font-size:11px;font-weight:700;color:#666;text-transform:uppercase;margin-bottom:2px">Cliente</div>
      <div style="font-weight:600;font-size:14px">${orcamento.cliente || '—'}</div>
    </div>
    <div>
      <div style="font-size:11px;font-weight:700;color:#666;text-transform:uppercase;margin-bottom:2px">Data</div>
      <div style="font-weight:600;font-size:14px">${formatDate(orcamento.data)}</div>
    </div>
    <div>
      <div style="font-size:11px;font-weight:700;color:#666;text-transform:uppercase;margin-bottom:2px">Validade</div>
      <div style="font-weight:600;font-size:14px">${validadeLabel}</div>
    </div>
    ${orcamento.material ? `
    <div>
      <div style="font-size:11px;font-weight:700;color:#666;text-transform:uppercase;margin-bottom:2px">Material</div>
      <div style="font-weight:600;font-size:14px">${orcamento.material}</div>
    </div>` : ''}
  </div>

  <!-- TABELA DE ITENS -->
  <div style="padding:0">
    <table>
      <thead>
        <tr style="background:${corPDF}">
          <th style="padding:10px 10px;text-align:left;font-size:11px;color:#fff;font-weight:700;letter-spacing:.5px">DESCRIÇÃO</th>
          <th style="padding:10px 10px;text-align:center;font-size:11px;color:#fff;font-weight:700;letter-spacing:.5px">DIMENSÕES</th>
          <th style="padding:10px 10px;text-align:center;font-size:11px;color:#fff;font-weight:700;letter-spacing:.5px">QTD</th>
          <th style="padding:10px 10px;text-align:left;font-size:11px;color:#fff;font-weight:700;letter-spacing:.5px">ACABAMENTO</th>
          <th style="padding:10px 10px;text-align:right;font-size:11px;color:#fff;font-weight:700;letter-spacing:.5px">UNIT.</th>
          <th style="padding:10px 10px;text-align:right;font-size:11px;color:#fff;font-weight:700;letter-spacing:.5px">SUBTOTAL</th>
          <th style="padding:10px 10px;text-align:left;font-size:11px;color:#fff;font-weight:700;letter-spacing:.5px">OBS.</th>
        </tr>
      </thead>
      <tbody>
        ${ambientesHTML}
      </tbody>
    </table>
  </div>

  <!-- TOTAIS -->
  <div style="padding:0 28px 16px;margin-top:8px">
    ${desconto > 0 ? `
    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;font-size:13px">
      <span style="color:#666">Subtotal:</span>
      <span>R$ ${formatBRL(subtotalGeral)}</span>
    </div>
    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;font-size:13px">
      <span style="color:#666">Desconto:</span>
      <span style="color:#C62828">- R$ ${formatBRL(desconto)}</span>
    </div>` : ''}
    <div style="background:${corPDF};padding:16px 20px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;margin-top:12px">
      <span style="font-size:15px;font-weight:700;color:#fff;letter-spacing:1px">VALOR TOTAL</span>
      <span style="font-size:22px;font-weight:900;color:#fff">R$ ${formatBRL(totalFinal)}</span>
    </div>
  </div>

  <!-- OBSERVAÇÕES -->
  <div style="margin:0 28px 16px;padding:16px;background:#FFF8E1;border-radius:8px;border-left:4px solid ${corPDF}">
    <div style="font-size:12px;font-weight:700;color:${corPDF};text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Observações</div>
    ${obsLinhas}
  </div>

  <!-- ASSINATURAS -->
  <div style="margin:0 28px 24px;display:flex;gap:40px">
    <div style="flex:1">
      <div style="border-top:1.5px solid #333;padding-top:8px;margin-top:40px">
        <div style="font-size:12px;font-weight:600;color:#444">${nomeEmpresa}</div>
        <div style="font-size:11px;color:#888">Responsável</div>
      </div>
    </div>
    <div style="flex:1">
      <div style="border-top:1.5px solid #333;padding-top:8px;margin-top:40px">
        <div style="font-size:12px;font-weight:600;color:#444">${orcamento.cliente || 'Cliente'}</div>
        <div style="font-size:11px;color:#888">Aprovação</div>
      </div>
    </div>
  </div>

  <!-- RODAPÉ -->
  <div style="background:${corPDF};padding:14px 28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
    <div style="font-size:13px;font-weight:800;color:#fff">${nomeEmpresa}</div>
    <div style="font-size:11px;color:rgba(255,255,255,.75)">${contatos || ''}</div>
    <div style="font-size:11px;color:rgba(255,255,255,.6)">Gerado via Planejado.app</div>
  </div>

</div>

<script>
  // Auto print removed - user clicks button
</script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  // Fallback if popup blocked
  if (!win) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `orcamento-${orcamento.numero || 'pdf'}.html`;
    a.click();
  }
}
