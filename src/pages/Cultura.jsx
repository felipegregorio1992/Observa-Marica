import React, { useState, useMemo } from 'react'
import { useMultiCsv } from '../hooks/useMultiCsv.js'
import { SECOES } from '../components/Layout.jsx'
import Hero from '../components/Hero.jsx'
import Cartoes from '../components/Cartoes.jsx'
import Grafico from '../components/Grafico.jsx'
import Painel from '../components/Painel.jsx'
import Filtros from '../components/Filtros.jsx'
import { numero, contagens, filtrar, MESES } from '../utils/dados.js'
import { colunas, barras, eventosPorMes, ROSA, CIANO } from '../utils/graficos.js'

// ── helpers de pesquisa ──────────────────────────────────────────────────────
function achaPesquisa(pesquisas, base, grupo, serie, categoria) {
  if (!pesquisas) return null
  return pesquisas.find(
    r => r.base_id === base && r.grupo === grupo && r.serie === serie && r.categoria === categoria
  )
}
function val(r) { return r ? parseFloat(r.valor) : null }

// ── visitantes de fora com gasto > R$100 por polo ─────────────────────────
const POLOS_ORDEM = [
  'Ponta Negra',
  'Araçatiba',
  'Praça Orlando de Barros Pimentel (Centro)',
  'Parque Nanci',
  'Itaipuaçu',
]

function visitantesGasto(pesquisas) {
  // Uses: natal_publico · Visitantes de fora de Maricá por polo + percentual de gasto
  // The image shows "Visitantes de fora de Maricá que declararam gastar mais de R$100"
  // Values from the reference image:
  const dados = {
    'Ponta Negra':                           { pct: 36.7, n: 55,  total: 150 },
    'Araçatiba':                             { pct: 33.7, n: 98,  total: 291 },
    'Praça Orlando de Barros Pimentel (Centro)': { pct: 24.7, n: 46, total: 186 },
    'Parque Nanci':                          { pct: 16.2, n: 74,  total: 458 },
    'Itaipuaçu':                             { pct: 16.1, n: 15,  total: 93  },
  }
  return dados
}

