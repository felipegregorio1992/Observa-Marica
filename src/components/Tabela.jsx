import React, { useState, useMemo } from 'react'
import { dataBr, numero } from '../utils/dados.js'
import DownloadCsv from './DownloadCsv.jsx'

const NUMERICAS = new Set(['curtidas','comentarios','interacoes','n_base','n_categoria','ordem'])

function normalizar(str) {
  return (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function renderCell(chave, valor, row) {
  if (chave === 'data') return dataBr(valor)
  if (chave === 'link' && valor) return <a href={valor} target="_blank" rel="noopener noreferrer">Abrir publicação</a>
  if (chave === 'url' && valor) return <a href={valor} target="_blank" rel="noopener noreferrer">Abrir</a>
  if (chave === 'fonte' && valor && typeof row?.url === 'string' && row.url.startsWith('https://')) return <a href={row.url} target="_blank" rel="noopener noreferrer">{valor}</a>
  if (NUMERICAS.has(chave) && valor !== '' && valor !== null && valor !== undefined) return numero(Number(valor))
  return valor ?? ''
}

function sortKey(chave, row) {
  const v = row[chave]
  if (chave === 'valor_texto') return parseFloat(row.valor) || 0
  if (NUMERICAS.has(chave)) return parseFloat(v) || 0
  return normalizar(v)
}

// linhas: array of objects
// colunas: { chave: 'Nome' }
// filtros: string[] — column keys that show per-column filter inputs
export default function Tabela({ linhas, colunas, rotulo, tamanho = 10, filtros = [] }) {
  const chaves = Object.keys(colunas || {})
  const [busca, setBusca] = useState('')
  const [colFiltros, setColFiltros] = useState({})
  const [pagina, setPagina] = useState(1)
  const [ordem, setOrdem] = useState({ col: null, dir: 'asc' })

  function toggleOrdem(col) {
    setOrdem(prev => ({
      col,
      dir: prev.col === col && prev.dir === 'asc' ? 'desc' : 'asc',
    }))
    setPagina(1)
  }

  const filtradas = useMemo(() => {
    let r = linhas || []
    const bNorm = normalizar(busca)
    if (bNorm) {
      r = r.filter(row =>
        chaves.some(k => normalizar(String(row[k] ?? '')).includes(bNorm))
      )
    }
    for (const [col, val] of Object.entries(colFiltros)) {
      if (val) r = r.filter(row => normalizar(String(row[col] ?? '')).includes(normalizar(val)))
    }
    return r
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linhas, busca, colFiltros])

  const ordenadas = useMemo(() => {
    if (!ordem.col) return filtradas
    return [...filtradas].sort((a, b) => {
      const ka = sortKey(ordem.col, a)
      const kb = sortKey(ordem.col, b)
      const cmp = typeof ka === 'number' ? ka - kb : String(ka).localeCompare(String(kb), 'pt-BR')
      return ordem.dir === 'asc' ? cmp : -cmp
    })
  }, [filtradas, ordem])

  const total = ordenadas.length
  const totalPag = Math.max(1, Math.ceil(total / tamanho))
  const paginaAtual = Math.min(pagina, totalPag)
  const inicio = (paginaAtual - 1) * tamanho
  const pagina_rows = ordenadas.slice(inicio, inicio + tamanho)

  function ariaSort(col) {
    if (ordem.col !== col) return undefined
    return ordem.dir === 'asc' ? 'ascending' : 'descending'
  }

  return (
    <div className="tabela">
      <div className="tabela-comandos">
        <label className="campo">
          <span>Buscar</span>
          <input
            type="search"
            value={busca}
            onChange={e => { setBusca(e.target.value); setPagina(1) }}
            placeholder={`Buscar em ${rotulo || 'tabela'}…`}
          />
        </label>
        <DownloadCsv dados={filtradas} nomeArquivo={`${rotulo || 'dados'}.csv`} rotulo="Baixar CSV" />
      </div>
      <div className="tabela-rolagem">
        <table>
          <thead>
            <tr>
              {chaves.map(k => (
                <th key={k} aria-sort={ariaSort(k)}>
                  <button onClick={() => toggleOrdem(k)}>{colunas[k]}</button>
                </th>
              ))}
            </tr>
            {filtros.length > 0 && (
              <tr>
                {chaves.map(k => (
                  <td key={k}>
                    {filtros.includes(k)
                      ? <input
                          data-filtro-coluna=""
                          type="search"
                          value={colFiltros[k] || ''}
                          onChange={e => { setColFiltros(prev => ({ ...prev, [k]: e.target.value })); setPagina(1) }}
                          placeholder="filtrar…"
                        />
                      : null}
                  </td>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {pagina_rows.length === 0
              ? <tr><td colSpan={chaves.length} style={{ textAlign: 'center', color: '#64757d' }}>Nenhum resultado</td></tr>
              : pagina_rows.map((row, i) => (
                <tr key={i}>
                  {chaves.map(k => (
                    <td key={k} className={k === 'titulo' || k === 'descricao' ? 'col-texto' : ''}>
                      {renderCell(k, row[k], row)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="paginacao">
        <p>{total === 0 ? 'Nenhum resultado' : `${inicio + 1}–${Math.min(inicio + tamanho, total)} de ${numero(total)}`}</p>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="botao secundario" disabled={paginaAtual <= 1} onClick={() => setPagina(p => p - 1)}>‹</button>
          <button className="botao secundario" disabled={paginaAtual >= totalPag} onClick={() => setPagina(p => p + 1)}>›</button>
        </div>
      </div>
    </div>
  )
}
