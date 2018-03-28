import React from 'react'
import ReactHeatmap from 'react-heatmap'
import { PathLine } from 'react-svg-pathline'
import isEmpty from 'lodash/isEmpty'

import './HeatmapOverlay.css'

const HeatmapOverlay = ({ max, heat, path }) => {
  const heatmapElement = isEmpty(heat) ? null : (
    <div className="heatmap-overlay__heatmap">
      <ReactHeatmap max={max} data={heat} />
    </div>
  )

  const mousePathElement = isEmpty(path) ? null : (
    <svg className="heatmap-overlay__mouse-path">
      <PathLine
        points={path}
        stroke="#014282"
        strokeWidth="1.5"
        fill="none"
        r={1}
      />
    </svg>
  )

  return (
    <div className="heatmap-overlay">
      {heatmapElement}
      {mousePathElement}
    </div>
  )
}

export default HeatmapOverlay
