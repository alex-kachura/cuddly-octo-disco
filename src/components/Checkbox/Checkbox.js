import React from 'react'

import './Checkbox.css'

const Checkbox = ({ label, ...rest }) =>
  <label className="checkbox">
    <input type="checkbox" {...rest} /><i className="fal fa-check-square" /><i className="fal fa-square" />
    {label}
  </label>

export default Checkbox
