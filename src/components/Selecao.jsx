import React from 'react'

// opcoes: string[] ou { valor: 'label', ... }
export default function Selecao({ nome, titulo, opcoes, valor, todos = true, onChange }) {
  const entradas = Array.isArray(opcoes)
    ? opcoes.map(o => [o, o])
    : Object.entries(opcoes || {})

  return (
    <label className="campo">
      <span>{titulo}</span>
      <select name={nome} value={valor} onChange={e => onChange && onChange(e.target.value)}>
        {todos && <option value="">Todos</option>}
        {entradas.map(([val, lbl]) => (
          <option key={val} value={val}>{lbl}</option>
        ))}
      </select>
    </label>
  )
}
