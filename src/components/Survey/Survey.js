import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import isEmpty from 'lodash/isEmpty'
import uniqueId from 'lodash/uniqueId'
import noop from 'lodash/noop'
import find from 'lodash/find'

import './Survey.css'
import Store from '../../store/Store'
import config from '../../config'
import Toggle from '../../components/Toggle/Toggle'
import Checkbox from '../../components/Checkbox/Checkbox'
import GoogleMap from '../../components/GoogleMap/GoogleMap'
import HeatmapOverlay from '../HeatmapOverlay/HeatmapOverlay'
import { antiTheft, additionalSecurity, offers } from '../../mocks'

class Survey extends React.PureComponent {
  constructor(...args) {
    super(...args)

    const { prefill, entryId } = this.props

    if (prefill) {
      this.state = { ...find(Store.getValue('entries'), { id: entryId }) }
    } else {
      const initialState = {
        adres: '',
        mieszkanie: false,
        numerMieszkania: '',
        numerKarty: '',
        pzuAuto: false,
        stale: false,
        cesja: false,
        'suwak.Komfort': offers[0].price,
        'suwak.Premium': offers[1].price,
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
          initialState[`${additional.name}.${offer.label}`] = index < 1
        })
      })

      this.state = initialState
    }

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

    if (/^suwak/.test(name)) {
      Object.assign(answers, this.getAdditionalItems(name, offers, value))
    }

    if (/^(dodatkowa|stale)/.test(name)) {
      Object.assign(answers, this.getAdjustedSliderValue(name, offers, answers))
    }

    this.setState({ ...answers })
  }

  getAdditionalItems = (name, offers, value) => {
    const offer = /Komfort$/.test(name) ? offers[0] : offers[1]
    const { label, min, max } = offer
    const delta = (max - min) / 6
    const stale = find(offer.insurances, { name: `stale.${label}` })
    const dodatkowa = find(offer.insurances, { name: `dodatkowa.${label}` })
    const additionalItems = {
      [`dodatkowa.pomoc.${label}`]: true,
      [`dodatkowa.stluczenie.${label}`]: true,
      [`dodatkowa.oc.${label}`]: true,
      [`dodatkowa.prawna.${label}`]: true,
      [`stale.${label}`]: stale.amount,
      [`dodatkowa.${label}`]: dodatkowa.amount,
      [`suwak.${label}`]: max
    }

    if (value < min + delta * 6) {
      additionalItems[`dodatkowa.prawna.${label}`] = false
      additionalItems[`suwak.${label}`] = min + delta * 5
    }
    if (value <= min + delta * 5) {
      additionalItems[`dodatkowa.oc.${label}`] = false
      additionalItems[`suwak.${label}`] = min + delta * 4
    }
    if (value <= min + delta * 4) {
      additionalItems[`dodatkowa.stluczenie.${label}`] = false
      additionalItems[`suwak.${label}`] = min + delta * 3
    }
    if (value <= min + delta * 3) {
      additionalItems[`dodatkowa.pomoc.${label}`] = false
      additionalItems[`suwak.${label}`] = min + delta * 2
    }
    if (value <= min + delta * 2) {
      additionalItems[`dodatkowa.${label}`] = label === 'Komfort' ? '2 500 PLN' : '5 000 PLN'
      additionalItems[`suwak.${label}`] = min + delta
    }
    if (value <= min + delta) {
      additionalItems[`stale.${label}`] = '2 500 PLN'
      additionalItems[`suwak.${label}`] = min
    }

    return additionalItems;
  }

  getAdjustedSliderValue = (name, offers, answers) => {
    const offer = /Komfort$/.test(name) ? offers[0] : offers[1]
    const { label, min, max } = offer
    const delta = (max - min) / 6
    const stale = find(offer.insurances, { name: `stale.${label}` })
    const dodatkowa = find(offer.insurances, { name: `dodatkowa.${label}` })
    let value = min

    if (answers[`stale.${label}`] === stale.amount) value += delta
    if (answers[`dodatkowa.${label}`] === dodatkowa.amount) value += delta
    if (answers[`dodatkowa.pomoc.${label}`]) value += delta
    if (answers[`dodatkowa.stluczenie.${label}`]) value += delta
    if (answers[`dodatkowa.oc.${label}`]) value += delta
    if (answers[`dodatkowa.prawna.${label}`]) value += delta

    return ({
      [`suwak.${label}`]: value
    })
  }

  submitSurvey() {
    const entries = [...Store.getValue('entries')]

    entries.push({
      id: uniqueId(),
      ...this.state,
      insuranceAmount: 3000000,
      name: 'Nowy Klient',
      miasto: 'Warszawa',
    })

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
    const { heatmap, prefill } = this.props
    const { mieszkanie, pakiet, adres, numerMieszkania, numerKarty, pzuAuto, stale, cesja } = this.state

    let mouseHistory;
    let mousePath;
    if (heatmap) {
      mouseHistory = Store.getValue('mouseHistory');
      mousePath = Store.getValue('mousePath');
    }

    return (
      <div className="survey-component" ref={el => this.surveyEl = el}>
        <div className="evaluation">
          <div className="address-row">
            <div className="input-type">
              <label>Typ</label><br />
              <div className={`toggle ${mieszkanie ? 'flat' : 'house'}`}>
                <i className="far fa-home" />
                <Toggle name="mieszkanie" checked={mieszkanie} onChange={this.onAnswerChange}
                        filled />
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

          <GoogleMap address={adres} onMapClick={this.setAddress} pano />

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
          (adres || prefill) &&
          <div className="offer">
            <h3>Oferta dla Ciebie</h3>
            <h6>Możesz przesuwać suwak aby nasz system zmodyfikował ofertę dla Ciebie</h6>

            <div className="package-row">
              <OfferCard
                state={this.state}
                offer={offers[0]}
                onClick={this.selectCard}
                onAnswerChange={this.onAnswerChange}
              />
              <OfferCard
                state={this.state}
                offer={offers[1]}
                onClick={this.selectCard}
                onAnswerChange={this.onAnswerChange}
              />
            </div>

            <div className="slider-row">
              <Slider
                selectedOffer={pakiet}
                offerId={0}
                state={this.state}
                onChange={this.onAnswerChange}
              />
              <Slider
                showMax
                selectedOffer={pakiet}
                offerId={1}
                state={this.state}
                onChange={this.onAnswerChange}
              />
            </div>
          </div>
        }

        {
          (adres || prefill) &&
          <button className="button-default submit" onClick={this.submitSurvey}>Kupuję</button>
        }

        {
          heatmap &&
          <HeatmapOverlay max={config.heatMapMaxValue} heat={mouseHistory} path={mousePath} />
        }
      </div>
    )
  }
}

