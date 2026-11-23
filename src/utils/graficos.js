import { MESES, numero, contagens } from './dados.js'

export const CIANO = '#007984'
export const ROSA = '#be256f'
export const AZUL = '#24556f'
export const SITUACOES = {
  'Funcionamento/abertura': '#5ba23b',
  'Obras': '#e2b200',
  'Transferência': '#62ced4',
  'A projetar': '#d62f87',
  'Outros': '#17324d',
}

const layoutBase = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: '#ffffff',
  font: { color: '#17324d', family: 'Segoe UI, Arial, sans-serif', size: 11 },
  margin: { l: 46, r: 20, t: 28, b: 35 },
  hoverlabel: { namelength: -1 },
}

function figura(traces, layout) {
  return { traces, layout: { ...layoutBase, ...layout } }
}

export function eventosPorMes(eventos) {
  const c = contagens(eventos, 'mes_nome')
  return Object.fromEntries(MESES.filter(m => m in c).map(m => [m, c[m] ?? 0]))
  // ponytail: PHP uses array_replace to preserve order; JS uses filter+fromEntries
}

export function colunas(contagem, cor = CIANO) {
  const xs = Object.keys(contagem)
  const ys = Object.values(contagem)
  return figura(
    [{
      type: 'bar',
      x: xs,
      y: ys,
      marker: { color: cor },
      text: ys.map(v => numero(v)),
      textposition: 'outside',
      cliponaxis: false,
      hovertemplate: '%{x}: %{text}<extra></extra>',
    }],
    {
      xaxis: { type: 'category', tickangle: -35, automargin: true },
      yaxis: { rangemode: 'tozero', gridcolor: '#e5edf0' },
      margin: { l: 40, r: 18, t: 20, b: 65 },
    }
  )
}

export function barras(contagem, cor = AZUL, percentual = false) {
  // sort ascending by value (like PHP asort)
  const entradas = Object.entries(contagem).sort((a, b) => a[1] - b[1])
  const nomes = entradas.map(([k]) => k)
  const valores = entradas.map(([, v]) => v)
  const textos = valores.map(v => numero(v) + (percentual ? '%' : ''))

  let cores
  if (typeof cor === 'object' && !Array.isArray(cor)) {
    cores = nomes.map(n => cor[n] || AZUL)
  } else {
    cores = cor
  }

  return figura(
    [{
      type: 'bar',
      orientation: 'h',
      x: valores,
      y: nomes,
      text: textos,
      marker: { color: cores },
      textposition: 'auto',
      cliponaxis: false,
      hovertemplate: '%{y}: %{text}<extra></extra>',
    }],
    {
      xaxis: {
        gridcolor: '#e5edf0',
        automargin: true,
        rangemode: 'tozero',
        ...(percentual ? { range: [0, 110], ticksuffix: '%' } : {}),
      },
      yaxis: { automargin: true, categoryorder: 'array', categoryarray: nomes },
      margin: { l: 26, r: 40, t: 14, b: 40 },
    }
  )
}

export function demografia(linhas) {
  const censos = linhas.filter(l => (l.tipo || '').startsWith('Censo'))
  const estimativas = linhas.filter(l => (l.tipo || '').startsWith('Estimativa'))
  const todosAnos = [...new Set(linhas.map(l => l.ano))].sort()

  return figura(
    [
      {
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Censos',
        x: censos.map(l => l.ano),
        y: censos.map(l => parseInt(l.populacao)),
        text: censos.map(l => numero(parseInt(l.populacao))),
        line: { color: CIANO, width: 3, dash: 'solid' },
        hovertemplate: '%{x} · %{text} habitantes<extra>%{fullData.name}</extra>',
      },
      {
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Estimativas',
        x: estimativas.map(l => l.ano),
        y: estimativas.map(l => parseInt(l.populacao)),
        text: estimativas.map(l => numero(parseInt(l.populacao))),
        line: { color: ROSA, width: 3, dash: 'dot' },
        hovertemplate: '%{x} · %{text} habitantes<extra>%{fullData.name}</extra>',
      },
    ],
    {
      xaxis: { type: 'category', categoryorder: 'array', categoryarray: todosAnos },
      yaxis: { title: { text: 'Habitantes', standoff: 10 }, gridcolor: '#e5edf0', automargin: true },
      legend: { orientation: 'h', y: 1.15 },
    }
  )
}

