import React from 'react'

const STATUS_CLASSE = {
  'Disponível': 'disponivel',
  'Parcial': 'parcial',
  'A produzir': 'produzir',
}

// matriz: rows from matriz_indicadores_tcc.csv
// eixos: string[] — filter by dimensao
export default function Indicadores({ matriz, eixos }) {
  if (!matriz || !eixos) return null
  const linhas = matriz.filter(l => eixos.some(e => (l.dimensao || '').includes(e)))
  if (linhas.length === 0) return null

  return (
    <div>
      {linhas.map((l, i) => (
        <div key={i} className="indicator-status">
          <div>
            <div className="indicator-name">{l.indicador}</div>
            {l.nota_metodologica && <div className="indicator-note">{l.nota_metodologica}</div>}
          </div>
          <span className={`status-label status-${STATUS_CLASSE[l.disponibilidade] || 'produzir'}`}>
            {l.disponibilidade}
          </span>
        </div>
      ))}
    </div>
  )
}
