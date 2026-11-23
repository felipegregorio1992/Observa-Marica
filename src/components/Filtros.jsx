import React, { useState } from 'react'
import Selecao from './Selecao.jsx'

// campos: { chave: 'Label' }
// opcoes: { chave: ['op1', 'op2'] }
// filtros: { chave: 'valor_atual' }
export default function Filtros({ campos, opcoes, filtros, onChange }) {
  const [local, setLocal] = useState(filtros || {})

  function aplicar(e) {
    e.preventDefault()
    onChange && onChange(local)
  }

  function limpar(e) {
    e.preventDefault()
    const zerado = Object.fromEntries(Object.keys(campos).map(k => [k, '']))
    setLocal(zerado)
    onChange && onChange(zerado)
  }

  return (
    <form className="formulario" onSubmit={aplicar}>
      {Object.entries(campos).map(([chave, titulo]) => (
        <Selecao
          key={chave}
          nome={chave}
          titulo={titulo}
          opcoes={opcoes[chave] || []}
          valor={local[chave] ?? ''}
          todos={true}
          onChange={val => setLocal(prev => ({ ...prev, [chave]: val }))}
        />
      ))}
      <div className="acoes-filtro">
        <button type="submit" className="botao">Aplicar</button>
        <button type="button" className="botao secundario" onClick={limpar}>Limpar</button>
      </div>
    </form>
  )
}
