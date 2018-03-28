import React from 'react'
import { Link } from 'react-router-dom'

import './Fork.css'

const Fork = () => (
  <div className="fork">
    <Link to="/survey" className="fork__tile">
      <i className="fas fa-user-alt" />
      <div className="fork__text">Klient</div>
    </Link>

    <Link to="/dashboard" className="fork__tile">
      <i className="fas fa-user-secret" />
      <div className="fork__text">Agent</div>
    </Link>
  </div>
)

export default Fork
