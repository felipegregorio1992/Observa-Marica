import React from 'react'
import Papa from 'papaparse'

// ponytail: celula replica a proteção contra injeção de fórmula do Csv.php
// (strings que começam com = + @ - recebem prefixo "'", para o Excel não interpretar como fórmula)
function celula(v) {
  const s = v == null ? '' : String(v)
  if (/^[\s\x00-\x20]*[=+@-]/u.test(s)) return "'" + s
  return s
}

// colunas: string[] — projeta e ordena as colunas (igual ao $colunas do Csv::baixar)
// delimiter: default ',' (Laravel usa ';')
// bom: prependa BOM UTF-8 (Laravel sempre adiciona)
export default function DownloadCsv({ dados, nomeArquivo, rotulo, colunas, delimiter = ',', bom = false }) {
  function baixar() {
    if (!dados || dados.length === 0) return
    const linhas = colunas
      ? dados.map(l => Object.fromEntries(colunas.map(c => [c, celula(l[c])])))
      : dados
    const csv = Papa.unparse(linhas, { delimiter })
    const prefix = bom ? '\uFEFF' : ''
    const blob = new Blob([prefix + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = nomeArquivo || 'dados.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button className="botao secundario" onClick={baixar}>
      {rotulo || 'Baixar CSV'}
    </button>
  )
}
