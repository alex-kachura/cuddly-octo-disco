import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import isEmpty from 'lodash/isEmpty'
import uniqueId from 'lodash/uniqueId'

import './Survey.css'
import Store from '../../store/Store'
import config from '../../config'
import { antiTheft, additionalSecurity, offers } from '../../mocks'
import Toggle from '../../components/Toggle/Toggle'
import Checkbox from '../../components/Checkbox/Checkbox'
import GoogleMap from '../../components/GoogleMap/GoogleMap'
import HeatmapOverlay from '../HeatmapOverlay/HeatmapOverlay'

const propTypes = {
  track: PropTypes.bool,
  heatmap: PropTypes.bool,
  prefill: PropTypes.bool,
  onComplete: PropTypes.func
}
const defaultProps = {
  track: true,
  heatmap: false,
  prefill: false,
  onComplete: () => {
  }
}

const mapOfferIdToLabel = ['Komfort', 'Premium']

class Survey extends React.Component {
  constructor(...args) {
    super(...args)

    const initialState = {
      dom: false,
      adres: '',
      mieszkanie: true,
      numerMieszkania: '',
      numerKarty: '',
      pzuAuto: false,
      stale: false,
      cesja: false,
      suwakKomfort: offers[0].price,
      suwakPremium: offers[1].price,
      pakiet: offers[0].id
    }

    antiTheft.forEach(anti => {
      initialState[anti.name] = false
    })

    offers.forEach(offer => {
      offer.insurances.forEach(insurance => {
        initialState[insurance.name] = insurance.amount
      })
      additionalSecurity.forEach((additional, index) => {
        initialState[`${additional.name}${offer.label}`] = index < additionalSecurity.length / 2
      })
    })

    this.state = initialState
    this.mouseHistory = []
    this.mousePath = []
    this.currentMousePos = { x: 0, y: 0, value: 0 }
    this.lastPathEntry = { x: 0, y: 0 }

    this.onAnswerChange = this.onAnswerChange.bind(this)
    this.submitSurvey = this.submitSurvey.bind(this)
    this.setAddress = this.setAddress.bind(this)
    this.selectCard = this.selectCard.bind(this)
    this.saveMousePos = this.saveMousePos.bind(this)
    this.sampleMousePos = this.sampleMousePos.bind(this)
  }

  componentDidMount() {
    if (this.props.prefill) {
      this.setState({ ...Store.getValue('entries')[0] })
    }

    if (this.props.track) {
      window.onmousemove = this.saveMousePos
      this.surveyEl.addEventListener('mousemove', this.saveMousePos)
      this.mouseSampleInterval = window.setInterval(this.sampleMousePos, 100)
    }
  }

  componentWillUnmount() {
    if (this.props.track) {
      this.surveyEl.removeEventListener('mousemove', this.saveMousePos)
      window.clearInterval(this.mouseSampleInterval)
    }
  }


  onAnswerChange(event) {
    const { name, value, checked, type } = event.target
    const answers = { ...this.state }

    answers[name] = type === 'checkbox' ? checked : value

    const {
      dodatkowaPomocKomfort, dodatkowaStluczenieKomfort, dodatkowaOcKomfort, dodatkowaPrawnaKomfort,
      dodatkowaPomocPremium, dodatkowaStluczeniePremium, dodatkowaOcPremium, dodatkowaPrawnaPremium
    } = answers

    if (/^suwak/.test(name)) {
      if (/Komfort$/.test(name)) {
        Object.assign(answers, this.getAdditionalItems(offers[0], value))
      }
      if (/Premium$/.test(name)) {
        Object.assign(answers, this.getAdditionalItems(offers[1], value))
      }
    }
    if (/^dodatkowa/.test(name)) {
      if (/Komfort$/.test(name)) {
        answers.suwakKomfort = this.getAdjustedSliderValue(offers[0], dodatkowaPomocKomfort, dodatkowaStluczenieKomfort, dodatkowaOcKomfort, dodatkowaPrawnaKomfort)
      }
      if (/Premium$/.test(name)) {
        answers.suwakPremium = this.getAdjustedSliderValue(offers[1], dodatkowaPomocPremium, dodatkowaStluczeniePremium, dodatkowaOcPremium, dodatkowaPrawnaPremium)

      }
    }

    this.setState({ ...answers })
  }

