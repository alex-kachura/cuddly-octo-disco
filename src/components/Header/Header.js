import React from 'react'
import { Link } from 'react-router-dom'

import './Header.css'

const Header = () =>
  <div className="header">
    <Link to="/" className="header__logo" />
    {renderTabs(window.location.pathname)}
  </div>

const renderTabs = (pathname) =>
  /\/survey/.test(pathname) ?
    <div className="header__tab">Ubezpieczenie</div> :
    /\/dashboard/.test(pathname) ?
      <div className="header__tab">Oferty klientów</div> :
      null

export default Header
