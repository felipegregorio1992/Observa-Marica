import React from 'react'
import { useMultiCsv } from '../hooks/useMultiCsv.js'
import { SECOES } from '../components/Layout.jsx'
import Hero from '../components/Hero.jsx'
import Grafico from '../components/Grafico.jsx'
import Painel from '../components/Painel.jsx'
import Indicadores from '../components/Indicadores.jsx'
import { sazonalidade } from '../utils/graficos.js'

export default function Turismo() {
  const { dados, carregando, erro } = useMultiCsv({
    matriz: 'matriz_indicadores_tcc',
    eventos: 'eventos_oficiais_2026',
  })

  if (carregando) return <p style={{ padding: 20 }}>Carregando dados…</p>
  if (erro) return <p style={{ padding: 20, color: 'red' }}>Erro: {erro}</p>

  return (
    <>
      <Hero pagina={SECOES.turismo} />

      <p className="note warning">Turistas, origem, permanência, ocupação, gasto e impacto econômico exigem pesquisas e integração de fontes setoriais.</p>

      <div className="grade duas">
        <Painel titulo="Demanda e fluxo" subtitulo="Situação dos indicadores da matriz do TCC">
          <Indicadores matriz={dados.matriz} eixos={['Demanda', 'Imagem do destino']} />
        </Painel>
        <Painel titulo="Economia e oferta" subtitulo="Situação dos indicadores da matriz do TCC">
          <Indicadores matriz={dados.matriz} eixos={['Hospedagem', 'Eventos']} />
        </Painel>
      </div>

      <div className="grade dois-um">
        <Painel
          titulo="Sazonalidade da programação"
          subtitulo="Eventos cadastrados em relação à média dos meses com programação"
          rodape="Indicador parcial da concentração temporal do calendário oficial."
        >
          <Grafico figura={sazonalidade(dados.eventos)} rotulo="Índice mensal da programação em relação à média" altura={330} />
        </Painel>
        <Painel titulo="Dados necessários para a próxima etapa">
          <ul className="lista">
            <li>Pesquisa de perfil, origem, acesso, permanência e gasto do visitante.</li>
            <li>Pesquisa mensal de meios de hospedagem.</li>
            <li>Integração com Cadastur e registros municipais.</li>
            <li>Seleção metodológica de atividades da RAIS e do Novo Caged.</li>
            <li>Protocolo de avaliação econômica de eventos prioritários.</li>
          </ul>
        </Painel>
      </div>
    </>
  )
}