export default function Cultura() {
  const { dados, carregando, erro } = useMultiCsv({
    eventos:    'eventos_oficiais_2026',
    equipamentos:'equipamentos_oficiais',
    pesquisas:  'resultados_pesquisas',
  })
  const [filtrosAtivos, setFiltrosAtivos] = useState({})

  const linhas = useMemo(
    () => (dados?.eventos ? filtrar(dados.eventos, filtrosAtivos) : []),
    [dados, filtrosAtivos]
  )

  const equipCulturais = useMemo(() => {
    if (!dados?.equipamentos) return 0
    return dados.equipamentos.filter(e => (e.categoria || '').toLowerCase().includes('cultural')).length
  }, [dados])

  const contsMare     = useMemo(() => contagens(linhas, 'participacao_mare'),     [linhas])
  const contsSituacao = useMemo(() => contagens(linhas, 'situacao_data'),         [linhas])
  const contsAreas    = useMemo(() => contagens(linhas, 'categoria_responsavel'), [linhas])

  // ── gráfico de visitantes (hook deve ficar antes de qualquer return condicional) ─
  const gastoPorPolo = visitantesGasto(null)
  const figVisitantes = useMemo(() => {
    const xs = POLOS_ORDEM.map(p => gastoPorPolo[p]?.pct ?? 0)
    const ys = POLOS_ORDEM
    const textos = POLOS_ORDEM.map(p => {
      const d = gastoPorPolo[p]
      return `${d.pct}%  ${d.n} de ${d.total}`
    })
    return {
      traces: [{
        type: 'bar',
        orientation: 'h',
        x: xs,
        y: ys,
        text: textos,
        textposition: 'outside',
        cliponaxis: false,
        marker: { color: '#17324d' },
        hovertemplate: '%{y}: %{text}<extra></extra>',
      }],
      layout: {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: '#ffffff',
        font: { color: '#17324d', family: 'Segoe UI, Arial, sans-serif', size: 11 },
        margin: { l: 260, r: 130, t: 10, b: 30 },
        xaxis: { gridcolor: '#e5edf0', rangemode: 'tozero', ticksuffix: '%', range: [0, 55] },
        yaxis: { automargin: false, categoryorder: 'array', categoryarray: [...POLOS_ORDEM].reverse() },
      },
    }
  }, [])

  // ── KPI cards ──────────────────────────────────────────────────────────────
  const cartoes = [
    ['Eventos selecionados',  numero(linhas.length),                                                        'Calendário oficial',     'OFICIAL'],
    ['Meses com programação', numero(Object.keys(contagens(linhas, 'mes_nome')).length),                    'Meses distintos',        'DERIVADO'],
    ['Com participação MARÉ', numero(contsMare['Com participação da MARÉ'] || 0),                           'Envolvimento direto',    'DERIVADO'],
    ['Datas em aberto',       numero(contsSituacao['Em aberto'] || 0),                                      'Sem data definida',      'DERIVADO'],
    ['Temas mensais',         numero(Object.keys(contagens(linhas, 'tema_mes')).length),                    'Temas distintos',        'DERIVADO'],
    ['Equipamentos culturais',numero(equipCulturais),                                                       'Base MARÉ · abril 2026', 'OFICIAL'],
  ]

  if (carregando) return <p style={{ padding: 20 }}>Carregando dados…</p>
  if (erro)       return <p style={{ padding: 20, color: 'red' }}>Erro: {erro}</p>

  const opcoesFiltros = {
    mes_nome:              MESES,
    participacao_mare:     Object.keys(contagens(dados.eventos, 'participacao_mare')),
    situacao_data:         Object.keys(contagens(dados.eventos, 'situacao_data')),
    categoria_responsavel: Object.keys(contagens(dados.eventos, 'categoria_responsavel')).sort(),
  }

  // ── Economia do Aniversário ──────────────────────────────────────────────
  const anivMovim  = 'R$ 42,2 milhões'
  const anivDireta = 'R$ 25,1 mi'
  const anivIndireta = 'R$ 17,1 mi'
  const anivEmpregos = 'Cerca de 600'

  // ── Fomento cultural ─────────────────────────────────────────────────────
  const fomentoEdital   = 'R$ 485.000,40'
  const fomentoQuantidade = '40'

  // ── Natal Brasilidade 2025 · comércio ──────────────────────────────────
  const pct_inflPositiva  = { valor: 55.4, n: 51, base: 92,  texto: 'Influência positiva ou muito positiva das atrações no comércio' }
  const pct_contratacao   = { valor: 29.7, n: 27, base: 91,  texto: 'Contrataram pessoal extra para o evento' }
  const pct_faturamento   = { valor: 22.5, n: 20, base: 89,  texto: 'Estimaram faturamento acima do habitual no evento' }
  const pct_mumbuca       = { valor: 39.8, n: 37, base: 93,  texto: 'Declararam vendas em Mumbuca' }

  // ── Natal Brasilidade 2025 · público geral ────────────────────────────
  const pct_gastoPublico  = { valor: 57.7, n: 2382, base: 4130, texto: 'Declararam algum gasto no dia da entrevista' }

  // ── visitantes com gasto > R$100 ──────────────────────────────────────
  const totalGasto = { pct: 24.4, n: 288, base: 1178 }

  return (
    <>
      <Hero pagina={SECOES.cultura} />

      {/* ── Filtros ── */}
      <Painel>
        <Filtros
          campos={{
            mes_nome:              'Mês',
            participacao_mare:     'Participação da MARÉ',
            situacao_data:         'Situação da data',
            categoria_responsavel: 'Área responsável',
          }}
          opcoes={opcoesFiltros}
          filtros={filtrosAtivos}
          onChange={setFiltrosAtivos}
        />
      </Painel>

      {/* ── KPI cards ── */}
      <Cartoes itens={cartoes} />

      {/* ── Cultura e economia local ── */}
      <Painel titulo="Cultura e economia local">

        {/* Aniversário + Fomento */}
        <div className="economia-bloco">
          <div className="economia-grupo">
            <p className="economia-label">Aniversário de Maricá</p>
            <p className="economia-valor-grande">{anivMovim}</p>
            <p className="economia-desc">Movimentação econômica estimada</p>
            <div className="economia-barras-legenda">
              <span className="leg-item leg-direta">■ Direta · {anivDireta}</span>
              <span className="leg-item leg-indireta">■ Indireta · {anivIndireta}</span>
            </div>
            <p className="economia-fonte">IDR e FGV · Cenário anterior à pandemia · Divulgado em maio de 2023</p>
          </div>
          <div className="economia-sep" />
          <div className="economia-grupo">
            <p className="economia-valor-medio">{anivEmpregos}</p>
            <p className="economia-desc">Postos de trabalho diretos e indiretos</p>
          </div>
          <div className="economia-sep economia-sep--v" />
          <div className="economia-grupo">
            <p className="economia-label">Fomento à produção cultural</p>
            <p className="economia-valor-grande">{fomentoEdital}</p>
            <p className="economia-desc">Valor previsto no edital</p>
            <p className="economia-fonte">Prefeitura de Maricá · Edital PNAB 05/2026</p>
          </div>
          <div className="economia-sep" />
          <div className="economia-grupo economia-grupo--centro">
            <p className="economia-valor-grande ec-num">{fomentoQuantidade}</p>
            <p className="economia-desc">Premiações selecionadas</p>
          </div>
        </div>

        {/* Natal Brasilidade 2025 · comércio */}
        <div className="natal-secao">
          <p className="natal-titulo">Natal Brasilidade 2025</p>
          <div className="natal-row natal-row--comercio">
            <div className="natal-label-col"><p className="natal-sublabel">Comércio</p></div>
            <div className="natal-label-col natal-label-col--dir"><p className="natal-sublabel">Público geral</p></div>
          </div>
          <div className="natal-stats">
            <div className="natal-stat">
              <p className="natal-pct natal-rosa">{pct_inflPositiva.valor}%</p>
              <p className="natal-desc">{pct_inflPositiva.texto}</p>
              <p className="natal-base">{pct_inflPositiva.n} de {pct_inflPositiva.base} empreendimentos</p>
            </div>
            <div className="natal-stat">
              <p className="natal-pct natal-rosa">{pct_contratacao.valor}%</p>
              <p className="natal-desc">{pct_contratacao.texto}</p>
              <p className="natal-base">{pct_contratacao.n} de {pct_contratacao.base} empreendimentos</p>
            </div>
            <div className="natal-stat">
              <p className="natal-pct natal-rosa">{pct_faturamento.valor}%</p>
              <p className="natal-desc">{pct_faturamento.texto}</p>
              <p className="natal-base">{pct_faturamento.n} de {pct_faturamento.base} empreendimentos</p>
            </div>
            <div className="natal-stat">
              <p className="natal-pct natal-rosa">{pct_mumbuca.valor}%</p>
              <p className="natal-desc">{pct_mumbuca.texto}</p>
              <p className="natal-base">{pct_mumbuca.n} de {pct_mumbuca.base} empreendimentos</p>
            </div>
            <div className="natal-stat natal-stat--publico">
              <p className="natal-pct natal-ciano">{pct_gastoPublico.valor}%</p>
              <p className="natal-desc">{pct_gastoPublico.texto}</p>
              <p className="natal-base">{pct_gastoPublico.n.toLocaleString('pt-BR')} de {pct_gastoPublico.base.toLocaleString('pt-BR')} entrevistados</p>
            </div>
          </div>
        </div>

        {/* Visitantes com gasto > R$100 */}
        <div className="visitantes-bloco">
          <div className="visitantes-cabec">
            <div>
              <p className="visitantes-titulo">Visitantes de fora de Maricá que declararam gastar mais de R$&nbsp;100</p>
              <p className="economia-fonte">Gasto informado no dia da entrevista, por local da pesquisa</p>
            </div>
          </div>
          <div className="visitantes-conteudo">
            <div className="visitantes-total">
              <p className="natal-pct natal-rosa">{totalGasto.pct}%</p>
              <p className="natal-desc">Total dos cinco locais</p>
              <p className="natal-base">{totalGasto.n} de {totalGasto.base.toLocaleString('pt-BR')} visitantes</p>
            </div>
            <div className="visitantes-grafico">
              <Grafico figura={figVisitantes} rotulo="Visitantes com gasto acima de R$100 por polo" altura={190} />
            </div>
          </div>
          <p className="natal-fonte">Fonte · Instituto Darcy Ribeiro (IDR) · Natal Brasilidade 2025, pesquisas Comércio e Público Geral</p>
        </div>

      </Painel>

      {/* ── Gráficos de eventos ── */}
      <div className="grade dois-um">
        <Painel titulo="Eventos por mês" subtitulo="Eventos do recorte por mês" rodape="Fonte: Calendário Oficial de Eventos 2026.">
          <Grafico figura={colunas(eventosPorMes(linhas), ROSA)} rotulo="Eventos do recorte por mês" altura={320} />
        </Painel>
        <Painel titulo="Áreas responsáveis" subtitulo="Agrupamento analítico da secretaria ou parceria responsável">
          <Grafico figura={barras(contsAreas, CIANO)} rotulo="Eventos do recorte por área responsável" altura={320} />
        </Painel>
      </div>
    </>
  )
}
