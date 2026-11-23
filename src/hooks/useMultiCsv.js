import { useState, useEffect } from 'react'
import Papa from 'papaparse'

export function useMultiCsv(arquivos) {
  // arquivos: { chave: 'nome_arquivo', ... }
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    const chaves = Object.keys(arquivos)
    const nomes = Object.values(arquivos)

    Promise.all(
      nomes.map(nome =>
        fetch(`/dados/${nome}.csv`)
          .then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status} em ${nome}.csv`)
            return r.text()
          })
          .then(txt => Papa.parse(txt, { header: true, skipEmptyLines: true }).data)
      )
    )
      .then(resultados => {
        setDados(Object.fromEntries(chaves.map((k, i) => [k, resultados[i]])))
        setCarregando(false)
      })
      .catch(e => {
        setErro(e.message)
        setCarregando(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { dados, carregando, erro }
}
