// Libs
import React from 'react'
import ReactTooltip from 'react-tooltip'

// Module
import './Tooltip.css'


const Tooltip = ({ ...props, children, text }) => (
  <ReactTooltip
    className="tooltip"
    effect="solid"
    type="light"
    place="top"
    {...props}
  >
    {text || children}
  </ReactTooltip>
)

export default Tooltip
