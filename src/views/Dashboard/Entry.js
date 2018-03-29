import React from 'react'
import ReactTooltip from 'react-tooltip'
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie'
import find from 'lodash/find'
import classNames from 'classnames'
import isEmpty from 'lodash/isEmpty'

import './Entry.css'
import Store from '../../store/Store'
import Modal from '../../components/Modal/Modal'
import Checkbox from '../../components/Checkbox/Checkbox'
import GoogleMap from '../../components/GoogleMap/GoogleMap'
import MapHeatmap from '../../components/MapHeatmap/MapHeatmap'
import { antiTheft, offers, pzuServices, additionalOptions, suggestions, heat1 } from '../../mocks'

class Entry extends React.Component {
  constructor(...args) {
    super(...args)

    const { cookies } = this.props;

    this.state = {
      isAdvancedMode: cookies.get('isAdvancedMode') === 'true',
      isShowAnalysisModal: false,
      isShowNeighborhoodModal: false
    }

    this.toggleAdvancedMode = this.toggleAdvancedMode.bind(this)
  }

  toggleAdvancedMode(isAdvancedMode) {
    const { cookies } = this.props;

    cookies.set('isAdvancedMode', isAdvancedMode)
    this.setState({ isAdvancedMode })
  }

  render() {
    const id = +this.props.match.params.id
    const { isAdvancedMode } = this.state
    const entry = find(Store.getValue('entries'), { id })
    const offer = offers[entry.pakiet]

    if (!entry) {
      return (
        <div className="entry">
          <h2>Entry {id} not found</h2>
        </div>
      )
    }

    return (
      <div className="entry">
        <div className="breadcrumbs">
          <a href="/dashboard" className="link">Oferty klientów</a>
          <i className="fal fa-angle-right" />Oferta#{id}
        </div>

        <div className="mode-toggle">
          <label>Tryb</label>
          <button
            className={classNames("button-toggle", { active: !isAdvancedMode })}
            onClick={() => this.toggleAdvancedMode(false)}
          >
            Domyślny
          </button>
          <button
            className={classNames("button-toggle", { active: isAdvancedMode })}
            onClick={() => this.toggleAdvancedMode(true)}
          >
            Zaawansowany
          </button>
        </div>

        <h3>Oferta#{id}</h3>

        <div className="entry__sections">
          <div className="entry__section entry__section--survey">
            <div className="entry__section__header">
              <h3><i className="far fa-clipboard-list" /> Oferta klienta</h3>
              <a href={`/dashboard/${id}/analysis`} className="link">Analiza zachowania</a>
            </div>

            <OfferCard
              state={{ ...entry }}
              offer={offer}
              onAnalysisClick={() => this.setState({ isShowAnalysisModal: true })}
            />
          </div>

          <div className={classNames("entry__section entry__section--client", {
            'entry__section--client--grow': !isAdvancedMode
          })}>
            <div>
              <div className="entry__section__header">
                <h3><i className="far fa-user" /> Dane klienta</h3>
              </div>

              <h5>{entry.name}</h5>

              <div className="personal-details">
                <h6>Dane osobowe</h6>
                <div className="personal-details__lists">
                  <ul>
                    <li><i className="far fa-mars" /> Mężczyzna</li>
                    <li><i className="far fa-calendar" /> 37 lat</li>
                    <li><i className="far fa-users" /> 3-osobowa rodzina</li>
                  </ul>
                  <ul>
                    <li><i className="far fa-home" /> 1 nieruchomość</li>
                    <li><i className="far fa-money-bill" /> Zamożny</li>
                    <li><i className="far fa-desktop" /> Macbook Air 2017</li>
                    <li><i className="far fa-mobile" /> Iphone X</li>
                  </ul>
                </div>
              </div>

              <div className="personal-details">
                <h6>Usługi PZU</h6>
                <CheckboxList items={pzuServices} />
              </div>
            </div>

            <div className="entry__section--client__footer">
              <button className="button-default">Kontakt z klientem</button>
            </div>
          </div>

          {
            isAdvancedMode &&
            <div className="entry__section entry__section--address">
              <div className="entry__section__header">
                <h3><i className={classNames("far", {
                  'fa-building': entry.mieszkanie,
                  'fa-home': !entry.mieszkanie
                })} /> Dane nieruchomości</h3>
                <a className="link" href={`/dashboard/${id}/estate`}>Analiza nieruchomości</a>
              </div>

              <div className="entry__address">
                <div className="entry__address__map">
                  <div className="entry__address__map__top">
                    <h5>{entry.adres}</h5>
                  </div>

                  <GoogleMap address={entry.adres} />
                </div>

                <div className="entry__address__details">
                  <h6>Szacowana wartość</h6>
                  <h5>350 000 PLN</h5>

                  <h6>Szczegóły</h6>
                  <p>
                    52 m2<br />
                    7(10) piętro
                  </p>

                  <h6>Zabezpieczenia przeciwkradzieżowe</h6>
                  <CheckboxList items={antiTheft} state={{ ...entry }} />

                  <h6>Dodatkowe opcje</h6>
                  <CheckboxList items={additionalOptions} state={{ ...entry }} />
                </div>
              </div>
            </div>
          }
        </div>

        {
          isAdvancedMode &&
          <div className="entry__suggestions">
            <h3><i className="fal fa-clipboard-list" /> Sugestie dla oferty klienta</h3>

            <h6>Maksymalna propozycja zwiększenia oferty to <strong>100 PLN</strong></h6>

            <div className="suggestions">

              <div className="suggestions__suggestion">
                <div className="suggestions__suggestion__icon" />
                <div className="suggestions__suggestion__label">Propozycja</div>
                <div className="suggestions__suggestion__text">Dodatkowa ochrona okien</div>
                <div className="suggestions__suggestion__label">Powód</div>
                <div className="suggestions__suggestion__text">
                  Duży współczynnik rozbić szyb w okolicy.
                </div>
                <a className="link"
                   onClick={() => this.setState({ isShowNeighborhoodModal: true })}>Zobacz
                  analizę okolicy</a>
              </div>

              <div className="suggestions__suggestion">
                <div
                  className="suggestions__suggestion__icon suggestions__suggestion__icon--upsell" />
                <div className="suggestions__suggestion__label">Propozycja</div>
                <div className="suggestions__suggestion__text">
                  Zwiększenie wartości nieruchomości
                </div>
                <div className="suggestions__suggestion__label">Powód</div>
                <div className="suggestions__suggestion__text">
                  Inne domy w okolicy są ubezpieczone o średnio <strong>50 000
                  więcej</strong>.
                </div>
                <a className="link" onClick={() => this.setState({ isShowAnalysisModal: true })}>Zobacz
                  analizę okolicy</a>
              </div>

              <div className="suggestions__suggestion">
                <div
                  className="suggestions__suggestion__icon suggestions__suggestion__icon--upsell" />
                <div className="suggestions__suggestion__label">Propozycja</div>
                <div className="suggestions__suggestion__text">Zwiększenie ceny o 100 PLN</div>
                <div className="suggestions__suggestion__label">Powód</div>
                <div className="suggestions__suggestion__text">
                  Klient wahał się pzy wyborze ceny końcowej.
                </div>
                <a className="link" href={`/dashboard/${id}/analysis`}>Zobacz analizę zachowania</a>
              </div>

              <div className="suggestions__suggestion">
                <div
                  className="suggestions__suggestion__icon suggestions__suggestion__icon--upsell" />
                <div className="suggestions__suggestion__label">Propozycja</div>
                <div className="suggestions__suggestion__text">Zwiększenie ceny o 100 PLN</div>
                <div className="suggestions__suggestion__label">Powód</div>
                <div className="suggestions__suggestion__text">Klient jest zamożny.</div>
              </div>

            </div>
          </div>
        }

        <Modal
          isShown={this.state.isShowAnalysisModal}
          onClose={() => this.setState({ isShowAnalysisModal: false })}
        >
          <AnalysisModal address={entry.adres} />
        </Modal>

        <Modal
          isShown={this.state.isShowNeighborhoodModal}
          onClose={() => this.setState({ isShowNeighborhoodModal: false })}
        >
          <NeighborhoodModal address={entry.adres} />
        </Modal>
      </div>
    )
  }
}

