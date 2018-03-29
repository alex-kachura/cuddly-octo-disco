import React from 'react'
import PropTypes from 'prop-types'

import './MapHeatmap.css'
import config from '../../config'
import GoogleMap from '../../components/GoogleMap/GoogleMap'
import HeatmapOverlay from '../../components/HeatmapOverlay/HeatmapOverlay'

const MapHeatmap = ({ icon, title, data, minLabel, maxLabel, ...rest }) =>
  <div className="map-heatmap">
    <h3><i className={icon} /> {title}</h3>
    <div className="map-heatmap__overlay-wrapper">
      <GoogleMap zoom={17} {...rest} />
      <HeatmapOverlay max={config.heatMapMaxValue} heat={data} />
    </div>
    <div className="map-heatmap__legend">
      <div className="map-heatmap__legend__gradient" />
      <div className="map-heatmap__legend__min">{minLabel}</div>
      <div className="map-heatmap__legend__max">{maxLabel}</div>
    </div>
  </div>

MapHeatmap.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  address: PropTypes.string,
  markers: PropTypes.array,
  data: PropTypes.array.isRequired,
  minLabel: PropTypes.string,
  maxLabel: PropTypes.string
}

export default MapHeatmap
