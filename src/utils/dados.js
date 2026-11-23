export const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

export function numero(valor, casas = 0) {
  if (valor === null || valor === undefined || !isFinite(Number(valor))) return '—'
  return Number(valor).toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  })
}

export function dataBr(data) {
  if (!data) return '—'
  const partes = data.split('-')
  if (partes.length !== 3) return data
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

export function contagens(linhas, campo) {
  return linhas.reduce((acc, linha) => {
    const v = linha[campo]
    if (v !== '' && v !== null && v !== undefined && v !== 'NA') {
      acc[v] = (acc[v] || 0) + 1
    }
    return acc
  }, {})
}

export function escolhas(linhas, campo) {
  const vals = Object.keys(contagens(linhas, campo))
  return vals.sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }))
}

export function filtrar(linhas, filtros) {
  return linhas.filter(linha =>
    Object.entries(filtros).every(([col, val]) =>
      val === '' || val === null || val === undefined || linha[col] === val
    )
  )
}

export function soma(linhas, campo) {
  const vals = linhas.map(l => l[campo]).filter(v => v !== '' && v !== null && v !== undefined && isFinite(Number(v)))
  return vals.length ? vals.reduce((s, v) => s + Number(v), 0) : null
}

export function consulta(query, campo, opcoes, padrao = '') {
  const val = query[campo]
  return typeof val === 'string' && opcoes.includes(val) ? val : padrao
}

export function pesquisaResultado(linha) {
  if (linha.valor === null || linha.valor === undefined || linha.valor === '') return '—'
  const n = parseFloat(linha.valor)
  if (!isFinite(n)) return '—'
  const isInt = Number.isInteger(n)
  const fmt = numero(n, isInt ? 0 : 2)
  if (linha.unidade === '%') return fmt + '%'
  if (linha.unidade === 'pontos') return fmt + ' pontos'
  return fmt
}

export function addStatusGrupo(equipamentos) {
  return equipamentos.map(eq => {
    const s = (eq.status || '').toLowerCase()
    let status_grupo
    if (/funcionamento|reabertura|abertura/.test(s)) status_grupo = 'Funcionamento/abertura'
    else if (s.includes('obra')) status_grupo = 'Obras'
    else if (s.includes('transfer')) status_grupo = 'Transferência'
    else if (s.includes('projetar')) status_grupo = 'A projetar'
    else status_grupo = 'Outros'
    return { ...eq, status_grupo }
  })
}

// ponytail: completude inline per spec
export function completude(eventos, equipamentos, indicadores, posts) {
  const bases = [
    ['Calendário de eventos', eventos, ['numero_oficial','ano','mes_nome','evento','datas','secretaria_responsavel','participacao_mare','situacao_data','categoria_responsavel','pagina_fonte','fonte']],
    ['Equipamentos', equipamentos, ['nome','endereco','status','previsao','territorio','categoria','fonte']],
    ['Indicadores territoriais', indicadores, ['indicador','valor','ano_referencia','tipo_dado','fonte','url','observacao']],
    ['Comunicação pública', posts, ['data','tipo','titulo','tema','curtidas','comentarios','interacoes','link','fonte']],
  ]
  return Object.fromEntries(bases.map(([nome, linhas, campos]) => {
    const preenchidos = linhas.flatMap(l => campos.map(c => {
      const v = (l[c] ?? '').toString().trim()
      return v !== '' && v !== 'NA' ? 1 : 0
    })).reduce((a, b) => a + b, 0)
    const total = linhas.length * campos.length
    return [nome, total ? preenchidos / total * 100 : 0]
  }))
}
