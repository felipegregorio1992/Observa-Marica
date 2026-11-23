import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

export const SECOES = {
  panorama:         ['Panorama', 'Observatório Municipal de Cultura e Turismo', 'Informação integrada para políticas públicas', 'Maricá · RJ', 'Atualização de 20/11/2026'],
  turismo:          ['Turismo e economia', 'Demanda Turística, Economia e Oferta', 'Indicadores de visitantes, permanência, oferta e efeitos econômicos', 'Dimensões 1 e 2', 'Matriz do TCC'],
  cultura:          ['Cultura e criatividade', 'Cultura e Economia Criativa', 'Programação, participação, território, agentes e investimento cultural', 'Dimensão 3', 'Matriz do TCC'],
  calendario:       ['Calendário de eventos', 'Calendário Oficial de Eventos 2026', 'Agenda anual, datas e responsáveis', 'Diário Oficial de Maricá', 'Edição de 12/03/2026'],
  noticias:         ['Notícias da MARÉ', 'Notícias e Comunicação Pública da MARÉ', 'Publicações do Instagram por período, formato e tema', 'Fonte institucional', 'Base da MARÉ'],
  equipamentos:     ['Equipamentos e território', 'Equipamentos Culturais e Turísticos', 'Situação, previsão, categoria e distribuição territorial', 'Atualização institucional', 'Abril de 2026'],
  sustentabilidade: ['Sustentabilidade e inclusão', 'Sustentabilidade, Inclusão e Bem-Estar', 'Acessibilidade, resíduos, bem-estar e pressão territorial', 'Dimensão 4', 'Indicadores a implantar'],
  nexus:            ['Pesquisa Nexus', 'Pesquisa Nexus com turistas', 'Perfil, avaliação, atrativos e intenção de retorno', 'Maricá · maio de 2026', 'Pesquisas de campo'],
  natal:            ['Natal Brasilidade', 'Natal Brasilidade 2025', 'Experiência do público e percepções do comércio', 'Instituto Darcy Ribeiro', 'Pesquisas de campo'],
  fontes:           ['Fontes e atualizações', 'Fontes e atualizações', 'Indicadores territoriais, comunicados e referências', 'Consulta em 20/11/2026', 'Rastreabilidade'],
  governanca:       ['Governança e metodologia', 'Governança de Dados e Metodologia', 'Qualidade, atualização, documentação, rastreabilidade e uso da evidência', 'Dimensão 5', 'Capacidade institucional'],
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => isActive ? 'ativo' : undefined}
    >
      {label}
    </NavLink>
  )
}

export default function Layout() {
  const loc = useLocation()
  const inPesquisa = loc.pathname === '/nexus' || loc.pathname === '/natal'

  return (
    <>
      <a href="#main" className="pular">Pular para o conteúdo</a>
      <header className="site-nav">
        <div className="nav-inner">
          <NavLink to="/panorama" className="nome-site">Observa Maricá</NavLink>
            <nav className="nav-links" aria-label="Seções do observatório">
            <NavItem to="/panorama" label={SECOES.panorama[0]} />
            <NavItem to="/turismo" label={SECOES.turismo[0]} />
            <NavItem to="/cultura" label={SECOES.cultura[0]} />
            <NavItem to="/calendario" label={SECOES.calendario[0]} />
            <NavItem to="/noticias" label={SECOES.noticias[0]} />
            <NavItem to="/equipamentos" label={SECOES.equipamentos[0]} />
            <NavItem to="/sustentabilidade" label={SECOES.sustentabilidade[0]} />
            <details className="nav-submenu" open={inPesquisa}>
              <summary className={inPesquisa ? 'ativo' : undefined}>Pesquisas</summary>
              <div className="nav-submenu-links">
                <NavItem to="/nexus" label={SECOES.nexus[0]} />
                <NavItem to="/natal" label={SECOES.natal[0]} />
              </div>
            </details>
            <NavItem to="/fontes" label={SECOES.fontes[0]} />
            <NavItem to="/governanca" label={SECOES.governanca[0]} />
          </nav>
        </div>
      </header>
      <main id="main" className="wrap">
        <Outlet />
      </main>
    </>
  )
}
