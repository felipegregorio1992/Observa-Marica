import React, { useMemo } from 'react'
import { useMultiCsv } from '../hooks/useMultiCsv.js'
import { SECOES } from '../components/Layout.jsx'
import Hero from '../components/Hero.jsx'
import Cartoes from '../components/Cartoes.jsx'
import Grafico from '../components/Grafico.jsx'
import Painel from '../components/Painel.jsx'
import Tabela from '../components/Tabela.jsx'
import Indicadores from '../components/Indicadores.jsx'
import { numero, addStatusGrupo, completude } from '../utils/dados.js'
import { barras, AZUL } from '../utils/graficos.js'

export default function Governanca() {
  const { dados, carregando, erro } = useMultiCsv({
    matriz: 'matriz_indicadores_tcc',
    dicionario: 'dicionario_dados',
    posts: 'noticias_instagram_mare',
    eventos: 'eventos_oficiais_2026',
    equipamentos: 'equipamentos_oficiais',
    indicadores: 'indicadores_oficiais',
  })

  const equip = useMemo(() => dados ? addStatusGrupo(dados.equipamentos) : [], [dados])

  const comp = useMemo(() => {
    if (!dados) return {}
    return completude(dados.eventos, equip, dados.indicadores, dados.posts)
  }, [dados, equip])

  const mediaComp = useMemo(() => {
    const vals = Object.values(comp)
    return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0
  }, [comp])

  const cartoes = [
    ['Completude média', numero(mediaComp, 1) + '%', 'Das quatro bases avaliadas', 'DERIVADO'],
    ['Bases avaliadas', numero(Object.keys(comp).length), 'Conjunto de dados ativos', 'DERIVADO'],
    ['Indicadores documentados', numero(dados?.matriz?.length ?? 0), 'Matriz do TCC', 'OFICIAL'],
    ['Atualização no prazo', 'A produzir', 'Monitoramento de prazos', 'A PRODUZIR'],
    ['Abertura e documentação', 'Parcial', 'Metadados publicados', 'PARCIAL'],
    ['Uso da evidência', 'A produzir', 'Rastreabilidade decisória', 'A PRODUZIR'],
  ]

  if (carregando) return <p style={{ padding: 20 }}>Carregando dados…</p>
  if (erro) return <p style={{ padding: 20, color: 'red' }}>Erro: {erro}</p>

  return (
    <>
      <Hero pagina={SECOES.governanca} />
      <Cartoes itens={cartoes} />

      <div className="grade duas">
        <Painel titulo="Completude das bases prioritárias" subtitulo="Percentual dos campos prioritários preenchidos">
          <Grafico figura={barras(comp, AZUL, true)} rotulo="Percentual preenchido em cada base" altura={290} />
        </Painel>
        <Painel titulo="Situação dos indicadores de governança">
          <Indicadores matriz={dados.matriz} eixos={['Governança']} />
        </Painel>
      </div>

      <Painel titulo="Arquitetura em seis camadas">
        <ol className="lista arquitetura">
          <li><strong>Fontes</strong> Registros administrativos, sistemas públicos, pesquisas e parceiros.</li>
          <li><strong>Ingestão e qualidade</strong> Padronização, validação, unicidade, completude e versões.</li>
          <li><strong>Repositório</strong> Bases integradas, documentadas e com controle de acesso.</li>
          <li><strong>Análise</strong> Rotinas reproduzíveis, estatística, séries e geoprocessamento.</li>
          <li><strong>Disseminação</strong> Painéis, boletins, notas técnicas e dados abertos.</li>
          <li><strong>Retroalimentação</strong> Avaliação do uso e melhoria contínua.</li>
        </ol>
      </Painel>

      <Painel titulo="Matriz completa de indicadores" subtitulo="Definição, fonte, periodicidade, disponibilidade e nota metodológica">
        <Tabela
          linhas={dados.matriz}
          colunas={{ dimensao:'Dimensão', indicador:'Indicador', definicao_formula:'Definição ou fórmula', fonte_principal:'Fonte principal', periodicidade:'Periodicidade', disponibilidade:'Disponibilidade', nota_metodologica:'Nota metodológica' }}
          rotulo="matriz de indicadores"
          tamanho={15}
          filtros={['dimensao', 'indicador', 'periodicidade', 'disponibilidade']}
        />
      </Painel>

      <Painel titulo="Metadados e regras de uso" subtitulo="Dicionário técnico das bases do painel">
        <Tabela
          linhas={dados.dicionario}
          colunas={{ arquivo:'Arquivo', campo:'Campo', definicao:'Definição', tipo:'Tipo', classificacao:'Classificação', regra_de_uso:'Regra de uso' }}
          rotulo="dicionário de dados"
          tamanho={12}
          filtros={['arquivo', 'campo', 'tipo', 'classificacao']}
        />
      </Painel>
    </>
  )
}
