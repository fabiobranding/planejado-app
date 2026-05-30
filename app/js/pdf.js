function gerarPDF(orc) {
  const emp = getEmpresa();
  const cor = emp.corPDF || '#1E3A5F';
  const corClara = '#EEF2FF';
  const logoHTML = emp.logo
    ? '<div style="width:74px;height:74px;border-radius:50%;border:3px solid #fff;overflow:hidden;flex-shrink:0;background:#fff">' +
      '<img src="' + emp.logo + '" style="width:100%;height:100%;object-fit:cover;display:block"></div>'
    : '<div style="width:74px;height:74px;border-radius:50%;border:3px solid rgba(255,255,255,.4);background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;color:#fff;flex-shrink:0">' +
      (emp.nome ? emp.nome.charAt(0).toUpperCase() : 'M') + '</div>';

  let linhas = '';
  (orc.ambientes || []).forEach(function(amb) {
    linhas += '<tr><td colspan="4" style="background:' + corClara + ';color:' + cor + ';font-weight:800;font-size:12px;padding:8px 12px;border-top:2px solid #93c5fd">&#9658; ' + amb.nome + '</td></tr>';
    (amb.itens || []).forEach(function(item, i) {
      var bg = i % 2 === 0 ? '#fff' : '#FAFAFA';
      linhas += '<tr style="background:' + bg + '">' +
        '<td style="padding:8px 12px;border-bottom:1px solid #E0E0E0;font-size:12px">' + (item.desc || '') + '</td>' +
        '<td style="padding:8px 12px;border-bottom:1px solid #E0E0E0;font-size:12px">' + (item.dim || '—') + '</td>' +
        '<td style="padding:8px 12px;border-bottom:1px solid #E0E0E0;font-size:12px">' + (item.qtd || '—') + '</td>' +
        '<td style="padding:8px 12px;border-bottom:1px solid #E0E0E0;font-size:12px">' + (item.obs || '—') + '</td>' +
        '</tr>';
    });
  });

  var obsDefault = emp.observacoes ||
    '1. Medições definitivas serão realizadas in loco antes do início da produção.<br>' +
    '2. Variações naturais de cor e veios são características inerentes do mármore natural.<br>' +
    '3. Prazo de execução: a combinar após aprovação e pagamento do sinal.<br>' +
    '4. Garantia de 12 meses para serviços de instalação.<br>' +
    '5. Este orçamento tem validade de ' + (orc.validade || '15 dias') + ' a partir da data de emissão.';

  // ── Ícones SVG brancos padronizados ──────────────────────────────────
  var IC = 'style="vertical-align:middle;margin-right:5px"';
  var svgPhone = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="#bfdbfe" '+IC+'><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>';
  var svgWhats = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="#bfdbfe" '+IC+'><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
  var svgInsta = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="#bfdbfe" '+IC+'><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>';
  var svgPin  = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="#bfdbfe" '+IC+'><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';

  var contatoInfo = '';
  if (emp.telefone) contatoInfo += '<span>' + svgPhone + emp.telefone + '</span>';
  if (emp.whatsapp) contatoInfo += '<span>' + svgWhats + emp.whatsapp + '</span>';
  if (emp.instagram) contatoInfo += '<span>' + svgInsta + emp.instagram + '</span>';
  if (emp.endereco)  contatoInfo += '<span>' + svgPin  + emp.endereco  + '</span>';

  var footerContato = '';
  if (emp.telefone) footerContato += ' &nbsp;|&nbsp; ' + emp.telefone;
  if (emp.whatsapp) footerContato += ' &nbsp;|&nbsp; ' + emp.whatsapp;
  if (emp.instagram) footerContato += ' &nbsp;|&nbsp; ' + emp.instagram;

  var html = '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">' +
    '<style>' +
    '*{box-sizing:border-box;margin:0;padding:0}' +
    'body{font-family:Arial,sans-serif;color:#222;background:#fff;padding:28px;font-size:13px}' +
    '@media print{' +
    '*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color-adjust:exact!important}' +
    'body{padding:16px}' +
    '}' +
    '</style>' +
    '</head><body>' +
    '<div style="background:' + cor + ';color:#fff;padding:20px 24px;border-radius:6px;margin-bottom:16px">' +
    '<div style="display:flex;align-items:center;gap:16px">' + logoHTML +
    '<div><div style="font-size:26px;font-weight:900;letter-spacing:2px">' + (emp.nome || 'Sua Marmoraria') + '</div></div>' +
    '</div>' +
    '<div style="margin-top:10px;border-top:1px solid #2a4a7f;padding-top:10px;font-size:11px;color:#bfdbfe;display:flex;gap:20px;flex-wrap:wrap">' + contatoInfo + '</div>' +
    '</div>' +
    '<div style="height:4px;background:#355996;margin-bottom:16px;border-radius:2px"></div>' +
    '<div style="text-align:center;font-size:19px;font-weight:900;letter-spacing:5px;color:' + cor + ';margin-bottom:4px">ORÇAMENTO</div>' +
    '<div style="text-align:center;font-size:11px;color:#888;margin-bottom:14px">N° ' + (orc.numero || '') + '</div>' +
    '<div style="background:#F1F8E9;border-left:4px solid ' + cor + ';padding:10px 14px;margin-bottom:16px;border-radius:4px;display:flex;gap:28px;flex-wrap:wrap">' +
    '<span><strong style="color:' + cor + '">Cliente:</strong> ' + (orc.cliente || '') + '</span>' +
    '<span><strong style="color:' + cor + '">Data:</strong> ' + (orc.data || '') + '</span>' +
    '<span><strong style="color:' + cor + '">Validade:</strong> ' + (orc.validade || '') + '</span>' +
    '</div>' +
    '<table style="width:100%;border-collapse:collapse;margin-bottom:16px">' +
    '<thead><tr style="background:' + cor + ';color:#fff">' +
    '<th style="padding:10px 12px;text-align:left;font-size:12px;width:44%">Descrição</th>' +
    '<th style="padding:10px 12px;text-align:left;font-size:12px;width:22%">Dimensões</th>' +
    '<th style="padding:10px 12px;text-align:left;font-size:12px;width:16%">Qtd</th>' +
    '<th style="padding:10px 12px;text-align:left;font-size:12px;width:18%">Observação</th>' +
    '</tr></thead>' +
    '<tbody>' + linhas + '</tbody>' +
    '</table>' +
    '<div style="background:#EEF2FF;border:1px solid #93c5fd;border-radius:6px;padding:12px 16px;margin-bottom:16px">' +
    '<div style="font-size:10px;font-weight:700;color:' + cor + ';text-transform:uppercase;letter-spacing:1px">Material Utilizado</div>' +
    '<div style="font-size:15px;font-weight:700;margin-top:4px">' + (orc.material || '') + '</div>' +
    '</div>' +
    '<div style="background:' + cor + ';color:#fff;border-radius:6px;padding:16px 24px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">' +
    '<div style="font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase">Valor Total</div>' +
    '<div style="font-size:24px;font-weight:900">R$ ' + formatBRL(orc.valor) + '</div>' +
    '</div>' +
    '<div style="border:1px solid #bfdbfe;border-radius:6px;padding:12px 16px;margin-bottom:20px;font-size:12px;color:#444;line-height:1.8">' +
    '<div style="font-weight:700;color:' + cor + ';font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Observações Importantes</div>' +
    obsDefault +
    '</div>' +
    '<div style="display:flex;justify-content:space-between;margin-bottom:24px;margin-top:32px">' +
    '<div style="width:44%;text-align:center"><div style="border-top:1px solid #888;margin-bottom:6px"></div>' +
    '<div style="font-size:11px;color:#555"><strong>' + (emp.nome || 'Marmoraria') + '</strong><br>Responsável Técnico</div></div>' +
    '<div style="width:44%;text-align:center"><div style="border-top:1px solid #888;margin-bottom:6px"></div>' +
    '<div style="font-size:11px;color:#555"><strong>Cliente</strong><br>' + (orc.cliente || '') + '</div></div>' +
    '</div>' +
    '<div style="background:' + cor + ';color:#bfdbfe;text-align:center;border-radius:6px;padding:10px;font-size:11px">' +
    '<strong style="color:#fff">' + (emp.nome || 'Sua Marmoraria') + '</strong>' + footerContato +
    '</div>' +
    '<script>window.onload=function(){window.print()}<\/script>' +
    '</body></html>';

  var w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
}
