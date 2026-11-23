import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMultiCsv } from '../hooks/useMultiCsv.js'
import { SECOES } from '../components/Layout.jsx'
import Hero from '../components/Hero.jsx'
import Painel from '../components/Painel.jsx'
import Grafico from '../components/Grafico.jsx'
import Tabela from '../components/Tabela.jsx'
import Selecao from '../components/Selecao.jsx'
import DownloadCsv from '../components/DownloadCsv.jsx'
import { recorte, resultado, BASES } from '../utils/pesquisas.js'
import { pesquisa as graficoPesquisa } from '../utils/graficos.js'
import { numero } from '../utils/dados.js'

export default function Pesquisa({ secao }) {
  const { dados, carregando, erro } = useMultiCsv({
    resultados: 'resultados_pesquisas',
    bases: 'bases_pesquisas',
  })

  const [params, setParams] = useSearchParams()
  const query = {
    base: params.get('base') || '',
    grupo: params.get('grupo') || '',
    serie: params.get('serie') || '',
  }

  // ponytail: ordem asc por `ordem` (parseInt) — pré-ordenado uma vez ao carregar
  const todasLinhas = useMemo(() => {
    if (!dados?.resultados) return []
    return [...dados.resultados].sort((a, b) => (parseInt(a.ordem) || 0) - (parseInt(b.ordem) || 0))
  }, [dados])

  const rec = useMemo(() => {
    if (!dados?.bases) return null
    return recorte(todasLinhas, dados.bases, secao, query)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todasLinhas, dados, secao, query.base, query.grupo, query.serie])

  if (carregando) return <p style={{ padding: 20 }}>Carregando dados…</p>
  if (erro) return <p style={{ padding: 20, color: 'red' }}>Erro: {erro}</p>
  if (!rec || !rec.base) return null

  const base = rec.base
  const linhas = rec.linhas || []
  const ids = BASES[secao] || []
  const baseOpcoes = Object.fromEntries(ids.map(id => [id, rec.bases[id]?.nome]))

  const tabela = linhas.map(l => ({ ...l, valor_texto: resultado(l) }))

  const amostras = [...new Set(
    linhas.map(l => l.n_base).filter(n => n !== null && n !== undefined && n !== '')
  )].sort((a, b) => Number(a) - Number(b))
  const referencias = [...new Set(linhas.map(l => l.referencia).filter(Boolean))]
  const notas = [...new Set(linhas.map(l => l.nota).filter(n => n && n.trim() !== ''))]

  // Cascata: mudar base reseta grupo+serie; mudar grupo reseta serie. Os selects aplicam imediatamente.
  function onBase(val) { setParams({ base: val }) }
  function onGrupo(val) { setParams({ base: rec.filtros.base, grupo: val }) }
  function onSerie(val) { setParams({ base: rec.filtros.base, grupo: rec.filtros.grupo, serie: val }) }

  return (
    <>
      <Hero pagina={SECOES[secao]} />

      <p className="note method">
        {secao === 'nexus'
          ? 'O relatório executivo e a planilha documentam a mesma rodada de 304 entrevistas. A seleção da base separa os valores publicados dos cálculos sem pesos.'
          : 'As duas pesquisas do IDR têm públicos distintos. Consulte a base de cada pergunta e polo ao interpretar os resultados.'}
      </p>

      <form className="formulario" onSubmit={e => e.preventDefault()}>
        <Selecao nome="base" titulo="Base da pesquisa" opcoes={baseOpcoes} valor={rec.filtros.base} todos={false} onChange={onBase} />
        <Selecao nome="grupo" titulo="Grupo" opcoes={rec.grupos} valor={rec.filtros.grupo} todos={false} onChange={onGrupo} />
        <Selecao nome="serie" titulo="Série" opcoes={rec.series} valor={rec.filtros.serie} todos={false} onChange={onSerie} />
      </form>

      <section className="source-box pesquisa-metodo">
        <h2 className="panel-title">{base.nome}</h2>
        {base.periodo && <p><strong>Período</strong> {base.periodo}</p>}
        {base.universo && <p>{base.universo}</p>}
        {base.metodo && <p>{base.metodo}</p>}
        {base.limite && <p>{base.limite}</p>}
        {base.arquivo && <p className="small-note">Arquivo de referência · {base.arquivo}</p>}
        {base.url && <a href={base.url} target="_blank" rel="noopener noreferrer">Consultar órgão produtor</a>}
      </section>

      <Painel
        titulo="Resultado selecionado"
        subtitulo="O gráfico exibe até 12 categorias. A tabela reúne toda a série."
        rodape={
          <>
            {amostras.length > 0 && (
              <p><strong>Base da pergunta ou polo</strong> {amostras.map(n => numero(Number(n))).join(' · ')}</p>
            )}
            <p><strong>Referência</strong> {referencias.join(' · ')}</p>
            {notas.map((n, i) => <p key={i}>{n}</p>)}
          </>
        }
      >
        <Grafico
          figura={graficoPesquisa(linhas)}
          rotulo={rec.filtros.serie}
          altura={380}
          vazio="A série combina unidades diferentes. Consulte a tabela."
        />
      </Painel>

      <Painel titulo="Tabela e download" subtitulo="O CSV inclui fonte, período, universo, base da pergunta e referência.">
        <DownloadCsv
          dados={linhas}
          nomeArquivo={`observa_marica_${rec.filtros.base}.csv`}
          rotulo="Baixar dados selecionados"
          colunas={['base_id','grupo','serie','categoria','valor','unidade','n_base','n_categoria','universo','periodo','fonte','referencia','nota','ordem']}
          delimiter=";"
          bom={true}
        />
        <Tabela
          linhas={tabela}
          colunas={{
            categoria: 'Categoria',
            valor_texto: 'Resultado',
            unidade: 'Unidade',
            n_base: 'n da base',
            n_categoria: 'n da categoria',
            universo: 'Universo',
            periodo: 'Período',
            referencia: 'Referência',
            nota: 'Nota',
          }}
          rotulo="resultados"
          tamanho={12}
        />
      </Painel>
    </>
  )
}