  getAdditionalItems = ({ id, price, min, max }, value) => {
    const offer = mapOfferIdToLabel[id]
    const additionalItems = {
      [`dodatkowaPomoc${offer}`]: true,
      [`dodatkowaStluczenie${offer}`]: true,
      [`dodatkowaOc${offer}`]: true,
      [`dodatkowaPrawna${offer}`]: true
    }

    if (value <= price - (price - min) / 2) {
      additionalItems[`dodatkowaStluczenie${offer}`] = false
    }
    if (value <= price) {
      additionalItems[`dodatkowaOc${offer}`] = false
    }
    if (value <= price + (max - price) / 2) {
      additionalItems[`dodatkowaPrawna${offer}`] = false
    }
    if (value <= min) {
      additionalItems[`dodatkowaPomoc${offer}`] = false
    }

    return additionalItems;
  }

  getAdjustedSliderValue = ({ price, min, max }, dodatkowaPomoc, dodatkowaStluczenie, dodatkowaOc, dodatkowaPrawna) => {
    let value = min
    const delta = (max - price) / 2

    if (dodatkowaPomoc) value += delta
    if (dodatkowaStluczenie) value += delta
    if (dodatkowaOc) value += delta
    if (dodatkowaPrawna) value += delta

    return value
  }

  submitSurvey() {
    const entries = Store.getValue('entries')

    entries.push({ ...this.state, id: uniqueId() })

    Store.setValue('entries', entries)
    Store.setValue('mouseHistory', this.mouseHistory)
    Store.setValue('mousePath', this.mousePath)

    this.props.onComplete()
  }

  setAddress(address) {
    const state = { ...this.state }
    state.adres = address
    this.setState({ ...state })
  }

  selectCard(id) {
    this.setState({ pakiet: id })
  }

  saveMousePos(event) {
    if (!this.surveyEl) {
      return
    }
    const surveyDomEl = this.surveyEl
    const {
      pageX,
      pageY
    } = event
    const {
      offsetLeft,
      offsetTop,
      offsetWidth,
      offsetHeight
    } = surveyDomEl

    const x = pageX - offsetLeft
    const y = pageY - offsetTop

    this.currentMousePos = {
      x: x * 100 / offsetWidth,
      y: y * 100 / offsetHeight,
      value: 1
    }

    if (
      Math.abs(this.lastPathEntry.x - x) > config.mousePathThreshold
      || Math.abs(this.lastPathEntry.y - y) > config.mousePathThreshold
    ) {
      this.mousePath.push({ x, y })
      this.lastPathEntry = { x, y }
    }
  }

  sampleMousePos() {
    this.mouseHistory.push(this.currentMousePos)
  }

