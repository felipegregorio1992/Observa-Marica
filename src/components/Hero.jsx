import React from 'react'

// pagina: [titulo, subtitulo, descricao, fonte, referencia]
export default function Hero({ pagina }) {
  const [titulo, subtitulo, descricao] = pagina || []
  return (
    <div className="hero">
      <div className="marca">
      </div>
      <div>
        <h1>{subtitulo}</h1>
        {descricao && <p>{descricao}</p>}
      </div>
    </div>
  )
}
