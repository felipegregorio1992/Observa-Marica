import React from 'react'

export default function Comunicados({ itens }) {
  if (!itens || itens.length === 0) return null
  return (
    <div>
      {itens.map((item, i) => (
        <article key={i} className="source-box">
          <h3>
            {item.url
              ? <a href={item.url} target="_blank" rel="noopener noreferrer">{item.titulo}</a>
              : item.titulo}
          </h3>
          {item.periodo && <p><strong>{item.periodo}</strong></p>}
          {item.descricao && <p>{item.descricao}</p>}
        </article>
      ))}
    </div>
  )
}
