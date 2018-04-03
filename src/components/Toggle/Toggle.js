import React from 'react'

import './Toggle.css'

const Toggle = ({ filled, ...inputProps }) =>
  <label className="checkbox">
    <input type="checkbox" {...inputProps} />
    <i className="far fa-toggle-on" />
    {
      filled ?
        <i className="far fa-toggle-on flipped" /> :
        <i className="far fa-toggle-off" />
    }
  </label>

export default Toggle
