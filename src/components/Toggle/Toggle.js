import React from 'react'

import './Toggle.css'

const Toggle = ({ ...inputProps }) =>
  <label className="checkbox">
    <input type="checkbox" {...inputProps} />
    <i className="far fa-toggle-on" />
    <i className="far fa-toggle-off" />
  </label>

export default Toggle