  render() {
    const mouseHistory = Store.getValue('mouseHistory')
    const mousePath = Store.getValue('mousePath')
    const { heatmap } = this.props
    const { mieszkanie, pakiet, adres, numerMieszkania, numerKarty, pzuAuto, stale, cesja } = this.state

    return (
      <div className="survey-component">
        {!heatmap && <h3>Wycena nieruchomości</h3>}

        <div ref={el => this.surveyEl = el}>
          <div className="evaluation">
            <div className="address-row">
              <div className="input-type">
                <label>Typ</label><br />
                <div className="toggle">
                  <i className="far fa-home" />
                  <Toggle name="mieszkanie" checked={mieszkanie} onChange={this.onAnswerChange} />
                  <i className="far fa-building" />
                </div>
              </div>
              <InputField
                className="input-address"
                label="Adres *"
                id="address"
                placeholder="Wpisz adres"
                name="adres"
                value={adres}
                onChange={this.onAnswerChange}
              />
              {
                mieszkanie &&
                <InputField
                  className="input-flat"
                  label="Nr mieszkania"
                  type="number"
                  placeholder="np. 12"
                  name="numerMieszkania"
                  value={numerMieszkania} onChange={this.onAnswerChange}
                />
              }
            </div>

            <GoogleMap address={adres} onMapClick={this.setAddress} pano={true} />

            <div className="additional-row">
              <InputField
                className="input-karta"
                label="Karta zniżkowa PZU (opcjonalnie)"
                type="number"
                name="numerKarty"
                placeholder="Numer karty"
                value={numerKarty} onChange={this.onAnswerChange}
              />
              <Checkbox
                label="Mam Ubezpieczenie PZU AUTO"
                name="pzuAuto"
                checked={pzuAuto}
                onChange={this.onAnswerChange}
              />
              <Checkbox label="Stałe elementy" name="stale" checked={stale}
                        onChange={this.onAnswerChange} />
              <Checkbox label="Cesja" name="cesja" checked={cesja} onChange={this.onAnswerChange} />
            </div>

            <div className="anti-theft">
              <h6>Posiadane zabezpieczenia przeciwkradzieżowe</h6>
              <CheckboxList items={antiTheft} state={this.state} onChange={this.onAnswerChange} />
            </div>
          </div>

          {
            adres &&
            <div className="offer">
              <h3>Oferta dla Ciebie</h3>
              <h6>Możesz przesuwać suwak aby nasz system zmodyfikował ofertę dla Ciebie</h6>

              <div className="package-row">
                <OfferCard
                  state={this.state}
                  card={offers[0]}
                  onClick={this.selectCard}
                  onAnswerChange={this.onAnswerChange}
                />
                <OfferCard
                  state={this.state}
                  card={offers[1]}
                  onClick={this.selectCard}
                  onAnswerChange={this.onAnswerChange}
                />
              </div>

              <div className="slider-row">
                <Slider
                  selectedOffer={pakiet}
                  offer={offers[0]}
                  state={this.state}
                  onChange={this.onAnswerChange}
                />
                <Slider
                  showMax
                  selectedOffer={pakiet}
                  offer={offers[1]}
                  state={this.state}
                  onChange={this.onAnswerChange}
                />
              </div>
            </div>
          }

          {
            adres &&
            <button className="button-default submit" onClick={this.submitSurvey}>Kupuję</button>
          }

          {heatmap && <HeatmapOverlay max={config.heatMapMaxValue} heat={mouseHistory} path={mousePath} />}
        </div>
      </div>
    )
  }
}

const Slider = ({ showMax, selectedOffer, offer, state, onChange }) => {
  const name = `suwak${offer.label}`;
  return (
    <div className="slider">
      <h3>{offer.label}</h3>
      <input
        type="range"
        className={classNames({ selected: selectedOffer === offer.id })}
        name={name}
        value={state[name]}
        min={offer.min}
        max={offer.max}
        onChange={onChange}
      />
      {!showMax && <h4 className="min">{offer.min} pln</h4>}
      {showMax && <h4 className="max">{offer.max} pln</h4>}
      <h3>{state[name]} PLN</h3>
    </div>
  )
}

const InputField = ({ className, label, ...rest }) =>
  <div className={classNames('input-field', className)}>
    <label>{label}</label>
    <input {...rest} />
  </div>

const OfferCard = ({ state, card, onClick, onAnswerChange }) =>
  <div className={classNames('package-card', { selected: card.id === state.pakiet })}
       onClick={() => onClick(card.id)}>
    <h2>Pakiet {card.label}</h2>

    <div className="package-price">
      <i className="far fa-money-bill" />
      <div>
        <h2>{card.price} PLN</h2>
        Za rok
      </div>
    </div>

    <div className="price-details">
      {
        card.insurances
          .filter(({ price }) => !!price)
          .map(({ name, label, price }) =>
            <label key={name}>{label}<span>{price}</span></label>
          )
      }
    </div>

    <div className="insurance-items">
      {
        card.insurances.map(insurance =>
          <InsuranceItem key={insurance.name} {...insurance} state={state}
                         onAnswerChange={onAnswerChange} />
        )
      }
    </div>
  </div>

const InsuranceItem = ({ name, label, amount, items, state, onAnswerChange }) =>
  <div className="insurance-row">
    <div className="insurance-row__name">{label}</div>
    <div className="input-field insurance-row__amount">
      <input name={name} value={state[name]} onChange={onAnswerChange} />
    </div>
    {!isEmpty(items) && <CheckboxList items={items} state={state} onChange={onAnswerChange} />}
  </div>

const CheckboxList = ({ items, state, onChange }) =>
  <ul className="checkbox-list">
    {
      items.map(({ name, icon, label }) =>
        <li key={name}>
          <i className={`far ${icon}`} />
          <Checkbox label={label} name={name} checked={state[name]} onChange={onChange} />
        </li>
      )
    }
  </ul>

Survey.propTypes = propTypes
Survey.defaultProps = defaultProps

export default Survey
