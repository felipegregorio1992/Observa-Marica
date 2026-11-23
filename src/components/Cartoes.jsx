import React from 'react'

const CORES = ['#007984','#be256f','#47822b','#277984','#906500','#ad3d37']
const CHIPS = {
  'OFICIAL': 'oficial',
  'DERIVADO': 'derivado',
  'A PRODUZIR': 'produzir',
  'PARCIAL': 'parcial',
  'INSTITUCIONAL': 'parcial',
  'PESQUISA': 'derivado',
}

// itens: Array<[titulo, valor, detalhe, classe]>
export default function Cartoes({ itens }) {
  if (!itens || itens.length === 0) return null
  return (
    <dl className="metrics">
      {itens.map(([titulo, valor, detalhe, classe], i) => (
        <div key={i} className="metric" style={{ '--accent': CORES[i % CORES.length] }}>
          {classe && <span className={`chip ${CHIPS[classe] || 'parcial'}`}>{classe}</span>}
          <dt className="metric-title">{titulo}</dt>
          <dd className="metric-value">{valor}</dd>
          {detalhe && <dd className="metric-sub">{detalhe}</dd>}
        </div>
      ))}
    </dl>
  )
}
