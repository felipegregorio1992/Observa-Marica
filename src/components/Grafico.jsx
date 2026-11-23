import React, { useEffect, useRef } from 'react'
import Plotly from 'plotly.js-basic-dist'

export default function Grafico({ figura, rotulo, altura = 300, vazio = 'Sem resultados' }) {
  const ref = useRef(null)

  const isEmpty = !figura || !figura.traces || figura.traces.length === 0

  useEffect(() => {
    if (isEmpty || !ref.current) return
    Plotly.newPlot(ref.current, figura.traces, figura.layout, {
      responsive: true,
      displayModeBar: false,
      scrollZoom: false,
    })
    return () => {
      if (ref.current) Plotly.purge(ref.current)
    }
  // ponytail: deep comparison not needed; figura identity changes on new data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [figura])

  return (
    <div>
      {rotulo && <p className="panel-sub">{rotulo}</p>}
      {isEmpty
        ? <p className="grafico-vazio">{vazio}</p>
        : <div ref={ref} className="grafico" style={{ '--altura-grafico': altura + 'px' }} />
      }
    </div>
  )
}