Entry.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired
}

export default withCookies(Entry)

const OfferCard = ({ state, offer, onAnalysisClick }) =>
  <div className={classNames("package-card", { selected: offer.id === state.pakiet })}>
    <h3>Pakiet {offer.label}</h3>

    <div className="package-price">
      <h4>{state[`suwak.${offer.label}`]} PLN</h4>
      Za rok
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
          <InsuranceItem
            key={insurance.name}
            id={insurance.name}
            {...insurance}
            state={state}
            onAnalysisClick={onAnalysisClick}
          />
        )
      }
    </div>
  </div>

const InsuranceItem = ({ label, amount, items, state, id, onAnalysisClick }) =>
  <div className="insurance-row">
    <div className="insurance-row__name">{label}</div>
    <div className="input-field insurance-row__amount">
      {
        !isEmpty(suggestions[id]) &&
        <Suggestion {...suggestions[id]} id={id} onAnalysisClick={onAnalysisClick} />
      }
      <input name={id} defaultValue={amount} />
    </div>
    {!isEmpty(items) && <CheckboxList items={items} state={state} />}
  </div>

const CheckboxList = ({ items, state = {} }) =>
  <ul className="checkbox-list">
    {
      items.map(({ name, icon, label, value }) =>
        <li key={name}>
          {icon && <i className={`far ${icon}`} />}
          <Checkbox label={label} name={name} defaultChecked={state[name] || value} disabled />
          {!isEmpty(suggestions[name]) && <Suggestion {...suggestions[name]} id={name} />}
        </li>
      )
    }
  </ul>

