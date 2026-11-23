import React, { useState, useMemo } from 'react'
import { useCsv } from '../hooks/useCsv.js'
import { SECOES } from '../components/Layout.jsx'
import Hero from '../components/Hero.jsx'
import Cartoes from '../components/Cartoes.jsx'
import Grafico from '../components/Grafico.jsx'
import Painel from '../components/Painel.jsx'
import Tabela from '../components/Tabela.jsx'
import Filtros from '../components/Filtros.jsx'
import { numero, contagens, filtrar, addStatusGrupo, escolhas } from '../utils/dados.js'
import { barras, CIANO, SITUACOES } from '../utils/graficos.js'

export default function Equipamentos() {
  const { dados: raw, erro } = useCsv('equipamentos_oficiais')
  const [filtrosAtivos, setFiltrosAtivos] = useState({})

  const todos = useMemo(() => raw ? addStatusGrupo(raw) : null, [raw])
  const linhas = useMemo(() => todos ? filtrar(todos, filtrosAtivos) : [], [todos, filtrosAtivos])

  const situacoes = useMemo(() => contagens(linhas, 'status_grupo'), [linhas])

  const cartoes = [
    ['Equipamentos selecionados', numero(linhas.length), 'Base MARÉ', 'OFICIAL'],
    ['Funcionamento/abertura', numero(situacoes['Funcionamento/abertura'] || 0), 'Em operação', 'OFICIAL'],
    ['Obras', numero(situacoes['Obras'] || 0), 'Em obras', 'DERIVADO'],
    ['Transferência', numero(situacoes['Transferência'] || 0), 'Em transferência', 'DERIVADO'],
    ['A projetar', numero(situacoes['A projetar'] || 0), 'Planejados', 'DERIVADO'],
    ['Com previsão', numero(linhas.filter(e => e.previsao && e.previsao.trim() !== '').length), 'Com data informada', 'DERIVADO'],
  ]

  if (!todos) return <p style={{ padding: 20 }}>Carregando dados…</p>
  if (erro) return <p style={{ padding: 20, color: 'red' }}>Erro: {erro}</p>

  const opcoesFiltros = {
    status_grupo: escolhas(todos, 'status_grupo'),
    territorio: escolhas(todos, 'territorio'),
    categoria: escolhas(todos, 'categoria'),
  }

  return (
    <>
      <Hero pagina={SECOES.equipamentos} />

      <Painel>
        <Filtros
          campos={{ status_grupo: 'Situação', territorio: 'Território', categoria: 'Categoria' }}
          opcoes={opcoesFiltros}
          filtros={filtrosAtivos}
          onChange={setFiltrosAtivos}
        />
      </Painel>

      <Cartoes itens={cartoes} />

      <div className="grade duas">
        <Painel titulo="Situação dos equipamentos">
          <Grafico figura={barras(situacoes, SITUACOES)} altura={320} />
        </Painel>
        <Painel titulo="Distribuição territorial">
          <Grafico figura={barras(contagens(linhas, 'territorio'), CIANO)} altura={320} />
        </Painel>
      </div>

      <Painel titulo="Lista de equipamentos">
        <Tabela
          linhas={linhas}
          colunas={{ nome:'Nome', endereco:'Endereço', status:'Status', status_grupo:'Situação', previsao:'Previsão', territorio:'Território', categoria:'Categoria' }}
          rotulo="equipamentos"
          tamanho={15}
          filtros={['nome', 'status_grupo', 'territorio', 'categoria']}
        />
      </Painel>
    </>
  )
}
