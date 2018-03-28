import React from 'react'

import './MapHeatmap.css'
import config from '../../config'
import GoogleMap from '../../components/GoogleMap/GoogleMap'
import HeatmapOverlay from '../../components/HeatmapOverlay/HeatmapOverlay'

const MapHeatmap = ({ icon, title, data, minLabel, maxLabel }) =>
  <div className="map-heatmap">
    <h3><i className={icon} /> {title}</h3>
    <div className="map-heatmap__overlay-wrapper">
      <GoogleMap zoom={13} />
      <HeatmapOverlay max={config.heatMapMaxValue} heat={data} />
    </div>
    <div className="map-heatmap__legend">
      <div className="map-heatmap__legend__gradient" />
      <div className="map-heatmap__legend__min">{minLabel}</div>
      <div className="map-heatmap__legend__max">{maxLabel}</div>
    </div>
  </div>

export default MapHeatmap
