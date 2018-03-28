import React from 'react'
import { Link } from 'react-router-dom'

import './Header.css'

const Header = () =>
  <div className="header">
    <Link to="/" className="header__logo" />
  </div>

export default Header