export function comunicacao(posts) {
  // group by month YYYY-MM
  const por = {}
  for (const p of posts) {
    if (!p.data) continue
    const mes = p.data.substring(0, 7)
    if (!por[mes]) por[mes] = { count: 0, interacoes: 0 }
    por[mes].count++
    por[mes].interacoes += Number(p.interacoes) || 0
  }
  const meses = Object.keys(por).sort()
  const labels = meses.map(m => m.substring(5, 7) + '/' + m.substring(0, 4))
  const counts = meses.map(m => por[m].count)
  const inters = meses.map(m => por[m].interacoes)

  return figura(
    [
      {
        type: 'bar',
        x: labels,
        y: counts,
        name: 'Publicações',
        marker: { color: CIANO },
        hovertemplate: '%{x}: %{y}<extra>Publicações</extra>',
      },
      {
        type: 'scatter',
        mode: 'lines+markers',
        x: labels,
        y: inters,
        yaxis: 'y2',
        name: 'Interações',
        line: { color: ROSA, width: 3 },
        hovertemplate: '%{x}: %{y}<extra>Interações</extra>',
      },
    ],
    {
      xaxis: { type: 'category', tickangle: -35, automargin: true },
      yaxis: { title: { text: 'Publicações', standoff: 10 }, rangemode: 'tozero', gridcolor: '#e5edf0' },
      yaxis2: { title: { text: 'Interações', standoff: 8 }, overlaying: 'y', side: 'right', rangemode: 'tozero', showgrid: false },
      legend: { orientation: 'h', y: 1.15 },
      margin: { l: 52, r: 55, t: 27, b: 55 },
    }
  )
}

export function maturidade(matriz) {
  const c = contagens(matriz, 'disponibilidade')
  const cores = { 'Disponível': '#5ba23b', 'Parcial': '#e2b200', 'A produzir': '#c85354' }
  const labels = Object.keys(c)
  return figura(
    [{
      type: 'pie',
      hole: 0.58,
      labels,
      values: Object.values(c),
      marker: { colors: labels.map(l => cores[l] ?? AZUL) },
      sort: false,
      textinfo: 'value',
      hovertemplate: '%{label}: %{value}<extra></extra>',
    }],
    { margin: { l: 15, r: 15, t: 8, b: 15 }, legend: { orientation: 'h', y: -0.06 } }
  )
}

export function sazonalidade(eventos) {
  const epm = eventosPorMes(eventos)
  const mesesPresentes = Object.keys(epm)
  const counts = Object.values(epm)
  const n = counts.length
  if (n === 0) return {}
  const media = counts.reduce((s, v) => s + v, 0) / n
  const indices = counts.map(v => media > 0 ? Math.round(v / media * 1000) / 10 : 0)

  return figura(
    [
      {
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Índice da programação',
        x: mesesPresentes,
        y: indices,
        text: counts,
        line: { color: ROSA, width: 3 },
        hovertemplate: '%{x} · %{text} eventos<br>Índice: %{y}%<extra></extra>',
      },
      {
        type: 'scatter',
        mode: 'lines',
        name: 'Média dos meses',
        x: mesesPresentes,
        y: Array(n).fill(100),
        line: { color: '#64757d', dash: 'dash' },
        hovertemplate: 'Média: 100%<extra></extra>',
      },
    ],
    {
      xaxis: { type: 'category', tickangle: -35, automargin: true },
      yaxis: { ticksuffix: '%', gridcolor: '#e5edf0' },
      legend: { orientation: 'h', y: 1.16 },
    }
  )
}

export function pesquisa(linhas) {
  if (!linhas || linhas.length === 0) return {}
  const unidades = [...new Set(linhas.map(l => l.unidade).filter(Boolean))]
  if (unidades.length !== 1) return {}

  const unidade = unidades[0]
  // top 12 by valor desc, then reverse for horizontal bar (ascending for Plotly)
  const sorted = [...linhas]
    .filter(l => l.valor !== null && l.valor !== undefined && l.valor !== '' && isFinite(Number(l.valor)))
    .sort((a, b) => Number(b.valor) - Number(a.valor))
    .slice(0, 12)
    .reverse()

  const ys = sorted.map(l => l.categoria)
  const xs = sorted.map(l => Number(l.valor))
  const textos = sorted.map(l => {
    const n = parseFloat(l.valor)
    const fmt = numero(n, Number.isInteger(n) ? 0 : 2)
    if (unidade === '%') return fmt + '%'
    if (unidade === 'pontos') return fmt + ' pontos'
    return fmt
  })
  const customdata = sorted.map(l => [l.referencia || '', l.n_base || ''])

  return figura(
    [{
      type: 'bar',
      orientation: 'h',
      x: xs,
      y: ys,
      text: textos,
      textposition: 'auto',
      cliponaxis: false,
      marker: { color: CIANO },
      customdata,
      hovertemplate: '%{y}: %{text}<br>Base: %{customdata[1]}<extra></extra>',
    }],
    {
      xaxis: {
        gridcolor: '#e5edf0',
        automargin: true,
        rangemode: 'tozero',
        ...(unidade === '%' ? { range: [0, 110], ticksuffix: '%' } : {}),
        ...(unidade === 'pontos' ? { range: [-100, 110], title: { text: 'Pontos' } } : {}),
      },
      yaxis: { automargin: true, categoryorder: 'array', categoryarray: ys },
      margin: { l: 26, r: 40, t: 14, b: 40 },
    }
  )
}
