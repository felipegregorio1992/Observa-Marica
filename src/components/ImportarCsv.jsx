import React, { useState, useRef } from 'react'
import Papa from 'papaparse'
import { CAMPOS, FORMATOS, processarPost } from '../utils/instagram.js'
import { tema as classificarTema } from '../utils/instagram.js'

export default function ImportarCsv({ onImportado, onErro, regrasThema }) {
  const [aviso, setAviso] = useState(null)
  const inputRef = useRef(null)

  function processar(e) {
    const arquivo = e.target.files[0]
    if (!arquivo) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const texto = ev.target.result
        // detect separator
        const separador = texto.includes(';') && !texto.includes(',') ? ';' : ','
        const { data, errors } = Papa.parse(texto, { header: true, skipEmptyLines: true, delimiter: separador })
        if (errors.length > 0 && data.length === 0) throw new Error('Erro ao parsear CSV: ' + errors[0].message)

        const headers = Object.keys(data[0] || {})
        // map columns via aliases
        const mapa = {}
        for (const [campo, apelidos] of Object.entries(CAMPOS)) {
          const encontrado = headers.find(h => apelidos.includes(h.toLowerCase().trim()))
          if (encontrado) mapa[campo] = encontrado
        }
        if (!mapa.data) throw new Error('Campo obrigatório "data" não encontrado')
        if (!mapa.tipo) throw new Error('Campo obrigatório "tipo" não encontrado')

        const posts = data.map((row, idx) => {
          const post = {}
          for (const [campo, origem] of Object.entries(mapa)) {
            post[campo] = row[origem] ?? ''
          }
          // normalize tipo
          const tipoNorm = FORMATOS[(post.tipo || '').toLowerCase().trim()]
          if (tipoNorm) post.tipo = tipoNorm
          // apply tema if not set
          if ((!post.tema || post.tema === '') && regrasThema) {
            post.tema = classificarTema(post.titulo || '', regrasThema)
          }
          return processarPost(post)
        }).filter(p => p.data)

        setAviso({ tipo: 'sucesso', msg: `${posts.length} publicações importadas.` })
        onImportado && onImportado(posts)
      } catch (err) {
        setAviso({ tipo: 'erro', msg: err.message })
        onErro && onErro(err.message)
      }
    }
    reader.readAsText(arquivo)
  }

  return (
    <div className="upload-strip">
      <div className="campo">
        <span>Importar CSV de publicações</span>
        <input type="file" accept=".csv" ref={inputRef} onChange={processar} />
      </div>
      {aviso && (
        <div className={`aviso ${aviso.tipo}`}>{aviso.msg}</div>
      )}
      <p className="small-note">
        Aceita CSV exportado do Instagram (vírgula ou ponto-e-vírgula). Campos obrigatórios: data, tipo.
      </p>
    </div>
  )
}
