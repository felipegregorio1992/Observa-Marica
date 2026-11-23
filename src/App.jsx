import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Panorama from './pages/Panorama'
import Noticias from './pages/Noticias'
import Cultura from './pages/Cultura'
import Turismo from './pages/Turismo'
import Calendario from './pages/Calendario'
import Equipamentos from './pages/Equipamentos'
import Sustentabilidade from './pages/Sustentabilidade'
import Governanca from './pages/Governanca'
import Fontes from './pages/Fontes'
import Pesquisa from './pages/Pesquisa'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/panorama" replace />} />
        <Route path="panorama" element={<Panorama />} />
        <Route path="noticias" element={<Noticias />} />
        <Route path="cultura" element={<Cultura />} />
        <Route path="turismo" element={<Turismo />} />
        <Route path="calendario" element={<Calendario />} />
        <Route path="equipamentos" element={<Equipamentos />} />
        <Route path="sustentabilidade" element={<Sustentabilidade />} />
        <Route path="governanca" element={<Governanca />} />
        <Route path="fontes" element={<Fontes />} />
        <Route path="nexus" element={<Pesquisa secao="nexus" />} />
        <Route path="natal" element={<Pesquisa secao="natal" />} />
        <Route path="*" element={<Navigate to="/panorama" replace />} />
      </Route>
    </Routes>
  )
}
