import React from 'react'

export default function Painel({ titulo, subtitulo, rodape, children, className }) {
  return (
    <section className={`panel${className ? ' ' + className : ''}`}>
      {titulo && <h2 className="panel-title">{titulo}</h2>}
      {subtitulo && <p className="panel-sub">{subtitulo}</p>}
      {children}
      {rodape && <div className="panel-foot">{rodape}</div>}
    </section>
  )
}
