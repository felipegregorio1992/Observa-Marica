import { useState, useEffect } from 'react'
import Papa from 'papaparse'

export function useCsv(arquivo) {
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    fetch(`/dados/${arquivo}.csv`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.text()
      })
      .then(txt => {
        const { data } = Papa.parse(txt, { header: true, skipEmptyLines: true })
        setDados(data)
      })
      .catch(e => setErro(e.message))
  }, [arquivo])

  return { dados, erro }
}
