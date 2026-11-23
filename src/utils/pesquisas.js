import { filtrar, numero } from './dados.js'

export const BASES = {
  nexus: ['nexus_relatorio', 'nexus_planilha'],
  natal: ['natal_publico', 'natal_comercio'],
}

export function recorte(todasLinhas, todasBases, secao, query) {
  const ids = BASES[secao] || []
  const baseId = ids.includes(query.base) ? query.base : ids[0]
  const basesMap = Object.fromEntries(
    todasBases.filter(b => ids.includes(b.base_id)).map(b => [b.base_id, b])
  )

  // linhas ordered by ordem asc (already sorted at load time)
  let linhas = filtrar(todasLinhas, { base_id: baseId })
  const grupos = [...new Set(linhas.map(l => l.grupo))]
  const grupo = grupos.includes(query.grupo) ? query.grupo : (grupos[0] ?? '')
  linhas = filtrar(linhas, { grupo })
  const series = [...new Set(linhas.map(l => l.serie))]
  const serie = series.includes(query.serie) ? query.serie : (series[0] ?? '')

  return {
    bases: basesMap,
    base: basesMap[baseId],
    linhas: filtrar(linhas, { serie }),
    filtros: { base: baseId, grupo, serie },
    grupos,
    series,
  }
}

export function resultado(linha) {
  if (linha.valor === null || linha.valor === undefined || linha.valor === '') return '—'
  const n = parseFloat(linha.valor)
  if (!isFinite(n)) return '—'
  const fmt = numero(n, Number.isInteger(n) ? 0 : 2)
  if (linha.unidade === '%') return fmt + '%'
  if (linha.unidade === 'pontos') return fmt + ' pontos'
  return fmt
}

export function destaque(todasLinhas, base, categoria) {
  const sel = filtrar(todasLinhas, { base_id: base, grupo: 'Síntese', categoria })
  return sel.length === 1 ? resultado(sel[0]) : '—'
}
