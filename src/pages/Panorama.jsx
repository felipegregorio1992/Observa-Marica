import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useMultiCsv } from '../hooks/useMultiCsv.js'
import { SECOES } from '../components/Layout.jsx'
import Hero from '../components/Hero.jsx'
import Cartoes from '../components/Cartoes.jsx'
import Grafico from '../components/Grafico.jsx'
import Painel from '../components/Painel.jsx'
import { numero, contagens, addStatusGrupo, completude, dataBr } from '../utils/dados.js'
import { destaque } from '../utils/pesquisas.js'
import { demografia, comunicacao, colunas, barras, maturidade, eventosPorMes, AZUL, SITUACOES } from '../utils/graficos.js'

export default function Panorama() {
  const { dados, carregando, erro } = useMultiCsv({
    demografica: 'linha_base_demografica',
    indicadores: 'indicadores_oficiais',
    eventos: 'eventos_oficiais_2026',
    equipamentos: 'equipamentos_oficiais',
    matriz: 'matriz_indicadores_tcc',
    posts: 'noticias_instagram_mare',
    pesquisas: 'resultados_pesquisas',
    bases: 'bases_pesquisas',
  })

  const equip = useMemo(() => dados ? addStatusGrupo(dados.equipamentos) : [], [dados])

  const indMap = useMemo(() => {
    if (!dados) return {}
    return Object.fromEntries(dados.indicadores.map(r => [r.indicador, r]))
  }, [dados])

  const popEstimada = indMap['População estimada']
  const popValor = popEstimada ? numero(parseFloat(popEstimada.valor)) : '—'

  const crescimento = useMemo(() => {
    if (!dados) return '—'
    const d = dados.demografica
    const pop2010 = d.find(r => r.ano === '2010')
    const pop2022 = d.find(r => r.ano === '2022')
    if (!pop2010 || !pop2022) return '—'
    const pct = (parseInt(pop2022.populacao) / parseInt(pop2010.populacao) - 1) * 100
    return numero(pct, 2) + '%'
  }, [dados])

  const matDisp = useMemo(() => dados ? (contagens(dados.matriz, 'disponibilidade')['Disponível'] || 0) : 0, [dados])

  const nexus = useMemo(() => {
    if (!dados) return []
    const dest = (cat) => destaque(dados.pesquisas, 'nexus_relatorio', cat)
    return [
      ['Entrevistas', dest('Tamanho da amostra'), 'Nexus · 2026', 'PESQUISA'],
      ['Destino positivo', dest('Avaliação positiva do destino'), 'Avaliação do destino', 'PESQUISA'],
      ['Infraestrutura positiva', dest('Avaliação positiva da infraestrutura'), 'Avaliação de infraestrutura', 'PESQUISA'],
      ['Retorno certo/provável', dest('Retorno certo ou provável'), 'Intenção de retorno', 'PESQUISA'],
      ['NPS', dest('NPS publicado'), 'Net Promoter Score', 'PESQUISA'],
      ['Interesse em eventos', dest('Interesse em eventos'), 'Programação', 'PESQUISA'],
    ]
  }, [dados])

  const natal = useMemo(() => {
    if (!dados) return {}
    return [
      [destaque(dados.pesquisas, 'natal_publico',  'Entrevistas com frequentadores'), 'Entrevistas com frequentadores'],
      [destaque(dados.pesquisas, 'natal_comercio', 'Empreendimentos consultados'),    'Empreendimentos consultados'],
      [destaque(dados.pesquisas, 'natal_comercio', 'Faturamento menor'),              'Faturamento menor'],
    ]
  }, [dados])

  const postsRecentes = useMemo(() => {
    if (!dados) return []
    return [...dados.posts].sort((a, b) => (b.data > a.data ? 1 : -1)).slice(0, 5)
  }, [dados])

  const totalInteracoes = useMemo(() => dados ? numero(dados.posts.reduce((s, p) => s + (Number(p.interacoes) || 0), 0)) : '—', [dados])

  const periodo = useMemo(() => {
    if (!dados || dados.posts.length === 0) return ['—', '—']
    const datas = dados.posts.map(p => p.data).filter(Boolean).sort()
    return [dataBr(datas[0]), dataBr(datas[datas.length - 1])]
  }, [dados])

  const completudeCalc = useMemo(() => {
    if (!dados) return {}
    return completude(dados.eventos, equip, dados.indicadores, dados.posts)
  }, [dados, equip])

  if (carregando) return <p style={{ padding: 20 }}>Carregando dados…</p>
  if (erro) return <p style={{ padding: 20, color: 'red' }}>Erro: {erro}</p>

  const cartoes = [
    ['População estimada', popValor, 'IBGE · 1º/07/2026', 'OFICIAL'],
    ['Crescimento', crescimento, 'Censo · 2010–2022', 'DERIVADO'],
    ['Eventos 2026', numero(dados.eventos.length), 'Calendário oficial de 2026', 'OFICIAL'],
    ['Equipamentos', numero(equip.length), 'Base MARÉ · abril de 2026', 'OFICIAL'],
    ['Indicadores disponíveis', numero(matDisp), 'Matriz de 38 indicadores', 'DERIVADO'],
    ['Publicações', numero(dados.posts.length), 'Instagram oficial da MARÉ', 'INSTITUCIONAL'],
  ]

  return (
    <>
      <Hero pagina={SECOES.panorama} />
      <Cartoes itens={cartoes} />

      <div className="grade tres">
        <Painel
          titulo="Evolução demográfica"
          subtitulo="Censos e estimativas em séries identificadas"
          rodape="IBGE. A população de 2010 está compatibilizada aos limites de 2022."
        >
          <Grafico figura={demografia(dados.demografica)} rotulo="População de Maricá nos censos e nas estimativas" altura={274} />
        </Painel>
        <Painel
          titulo="Programação anual"
          subtitulo="Registros do Calendário Oficial de Eventos de 2026"
          rodape="Programação cadastrada no DOM de 12/03/2026."
        >
          <Grafico figura={colunas(eventosPorMes(dados.eventos))} rotulo="Eventos do calendário por mês" altura={274} />
        </Painel>
        <Painel titulo="Notícias recentes da MARÉ" subtitulo="Publicações mais recentes na base do Instagram">
          {postsRecentes.map((p, i) => (
            <article key={i} className="news-row">
              <time className="news-date" dateTime={p.data}>{dataBr(p.data)}</time>
              <div>
                {p.link
                  ? <a className="news-title" href={p.link} target="_blank" rel="noopener noreferrer">{p.titulo}</a>
                  : <span className="news-title">{p.titulo}</span>}
                <div className="news-meta">{p.tipo} · {p.tema}</div>
              </div>
            </article>
          ))}
          <Link className="mais" to="/noticias">Consultar publicações</Link>
        </Painel>
      </div>

      <Painel
        titulo="Comunicação pública no canal oficial da MARÉ"
        subtitulo={`${numero(dados.posts.length)} publicações entre ${periodo[0]} e ${periodo[1]} · ${totalInteracoes} interações`}
        rodape="Interações correspondem a curtidas e comentários registrados na base."
      >
        <Grafico figura={comunicacao(dados.posts)} rotulo="Publicações e interações mensais no Instagram da MARÉ" altura={290} />
      </Painel>

      <div className="section-heading">
        <div>
          <h2>Pesquisa Nexus · turistas 2026</h2>
          <p>Relatório executivo · 23 a 27 de maio de 2026</p>
        </div>
        <Link to="/nexus">Consultar pesquisa</Link>
      </div>
      <Cartoes itens={nexus} />
      <p className="small-note">A consulta à Nexus identifica a origem dos resultados publicados e dos cálculos sem pesos da mesma rodada.</p>

      <section className="section-snapshot">
        <div>
          <h2>Natal Brasilidade 2025</h2>
          <p>Pesquisas do IDR com público e comércio</p>
          <Link to="/natal">Consultar pesquisas</Link>
        </div>
        {natal.map(([valor, rotulo], i) => (
          <div key={i} className="snapshot-value">
            <strong>{valor}</strong>
            <span>{rotulo}</span>
          </div>
        ))}
      </section>

      <div className="grade duas">
        <Painel titulo="Equipamentos por situação" subtitulo="Cadastro da MARÉ de abril de 2026">
          <Grafico figura={barras(contagens(equip, 'status_grupo'), SITUACOES)} rotulo="Equipamentos por situação" />
        </Painel>
        <Painel titulo="Maturidade da matriz" subtitulo="38 indicadores em 11 eixos">
          <Grafico figura={maturidade(dados.matriz)} rotulo="Indicadores disponíveis, parciais e a produzir" />
        </Painel>
      </div>

      <Painel titulo="Qualidade das bases" subtitulo="Completude dos campos selecionados para o protótipo">
        <Grafico figura={barras(completudeCalc, AZUL, true)} rotulo="Completude das quatro bases prioritárias" altura={260} />
      </Painel>
    </>
  )
}