const Suggestion = ({ suggestion, reason, link, type, id, onAnalysisClick }) =>
  <div className="suggestion">
    <div
      className={classNames("suggestion__icon", { 'suggestion__icon--upsell': type === 'upsell' })}
      data-tip data-event="click" data-for={id} />
    {
      suggestion &&
      <ReactTooltip place="right" type="light" effect="solid" globalEventOff="click" id={id}>
        <div className={classNames("suggestion__data", {
          'suggestion__data--with-link': link,
          'suggestion__data--upsell': type === 'upsell'
        })}>
          <div className="suggestion__data__label">Propozycja</div>
          <div className="suggestion__data__text">{suggestion}</div>
          <div className="suggestion__data__label">Powód</div>
          <div className="suggestion__data__text">{reason}</div>
          {link && <a className="link" onClick={onAnalysisClick}>{link}</a>}
        </div>
        <i className="fal fa-times" />
      </ReactTooltip>
    }
  </div>

const AnalysisModal = ({ address }) =>
  <div className="analysis-modal">
    <div className="analysis-modal__header">
      <h3>
        <div className="suggestion__icon suggestion__icon--upsell" />
        Analiza upsell
      </h3>
    </div>
    <div className="analysis-modal__content">
      <h6>Sugestia</h6>
      <div className="suggestion__data suggestion__data--upsell">
        <div className="suggestion__data__label">Propozycja</div>
        <div className="suggestion__data__text">Zwiększenie wartości nieruchomości</div>
        <div className="suggestion__data__label">Powód</div>
        <div className="suggestion__data__text">
          Inne domy w okolicy są ubezpieczone o średnio <strong>50 000 więcej</strong>.
        </div>
      </div>

      <MapHeatmap
        icon="far fa-money-bill"
        title="Ceny ubezpieczeń w okolicy"
        address={address}
        data={heat1}
        minLabel="50 000"
        maxLabel="250 000+"
      />
    </div>
  </div>

const NeighborhoodModal = ({ address }) =>
  <div className="analysis-modal">
    <div className="analysis-modal__header">
      <h3>
        <div className="suggestion__icon" />
        Analiza upsell
      </h3>
    </div>
    <div className="analysis-modal__content">
      <h6>Sugestia</h6>
      <div className="suggestion__data suggestion__data--upsell">
        <div className="suggestion__data__label">Propozycja</div>
        <div className="suggestion__data__text">Dodatkowa ochrona okien</div>
        <div className="suggestion__data__label">Powód</div>
        <div className="suggestion__data__text">Duży współczynnik rozbić szyb w okolicy.</div>
      </div>

      <MapHeatmap
        icon="far fa-unlock"
        title="Bezpieczeństwo okolicy"
        address={address}
        data={heat1}
        minLabel="Niska przestępczość"
        maxLabel="Wysoka przestępczość"
      />
    </div>
  </div>
