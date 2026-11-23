import React, { useState, useMemo } from 'react'
import { useMultiCsv } from '../hooks/useMultiCsv.js'
import { SECOES } from '../components/Layout.jsx'
import Hero from '../components/Hero.jsx'
import Cartoes from '../components/Cartoes.jsx'
import Grafico from '../components/Grafico.jsx'
import Painel from '../components/Painel.jsx'
import Tabela from '../components/Tabela.jsx'
import DownloadCsv from '../components/DownloadCsv.jsx'
import { numero, contagens, soma, dataBr } from '../utils/dados.js'
import { recorte, processarPost } from '../utils/instagram.js'
import { comunicacao, barras } from '../utils/graficos.js'

const COLUNAS_EXPORT = ['id_publicacao','data','dia_semana','tipo','titulo','resumo','tema','curtidas','comentarios','interacoes','hashtags','link','fonte','tipo_dado']

export default function Noticias() {
  const { dados, carregando, erro } = useMultiCsv({
    posts: 'noticias_instagram_mare',
    qualidade: 'qualidade_instagram',
  })

  const [filtros, setFiltros] = useState({})

  const posts = useMemo(() => (dados?.posts ?? []).map(processarPost), [dados])

  const { linhas, opcoes } = useMemo(() => recorte(posts, filtros), [posts, filtros])

  const qualidade = dados?.qualidade?.[0] ?? {}

  const totalInt = useMemo(() => soma(linhas, 'interacoes') ?? 0, [linhas])
  const mediaPub = useMemo(() => linhas.length ? totalInt / linhas.length : 0, [linhas, totalInt])

  const cartoes = [
    ['Publicações', numero(linhas.length), 'No período filtrado', 'INSTITUCIONAL'],
    ['Curtidas', numero(soma(linhas, 'curtidas') ?? 0), 'Total de curtidas', 'DERIVADO'],
    ['Comentários', numero(soma(linhas, 'comentarios') ?? 0), 'Total de comentários', 'DERIVADO'],
    ['Interações', numero(totalInt), 'Curtidas + comentários', 'DERIVADO'],
    ['Média/publicação', numero(mediaPub, 1), 'Interações médias', 'DERIVADO'],
    ['Temas identificados', numero(Object.keys(contagens(linhas, 'tema')).length), 'Categorias distintas', 'DERIVADO'],
  ]

  if (carregando) return <p style={{ padding: 20 }}>Carregando dados…</p>
  if (erro) return <p style={{ padding: 20, color: 'red' }}>Erro: {erro}</p>

  return (
    <>
      <Hero pagina={SECOES.noticias} />

      <p className="note">As métricas descrevem as curtidas e os comentários registrados na data da coleta. Alcance, conversão e impactos exigem dados próprios.</p>

      <div className="panel" style={{ marginBottom: 12 }}>
        <div className="formulario">
          <label className="campo">
            <span>Data inicial</span>
            <input type="date" value={filtros.inicio || ''} onChange={e => setFiltros(f => ({ ...f, inicio: e.target.value }))} />
          </label>
          <label className="campo">
            <span>Data final</span>
            <input type="date" value={filtros.fim || ''} onChange={e => setFiltros(f => ({ ...f, fim: e.target.value }))} />
          </label>
          <label className="campo">
            <span>Formato</span>
            <select value={filtros.tipo || ''} onChange={e => setFiltros(f => ({ ...f, tipo: e.target.value }))}>
              <option value="">Todos</option>
              {(opcoes.tipo || []).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="campo">
            <span>Tema</span>
            <select value={filtros.tema || ''} onChange={e => setFiltros(f => ({ ...f, tema: e.target.value }))}>
              <option value="">Todos</option>
              {(opcoes.tema || []).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="campo">
            <span>Ordenar por</span>
            <select value={filtros.ordem || 'data'} onChange={e => setFiltros(f => ({ ...f, ordem: e.target.value }))}>
              <option value="data">Mais recentes</option>
              <option value="interacoes">Mais interações</option>
            </select>
          </label>
          <div className="acoes-filtro">
            <button className="botao" onClick={() => setFiltros({ ...filtros })}>Aplicar filtros</button>
            <button className="botao secundario" onClick={() => setFiltros({})}>Limpar</button>
          </div>
        </div>
      </div>

      <Cartoes itens={cartoes} />

      <div className="grade dois-um">
        <Painel titulo="Publicações e interações por mês" rodape="A série mensal usa as datas da base selecionada.">
          <Grafico figura={comunicacao(linhas)} rotulo="Publicações e interações mensais do recorte" altura={340} />
        </Painel>
        <Painel titulo="Distribuição por tema" subtitulo="Classificação exploratória por hashtags e palavras-chave">
          <Grafico figura={barras(contagens(linhas, 'tema'))} rotulo="Publicações por tema no recorte" altura={340} />
        </Painel>
      </div>

      <Painel titulo="Publicações em destaque">
        {linhas.length === 0
          ? <p>Nenhuma publicação corresponde aos filtros.</p>
          : <div className="news-grid">
              {linhas.slice(0, 9).map((p, i) => (
                <article key={i} className="news-card">
                  <div className="news-card-head">
                    <span className="news-tag">{p.tema}</span>
                    <time className="news-card-date" dateTime={p.data}>{dataBr(p.data)}</time>
                  </div>
                  {p.link
                    ? <a className="news-card-title" href={p.link} target="_blank" rel="noopener noreferrer">{p.titulo}</a>
                    : <p className="news-card-title">{p.titulo}</p>}
                  {p.resumo && <p className="news-summary">{p.resumo}</p>}
                  <div className="news-stats">
                    <span>{p.tipo}</span>
                    <span>{numero(p.curtidas)} curtidas</span>
                    <span>{numero(p.comentarios)} comentários</span>
                  </div>
                </article>
              ))}
            </div>
        }
      </Painel>

      <Painel
        titulo="Base de notícias e comunicação pública"
        rodape="Fonte institucional: canal oficial da MARÉ no Instagram. A data é a da publicação."
      >
        <DownloadCsv
          dados={linhas}
          nomeArquivo="observa_marica_instagram_filtrado.csv"
          rotulo="Baixar publicações filtradas"
          colunas={COLUNAS_EXPORT}
          delimiter=";"
          bom={true}
        />
        <Tabela
          linhas={linhas}
          colunas={{ data:'Data', tipo:'Formato', tema:'Tema', titulo:'Publicação', curtidas:'Curtidas', comentarios:'Comentários', interacoes:'Interações', hashtags:'Hashtags', link:'Link' }}
          rotulo="publicações"
          tamanho={15}
          filtros={['tipo', 'tema', 'titulo', 'hashtags']}
        />
      </Painel>

      {qualidade.publicacoes && (
        <details className="conferencia">
          <summary>Conferência da base · {qualidade.arquivo}</summary>
          <p className="small-note">
            {numero(qualidade.publicacoes)} publicações,{' '}
            {numero(qualidade.linhas_sem_publicacao)} linhas sem data ou formato e{' '}
            {numero(qualidade.sem_link)} publicações sem link válido.{' '}
            {numero(qualidade.comentarios_reconstituidos)} comentários recuperados por diferença,{' '}
            {numero(qualidade.duplicatas)} duplicatas ignoradas,{' '}
            {numero(qualidade.interacoes_recalculadas)} interações preenchidas e{' '}
            {numero(qualidade.divergencias)} divergências recalculadas.
          </p>
        </details>
      )}
    </>
  )
}
