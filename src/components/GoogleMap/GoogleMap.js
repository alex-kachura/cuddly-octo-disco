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
const icons = {
  marker: 'data:image/png;base64,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',
  home: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAA1UlEQVR42u3Vuw3CMBAGYOeQgDEo6NjCpmEA9yzCy8cELECfDhrGA47ECsIvlORc+ZdcJLb8Kb5cIvoGJB5gjUeRM4RW0jxpZMO/0Ww4ARbLhrso3iqFD1bch650PV1uLjM2PITaeRYclDnFUBY8hbLgKZQFB4UmhvbBqfdZ0RTOikZxdd4H0G580IFZbK/zdj8XB2nQ9wkUI8Xu93vs9LS77HD7pje4Mnd2+F1zp720rifcMBneRdwwXRfYWZT6PYbapMCjwg3Q3S/wADhdy39rX2CbF0PwQrAUEJhyAAAAAElFTkSuQmCC'
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
    this.setMarker = this.setMarker.bind(this)
  }

  componentDidMount() {
    const options = Object.assign({ ...mapOptions }, { ...this.props })

    this.map = new maps.Map(this.gMap, options)

    if (this.props.address) {
      this.setAddress(this.props.address).catch(console.error)
    }
    if (this.props.markers) {
      this.props.markers.forEach(markerAddress => {
        this.addressToLatLng(markerAddress).then(latLng => {
          new maps.Marker({
            position: latLng,
            map: this.map,
            icon: icons.marker
          })
        })
      })
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

  addressToLatLng = (address) => (
    new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === maps.GeocoderStatus.OK) {
          if (status !== maps.GeocoderStatus.ZERO_RESULTS) {
            resolve(results[0].geometry.location)
          } else {
            reject('Geocode not found for this address.')
          }
        } else {
          reject('Geocode not successful due to: ' + status)
        }
      })
    })
  )

  setAddress(address) {
    return new Promise((resolve, reject) => {
      this.addressToLatLng(address)
        .then(latLng => {
          this.map.setCenter(latLng)
          this.setMarker(latLng)

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
        })
    })
  }

  setMarker(latLng) {
    if (this.markerMap) {
      this.markerMap.setMap(null)
    }
    this.markerMap = new maps.Marker({
      position: latLng,
      map: this.map,
      icon: icons.home
    })
    if (this.props.pano) {
      if (this.markerPano) {
        this.markerPano.setMap(null)
      }
      this.markerPano = new maps.Marker({
        position: latLng,
        map: this.pano,
        icon: icons.home
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
