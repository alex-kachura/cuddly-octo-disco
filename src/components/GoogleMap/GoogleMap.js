import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './GoogleMap.css'

const maps = window.google.maps
const geocoder = new maps.Geocoder()
const streetService = new maps.StreetViewService()

const PANORAMA_SEARCH_RADIUS = 100
const defaultCoordinates = {
  lat: 52.229688,
  lng: 21.012315
}
const mapOptions = {
  center: defaultCoordinates,
  zoom: 17,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
  keyboardShortcuts: false,
  styles: [
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e9e9e9"
        },
        {
          "lightness": 17
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        },
        {
          "lightness": 20
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#ffffff"
        },
        {
          "lightness": 17
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#ffffff"
        },
        {
          "lightness": 29
        },
        {
          "weight": 0.2
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        },
        {
          "lightness": 18
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        },
        {
          "lightness": 16
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        },
        {
          "lightness": 21
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dedede"
        },
        {
          "lightness": 21
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "visibility": "on"
        },
        {
          "color": "#ffffff"
        },
        {
          "lightness": 16
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "saturation": 36
        },
        {
          "color": "#333333"
        },
        {
          "lightness": 40
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f2f2f2"
        },
        {
          "lightness": 19
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#fefefe"
        },
        {
          "lightness": 20
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#fefefe"
        },
        {
          "lightness": 17
        },
        {
          "weight": 1.2
        }
      ]
    }
  ]
}
const panoOptions = {
  position: defaultCoordinates,
  pov: {
    heading: 35,
    pitch: 25
  },
  panControl: false,
  zoomControl: false,
  addressControl: false,
  fullscreenControl: false,
  motionTrackingControl: false,
  linksControl: false,
  enableCloseButton: false
}

class GoogleMap extends Component {
  constructor(...args) {
    super(...args)

    this.map = null
    this.pano = null
    this.autocomplete = null
    this.markerMap = null
    this.markerPano = null
    this.address = null

    this.setAddress = this.setAddress.bind(this)
    this.setMarkers = this.setMarkers.bind(this)
  }

  componentDidMount() {
    const options = Object.assign({ ...mapOptions }, { ...this.props })

    this.map = new maps.Map(this.gMap, options)

    if (this.props.address) {
      this.setAddress(this.props.address).catch(console.error)
    }

    if (typeof this.props.onMapClick === 'function') {
      maps.event.addListener(this.map, 'click', (event) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        const latLng = { lat, lng }

        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === maps.StreetViewStatus.OK) {
            if (results[0]) {
              this.map.setCenter(latLng)
              this.props.onMapClick(results[0].formatted_address)
            } else {
              console.error('No results found')
            }
          } else {
            console.error('Geocoder failed due to: ' + status)
          }
        })
      })
    }

    const addressInput = document.getElementById('address')
    if (addressInput) {
      this.autocomplete = new maps.places.Autocomplete(addressInput)
      this.autocomplete.bindTo('bounds', this.map)
      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace()

        if (!place.geometry) {
          console.error(`No details available for input: '${place.name}'`)
          return
        }

        if (place.geometry.viewport) {
          this.map.fitBounds(place.geometry.viewport)
        } else {
          this.map.setCenter(place.geometry.location)
        }
        this.map.setZoom(17)

        if (typeof this.props.onMapClick === 'function') {
          this.props.onMapClick(place.formatted_address)
        }
      })
    }

    if (this.props.pano) {
      this.pano = new maps.StreetViewPanorama(this.gPano, panoOptions)
      this.map.setStreetView(this.pano)
    }
  }

  shouldComponentUpdate() {
    return false
  }

  componentWillReceiveProps({ address }) {
    if (!address || address === this.address) {
      return
    }

    this.address = address
    this.setAddress(address).catch(console.error)
  }

  setAddress(address) {
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === maps.GeocoderStatus.OK) {
          if (status !== maps.GeocoderStatus.ZERO_RESULTS) {
            const latLng = results[0].geometry.location

            this.map.setCenter(latLng)
            this.setMarkers(latLng)

            if (this.props.pano) {
              streetService.getPanoramaByLocation(latLng, PANORAMA_SEARCH_RADIUS, (data, status) => {
                if (status === maps.StreetViewStatus.OK) {
                  this.pano.setPano(data.location.pano)
                  this.pano.setPov({
                    heading: maps.geometry.spherical.computeHeading(data.location.latLng, latLng),
                    pitch: 6
                  })
                  resolve(latLng)
                } else {
                  reject('Street View data not found for this location.', status)
                }
              })
            } else {
              resolve(latLng)
            }
          } else {
            reject('Geocode not found for this address.')
          }
        } else {
          reject('Geocode not successful due to: ' + status)
        }
      })
    })
  }

  setMarkers(latLng) {
    if (this.markerMap) {
      this.markerMap.setMap(null)
    }
    this.markerMap = new maps.Marker({
      position: latLng,
      map: this.map
    })
    if (this.props.pano) {
      if (this.markerPano) {
        this.markerPano.setMap(null)
      }
      this.markerPano = new maps.Marker({
        position: latLng,
        map: this.pano
      })
    }
  }

  render() {
    const { pano } = this.props

    return (
      <div className="google-map">
        <div className="google-map__map" ref={(ref) => this.gMap = ref} />
        {pano && <div className="google-map__pano" ref={(ref) => this.gPano = ref} />}
      </div>
    )
  }
}

GoogleMap.propTypes = {
  address: PropTypes.string,
  pano: PropTypes.bool,
  onMapClick: PropTypes.func
}

export default GoogleMap
