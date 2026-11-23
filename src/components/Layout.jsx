import React, { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import logoMare from '../assets/logo_mare.png'

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

function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => isActive ? 'ativo' : undefined}
    >
      {label}
    </NavLink>
  )
}

export default function Layout() {
  const loc = useLocation()
  const inPesquisa = loc.pathname === '/nexus' || loc.pathname === '/natal'
  const [aberto, setAberto] = useState(false)
  const fechar = () => setAberto(false)

  return (
    <>
      <a href="#main" className="pular">Pular para o conteúdo</a>
      <header className="site-nav">
        <div className="nav-inner">
          <NavLink to="/panorama" className="nome-site" onClick={fechar}>
            <img src={logoMare} alt="Logo MARÉ" className="nav-logo" />
            Observa Maricá
          </NavLink>

          <button
            className="nav-hamburger"
            aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={aberto}
            onClick={() => setAberto(o => !o)}
          >
            <span /><span /><span />
          </button>

          <nav className={`nav-links${aberto ? ' nav-links--aberto' : ''}`} aria-label="Seções do observatório">
            <NavItem to="/panorama"         label={SECOES.panorama[0]}         onClick={fechar} />
            <NavItem to="/turismo"          label={SECOES.turismo[0]}          onClick={fechar} />
            <NavItem to="/cultura"          label={SECOES.cultura[0]}          onClick={fechar} />
            <NavItem to="/calendario"       label={SECOES.calendario[0]}       onClick={fechar} />
            <NavItem to="/noticias"         label={SECOES.noticias[0]}         onClick={fechar} />
            <NavItem to="/equipamentos"     label={SECOES.equipamentos[0]}     onClick={fechar} />
            <NavItem to="/sustentabilidade" label={SECOES.sustentabilidade[0]} onClick={fechar} />
            <details className="nav-submenu" open={inPesquisa}>
              <summary className={inPesquisa ? 'ativo' : undefined}>Pesquisas</summary>
              <div className="nav-submenu-links">
                <NavItem to="/nexus" label={SECOES.nexus[0]} onClick={fechar} />
                <NavItem to="/natal" label={SECOES.natal[0]} onClick={fechar} />
              </div>
            </details>
            <NavItem to="/fontes"     label={SECOES.fontes[0]}     onClick={fechar} />
            <NavItem to="/governanca" label={SECOES.governanca[0]} onClick={fechar} />
          </nav>
        </div>
      </header>
      <main id="main" className="wrap">
        <Outlet />
      </main>
    </>
  )
}
