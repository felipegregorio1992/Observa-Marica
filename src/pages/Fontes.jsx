import React, { useMemo } from 'react'
import { useMultiCsv } from '../hooks/useMultiCsv.js'
import { SECOES } from '../components/Layout.jsx'
import Hero from '../components/Hero.jsx'
import Painel from '../components/Painel.jsx'
import Comunicados from '../components/Comunicados.jsx'
import Tabela from '../components/Tabela.jsx'
import DownloadCsv from '../components/DownloadCsv.jsx'
import { numero } from '../utils/dados.js'

// ponytail: replica a derivação de valor_texto do PHP: casas = dígitos após o '.'
// "212703" → 0 casas, "361.572" → 3 casas, "545.61" → 2 casas. numero() re-formata em pt-BR.
function valorTextoIndicador(ind) {
  const v = ind.valor
  if (v === null || v === undefined || v === '') return v ?? ''
  if (!isFinite(Number(v))) return v
  const str = String(v)
  const dot = str.indexOf('.')
  const casas = dot >= 0 ? str.length - dot - 1 : 0
  return numero(Number(v), casas)
}

export default function Fontes() {
  const { dados, carregando, erro } = useMultiCsv({
    fontes: 'fontes_atualizadas',
    indicadores: 'indicadores_oficiais',
    comunicados: 'comunicados_oficiais',
  })

  const indicadores = useMemo(() => {
    if (!dados?.indicadores) return []
    return dados.indicadores.map(ind => ({ ...ind, valor_texto: valorTextoIndicador(ind) }))
  }, [dados])

  if (carregando) return <p style={{ padding: 20 }}>Carregando dados…</p>
  if (erro) return <p style={{ padding: 20, color: 'red' }}>Erro: {erro}</p>

  return (
    <>
      <Hero pagina={SECOES.fontes} />

      <Painel titulo="Atualizações da Prefeitura e da MARÉ" subtitulo="Programação anunciada para 2026">
        <Comunicados itens={dados.comunicados} />
      </Painel>

      <Painel titulo="Indicadores territoriais" subtitulo="A referência estatística acompanha cada valor.">
        <Tabela
          linhas={indicadores}
          colunas={{
            indicador: 'Indicador',
            valor_texto: 'Valor',
            unidade: 'Unidade',
            ano_referencia: 'Referência',
            fonte: 'Fonte',
            observacao: 'Nota',
          }}
          rotulo="indicadores territoriais"
        />
      </Painel>

      <Painel titulo="Fontes do TCC e portais oficiais">
        <DownloadCsv dados={dados.fontes} nomeArquivo="fontes.csv" rotulo="Baixar registro da consulta" />
        <details open className="lista-fontes">
          <summary>Consultar fontes</summary>
          <div className="sources-grid">
            {(dados.fontes || []).map((fonte, i) => (
              <article key={i} className="source-box">
                {fonte.situacao && <p className="small-note">{fonte.situacao}</p>}
                <h3>
                  {fonte.url
                    ? <a href={fonte.url} target="_blank" rel="noopener noreferrer">{fonte.fonte}</a>
                    : fonte.fonte}
                </h3>
                <p>{[fonte.abrangencia, fonte.referencia].filter(Boolean).join(' · ')}</p>
                {fonte.achado && <p>{fonte.achado}</p>}
              </article>
            ))}
          </div>
        </details>
      </Painel>
    </>
  )
}
