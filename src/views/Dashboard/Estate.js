import React from 'react'
import find from 'lodash/find'

import './Estate.css'
import Store from '../../store/Store'
import MapHeatmap from '../../components/MapHeatmap/MapHeatmap'
import Checkbox from '../../components/Checkbox/Checkbox'
import { heat1 } from '../../mocks'

const Estate = ({ match }) => {
  const id = +match.params.id
  const entry = find(Store.getValue('entries'), { id })

  if (!entry) {
    return (
      <div className="estate">
        <h2>Entry {id} not found</h2>
      </div>
    )
  }

  return (
    <div className="estate">
      <div className="breadcrumbs">
        <a href="/dashboard" className="link">Oferty klientów</a>
        <i className="fal fa-angle-right" />
        <a href={`/dashboard/${id}`} className="link">Oferta#{id}</a>
        <i className="fal fa-angle-right" />Analiza nieruchomości
      </div>

      <h3><i className="far fa-building" /> Oferta#{id} - analiza nieruchomości</h3>
      <h5>{entry.adres}</h5>

      <div className="estate__content">
        <div className="estate__content__filters">
          <div className="default-filters">
            <label className="filter">
              <span>Obszar</span>
              <select>
                <option>Centrum, Mokotów, Warszawa</option>
              </select>
            </label>
            <div className="filter">
              <span>Rodzaj nieruchomości</span>
              <div>
                <Checkbox defaultChecked
                  label={<span><i className={`far fa-building`} /> Mieszkania</span>}
                />
                <Checkbox defaultChecked
                  label={<span><i className={`far fa-home`} /> Domy</span>}
                />
              </div>
            </div>
            <label className="filter">
              <span>Miesięczny koszt</span>
              <select>
                <option>> 500 PLN</option>
              </select>
            </label>
            <label className="filter">
              <span>Kwota ubezpieczenia</span>
              <select>
                <option>> 1 000 000 PLN</option>
              </select>
            </label>
          </div>
        </div>
        <div className="estate__content__maps">
          <MapHeatmap
            icon="far fa-money-bill"
            title="Ceny ubezpieczeń w okolicy"
            address={entry.adres}
            data={heat1}
            minLabel="50 000"
            maxLabel="250 000+"
          />
          <MapHeatmap
            icon="far fa-unlock"
            title="Bezpieczeństwo okolicy"
            address={entry.adres}
            data={heat1}
            minLabel="Niska przestępczość"
            maxLabel="Wysoka przestępczość"
          />
          <MapHeatmap
            icon="i icon-weather"
            title="Zagrożenia powodziowe"
            address={entry.adres}
            data={heat1}
            minLabel="Mała szansa"
            maxLabel="Duża szansa"
          />
          <MapHeatmap
            icon="far fa-fire"
            title="Zagrożenia pożarowe"
            address={entry.adres}
            data={heat1}
            minLabel="Mała szansa"
            maxLabel="Duża szansa"
          />
        </div>
      </div>
    </div>
  )
}

export default Estate