Survey.propTypes = {
  track: PropTypes.bool,
  heatmap: PropTypes.bool,
  prefill: PropTypes.bool,
  entryId: PropTypes.string,
  onComplete: PropTypes.func
}
Survey.defaultProps = {
  track: true,
  heatmap: false,
  prefill: false,
  entryId: '0',
  onComplete: noop
}

export default Survey

const Slider = ({ showMax, selectedOffer, offerId, state, onChange }) => {
  const offer = offers[offerId];
  const name = `suwak.${offer.label}`;
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
  <div className={classNames("input-field", className)}>
    <label>{label}</label>
    <input {...rest} />
  </div>

const OfferCard = ({ state, offer, onClick, onAnswerChange }) =>
  <div className={classNames("package-card", { selected: offer.id === state.pakiet })}
       onClick={() => onClick(offer.id)}>
    <h2>Pakiet {offer.label}</h2>

    <div className="package-price">
      <i className="far fa-money-bill" />
      <div>
        <h2>{offer.price} PLN</h2>
        Za rok
      </div>
    </div>

    <div className="price-details">
      {
        offer.insurances
          .filter(({ price }) => !!price)
          .map(({ name, label, price }) =>
            <label key={name}>{label}<span>{price}</span></label>
          )
      }
    </div>

    <div className="insurance-items">
      {
        offer.insurances.map(insurance =>
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
