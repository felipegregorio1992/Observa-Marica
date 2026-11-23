import React from 'react'
import { useCsv } from '../hooks/useCsv.js'
import { SECOES } from '../components/Layout.jsx'
import Hero from '../components/Hero.jsx'
import Painel from '../components/Painel.jsx'
import Indicadores from '../components/Indicadores.jsx'

export default function Sustentabilidade() {
  const { dados, erro } = useCsv('matriz_indicadores_tcc')

  if (!dados) return <p style={{ padding: 20 }}>Carregando dados…</p>
  if (erro) return <p style={{ padding: 20, color: 'red' }}>Erro: {erro}</p>

  return (
    <>
      <Hero pagina={SECOES.sustentabilidade} />

      <p className="note warning">As pesquisas registram percepções dos participantes. A avaliação de residentes, acessibilidade, resíduos e pressão turística depende de séries e registros próprios.</p>

      <Painel titulo="Situação dos indicadores">
        <Indicadores
          matriz={dados}
          eixos={['Sustentabilidade', 'Aeroporto e mobilidade']}
        />
      </Painel>

      <div className="grade duas">
        <Painel titulo="Protocolo mínimo para eventos prioritários">
          <ol className="lista">
            <li>Definir eventos a avaliar.</li>
            <li>Aplicar checklist de acessibilidade e inclusão.</li>
            <li>Registrar público por método documentado.</li>
            <li>Registrar os resíduos gerados e sua destinação.</li>
            <li>Aplicar pesquisa de satisfação.</li>
            <li>Publicar nota metodológica e limitações.</li>
          </ol>
        </Painel>
        <Painel titulo="Princípios de uso responsável">
          <ul className="lista">
            <li>Publicar dados pessoais de forma agregada ou anonimizada.</li>
            <li>Observar finalidade, necessidade e proporcionalidade conforme a LGPD.</li>
            <li>Preservar a privacidade das trajetórias individuais.</li>
            <li>Acompanhar indicadores ambientais, sociais e econômicos.</li>
          </ul>
        </Painel>
      </div>
    </>
  )
}
