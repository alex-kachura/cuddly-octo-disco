import React from 'react'
import PropTypes from 'prop-types'

import './NotFound.css'

const NotFound = ({ id }) =>
  <div className="not-found">
    <h2>Entry {id} not found</h2>
  </div>

NotFound.propTypes = {
  id: PropTypes.string.isRequired
}

export default NotFound
