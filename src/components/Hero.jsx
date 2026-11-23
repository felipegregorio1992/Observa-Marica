import React from 'react'

// pagina: [titulo, subtitulo, descricao, fonte, referencia]
export default function Hero({ pagina }) {
  const [titulo, subtitulo, descricao, fonte, referencia] = pagina || []
  return (
    <div className="hero">
      <div className="marca">
        <div className="marca-simbolo">M</div>
        <div>
          <div className="marca-nome">OBSERVA<br />MARICÁ</div>
          <div className="marca-sub">Observatório Municipal</div>
        </div>
      </div>
      <div>
        <h1>{subtitulo}</h1>
        {descricao && <p>{descricao}</p>}
      </div>
      <div className="hero-ref">
        <div>{fonte}</div>
        <span>{referencia}</span>
      </div>
    </div>
  )
}
