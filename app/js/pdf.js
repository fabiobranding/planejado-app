function gerarPDF(orc) {
  const emp = getEmpresa();
  const cor = emp.corPDF || '#1B5E20';
  const corClara = '#E8F5E9';
  const logoHTML = emp.logo
    ? '<img src="' + emp.logo + '" style="width:70px;height:70px;border-radius:50%;border:3px solid #fff;object-fit:cover;background:#fff">'
    : '<div style="width:70px;height:70px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;color:' + cor + '">M</div>';

  let linhas = '';
  (orc.ambientes || []).forEach(function(amb) {
    linhas += '<tr><td colspan="4" style="background:' + corClara + ';color:' + cor + ';font-weight:800;font-size:12px;padding:8px 12px;border-top:2px solid #A5D6A7">&#9658; ' + amb.nome + '</td></tr>';
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

  var contatoInfo = '';
  if (emp.telefone) contatoInfo += '<span>&#128222; ' + emp.telefone + '</span>';
  if (emp.whatsapp) contatoInfo += '<span>&#128241; ' + emp.whatsapp + '</span>';
  if (emp.instagram) contatoInfo += '<span>&#128247; ' + emp.instagram + '</span>';
  if (emp.endereco)  contatoInfo += '<span>&#128205; ' + emp.endereco + '</span>';

  var footerContato = '';
  if (emp.telefone) footerContato += ' &nbsp;|&nbsp; ' + emp.telefone;
  if (emp.whatsapp) footerContato += ' &nbsp;|&nbsp; ' + emp.whatsapp;
  if (emp.instagram) footerContato += ' &nbsp;|&nbsp; ' + emp.instagram;

  var html = '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">' +
    '<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;color:#222;background:#fff;padding:28px;font-size:13px}</style>' +
    '</head><body>' +
    '<div style="background:' + cor + ';color:#fff;padding:20px 24px;border-radius:6px;margin-bottom:16px">' +
    '<div style="display:flex;align-items:center;gap:16px">' + logoHTML +
    '<div><div style="font-size:26px;font-weight:900;letter-spacing:2px">' + (emp.nome || 'Sua Marmoraria') + '</div></div>' +
    '</div>' +
    '<div style="margin-top:10px;border-top:1px solid #2E7D32;padding-top:10px;font-size:11px;color:#c8e6c9;display:flex;gap:20px;flex-wrap:wrap">' + contatoInfo + '</div>' +
    '</div>' +
    '<div style="height:4px;background:#4CAF50;margin-bottom:16px;border-radius:2px"></div>' +
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
    '<div style="background:#E8F5E9;border:1px solid #A5D6A7;border-radius:6px;padding:12px 16px;margin-bottom:16px">' +
    '<div style="font-size:10px;font-weight:700;color:' + cor + ';text-transform:uppercase;letter-spacing:1px">Material Utilizado</div>' +
    '<div style="font-size:15px;font-weight:700;margin-top:4px">' + (orc.material || '') + '</div>' +
    '</div>' +
    '<div style="background:' + cor + ';color:#fff;border-radius:6px;padding:16px 24px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">' +
    '<div style="font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase">Valor Total</div>' +
    '<div style="font-size:24px;font-weight:900">R$ ' + formatBRL(orc.valor) + '</div>' +
    '</div>' +
    '<div style="border:1px solid #C8E6C9;border-radius:6px;padding:12px 16px;margin-bottom:20px;font-size:12px;color:#444;line-height:1.8">' +
    '<div style="font-weight:700;color:' + cor + ';font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Observações Importantes</div>' +
    obsDefault +
    '</div>' +
    '<div style="display:flex;justify-content:space-between;margin-bottom:24px;margin-top:32px">' +
    '<div style="width:44%;text-align:center"><div style="border-top:1px solid #888;margin-bottom:6px"></div>' +
    '<div style="font-size:11px;color:#555"><strong>' + (emp.nome || 'Marmoraria') + '</strong><br>Responsável Técnico</div></div>' +
    '<div style="width:44%;text-align:center"><div style="border-top:1px solid #888;margin-bottom:6px"></div>' +
    '<div style="font-size:11px;color:#555"><strong>Cliente</strong><br>' + (orc.cliente || '') + '</div></div>' +
    '</div>' +
    '<div style="background:' + cor + ';color:#c8e6c9;text-align:center;border-radius:6px;padding:10px;font-size:11px">' +
    '<strong style="color:#fff">' + (emp.nome || 'Sua Marmoraria') + '</strong>' + footerContato +
    '</div>' +
    '<script>window.onload=function(){window.print()}<\/script>' +
    '</body></html>';

  var w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
}
