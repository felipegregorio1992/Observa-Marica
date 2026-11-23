import React, { useState, useMemo } from 'react'
import { useMultiCsv } from '../hooks/useMultiCsv.js'
import { SECOES } from '../components/Layout.jsx'
import Hero from '../components/Hero.jsx'
import Cartoes from '../components/Cartoes.jsx'
import Grafico from '../components/Grafico.jsx'
import Painel from '../components/Painel.jsx'
import Tabela from '../components/Tabela.jsx'
import Filtros from '../components/Filtros.jsx'
import Indicadores from '../components/Indicadores.jsx'
import { numero, contagens, filtrar, addStatusGrupo, MESES } from '../utils/dados.js'
import { colunas, barras, eventosPorMes, ROSA, CIANO } from '../utils/graficos.js'

export default function Cultura() {
  const { dados, carregando, erro } = useMultiCsv({
    eventos: 'eventos_oficiais_2026',
    equipamentos: 'equipamentos_oficiais',
    matriz: 'matriz_indicadores_tcc',
  })
  const [filtrosAtivos, setFiltrosAtivos] = useState({})

  const equip = useMemo(() => dados ? addStatusGrupo(dados.equipamentos) : [], [dados])
  const linhas = useMemo(() => dados ? filtrar(dados.eventos, filtrosAtivos) : [], [dados, filtrosAtivos])
  const equipCulturais = useMemo(() => equip.filter(e => (e.categoria || '').toLowerCase().includes('cultural')).length, [equip])
  const contsMare = useMemo(() => contagens(linhas, 'participacao_mare'), [linhas])
  const contsSituacao = useMemo(() => contagens(linhas, 'situacao_data'), [linhas])

  const cartoes = [
    ['Eventos selecionados', numero(linhas.length), 'Calendário oficial', 'OFICIAL'],
    ['Meses com programação', numero(Object.keys(contagens(linhas, 'mes_nome')).length), 'Meses distintos', 'DERIVADO'],
    ['Com participação MARÉ', numero(contsMare['Com participação da MARÉ'] || 0), 'Envolvimento direto', 'DERIVADO'],
    ['Datas em aberto', numero(contsSituacao['Em aberto'] || 0), 'Sem data definida', 'DERIVADO'],
    ['Temas mensais', numero(Object.keys(contagens(linhas, 'tema_mes')).length), 'Temas distintos', 'DERIVADO'],
    ['Equipamentos culturais', numero(equipCulturais), 'Base MARÉ · abril 2026', 'OFICIAL'],
  ]

  if (carregando) return <p style={{ padding: 20 }}>Carregando dados…</p>
  if (erro) return <p style={{ padding: 20, color: 'red' }}>Erro: {erro}</p>

  const opcoesFiltros = {
    mes_nome: MESES,
    participacao_mare: Object.keys(contagens(dados.eventos, 'participacao_mare')),
    situacao_data: Object.keys(contagens(dados.eventos, 'situacao_data')),
    categoria_responsavel: Object.keys(contagens(dados.eventos, 'categoria_responsavel')).sort(),
  }

  return (
    <>
      <Hero pagina={SECOES.cultura} />

      <Painel>
        <Filtros
          campos={{ mes_nome: 'Mês', participacao_mare: 'Participação da MARÉ', situacao_data: 'Situação da data', categoria_responsavel: 'Área responsável' }}
          opcoes={opcoesFiltros}
          filtros={filtrosAtivos}
          onChange={setFiltrosAtivos}
        />
      </Painel>

      <Cartoes itens={cartoes} />

      <div className="grade dois-um">
        <Painel titulo="Eventos por mês" rodape="Fonte: Calendário Oficial de Eventos 2026.">
          <Grafico figura={colunas(eventosPorMes(linhas), ROSA)} rotulo="Eventos do recorte por mês" altura={320} />
        </Painel>
        <Painel titulo="Áreas responsáveis" subtitulo="Agrupamento analítico da secretaria ou parceria responsável">
          <Grafico figura={barras(contagens(linhas, 'categoria_responsavel'), CIANO)} rotulo="Eventos do recorte por área responsável" altura={320} />
        </Painel>
      </div>

      <div className="grade duas">
        <Painel titulo="Indicadores de cultura e criatividade">
          <Indicadores
            matriz={dados.matriz}
            eixos={['Participação cultural', 'Economia criativa', 'Audiovisual', 'Patrimônio']}
          />
        </Painel>
        <Painel titulo="Calendário detalhado">
          <Tabela
            linhas={linhas}
            colunas={{ mes_nome:'Mês', evento:'Evento', datas:'Datas', secretaria_responsavel:'Responsável', participacao_mare:'Participação da MARÉ' }}
            rotulo="eventos"
            tamanho={8}
            filtros={['mes_nome', 'evento', 'secretaria_responsavel', 'participacao_mare']}
          />
        </Painel>
      </div>
    </>
  )
}
