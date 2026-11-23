import { escolhas, filtrar, contagens } from './dados.js'

export const COLUNAS = ['id_publicacao','data','dia_semana','tipo','titulo','resumo','tema','curtidas','comentarios','interacoes','hashtags','link','fonte','tipo_dado','mes']

export const FORMATOS = {
  'reel': 'Reel', 'reels': 'Reel',
  'foto': 'Foto', 'imagem': 'Foto', 'image': 'Foto',
  'carrossel': 'Carrossel', 'carousel': 'Carrossel',
  'video': 'Vídeo', 'vídeo': 'Vídeo',
  'story': 'Story', 'stories': 'Story',
}

// CAMPOS aliases for CSV import
export const CAMPOS = {
  id_publicacao: ['id_publicacao','id','post_id'],
  data: ['data','date'],
  dia_semana: ['dia_semana','weekday','dia'],
  tipo: ['tipo','type','formato','format'],
  titulo: ['titulo','title','caption','legenda'],
  resumo: ['resumo','description','descricao'],
  tema: ['tema','theme','category','categoria'],
  curtidas: ['curtidas','likes'],
  comentarios: ['comentarios','comments'],
  interacoes: ['interacoes','interactions','engajamento'],
  hashtags: ['hashtags','tags'],
  link: ['link','url','permalink'],
  fonte: ['fonte','source'],
  tipo_dado: ['tipo_dado','data_type'],
}

function validarData(val) {
  if (!val || typeof val !== 'string') return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val
  return null
}

export function ordenar(posts, ordem = 'data') {
  return [...posts].sort((a, b) => {
    if (ordem === 'interacoes') {
      const diff = (Number(b.interacoes) || -1) - (Number(a.interacoes) || -1)
      if (diff !== 0) return diff
    }
    if (b.data !== a.data) return b.data > a.data ? 1 : -1
    return Number(b.id_publicacao) - Number(a.id_publicacao)
  })
}

export function recorte(posts, query) {
  const datas = posts.map(p => p.data).filter(Boolean).sort()
  const tiposOpts = escolhas(posts, 'tipo')
  const temasOpts = escolhas(posts, 'tema')
  const ordemOpts = ['data', 'interacoes']

  const inicio = validarData(query.inicio) ?? (datas.length ? datas[0] : '')
  const fim = validarData(query.fim) ?? (datas.length ? datas[datas.length - 1] : '')
  const tipo = tiposOpts.includes(query.tipo) ? query.tipo : ''
  const tema = temasOpts.includes(query.tema) ? query.tema : ''
  const ordem = ordemOpts.includes(query.ordem) ? query.ordem : 'data'

  let linhas = filtrar(posts, { tipo, tema })
  if (inicio) linhas = linhas.filter(p => p.data >= inicio)
  if (fim) linhas = linhas.filter(p => p.data <= fim)

  return {
    linhas: ordenar(linhas, ordem),
    filtros: { inicio, fim, tipo, tema, ordem },
    opcoes: { tipo: tiposOpts, tema: temasOpts, ordem: ordemOpts },
  }
}

export function tema(texto, regras) {
  const normalizado = (texto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  for (const { padrao, tema: t } of regras) {
    try {
      if (new RegExp(padrao, 'i').test(normalizado)) return t
    } catch (_) { /* invalid regex in CSV, skip */ }
  }
  return 'Outras publicações'
}

export function processarPost(post) {
  return {
    ...post,
    curtidas: post.curtidas !== '' && post.curtidas !== undefined ? Number(post.curtidas) || 0 : 0,
    comentarios: post.comentarios !== '' && post.comentarios !== undefined ? Number(post.comentarios) || 0 : 0,
    interacoes: post.interacoes !== '' && post.interacoes !== undefined ? Number(post.interacoes) || 0 : 0,
    mes: post.data ? post.data.substring(0, 7) + '-01' : '',
  }
}
