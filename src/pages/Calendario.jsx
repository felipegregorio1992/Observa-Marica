import React from 'react'
import { useMultiCsv } from '../hooks/useMultiCsv.js'
import { SECOES } from '../components/Layout.jsx'
import Hero from '../components/Hero.jsx'
import Painel from '../components/Painel.jsx'
import Tabela from '../components/Tabela.jsx'
import Comunicados from '../components/Comunicados.jsx'

export default function Calendario() {
  const { dados, carregando, erro } = useMultiCsv({
    eventos: 'eventos_oficiais_2026',
    comunicados: 'comunicados_oficiais',
  })

  if (carregando) return <p style={{ padding: 20 }}>Carregando dados…</p>
  if (erro) return <p style={{ padding: 20, color: 'red' }}>Erro: {erro}</p>

  return (
    <>
      <Hero pagina={SECOES.calendario} />

      <div className="note method">
        O número 53 aparece em dois registros distintos porque o Diário Oficial original atribuiu o mesmo número a dois eventos diferentes. O campo <code>registro_id</code> técnico os distingue.
      </div>

      <Painel titulo="Comunicados oficiais">
        <Comunicados itens={dados.comunicados} />
      </Painel>

      <Painel titulo="Calendário de eventos 2026">
        <Tabela
          linhas={dados.eventos}
          colunas={{
            registro_id: 'ID',
            numero_oficial: 'Nº',
            mes_nome: 'Mês',
            tema_mes: 'Tema do mês',
            evento: 'Evento',
            datas: 'Datas',
            secretaria_responsavel: 'Secretaria',
            participacao_mare: 'Participação MARÉ',
            situacao_data: 'Situação',
            pagina_fonte: 'Página',
          }}
          rotulo="eventos"
          tamanho={20}
          filtros={['numero_oficial', 'mes_nome', 'tema_mes', 'evento', 'secretaria_responsavel', 'participacao_mare', 'situacao_data']}
        />
      </Painel>
    </>
  )
}
