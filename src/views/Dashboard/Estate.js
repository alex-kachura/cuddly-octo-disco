import React from 'react'
import find from 'lodash/find'

import './Estate.css'
import { heat1 } from '../../mocks'
import Store from '../../store/Store'
import MapHeatmap from '../../components/MapHeatmap/MapHeatmap'

const Estate = ({ match }) => {
  const id = match.params.id
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
        <a href="/dashboard" className="link">
          Oferty klientów
        </a> <i className="fal fa-angle-right" /> <a href={`/dashboard/${id}`} className="link">
          Oferta#{id}
        </a> <i className="fal fa-angle-right" /> Analiza nieruchomości
      </div>

      <h3><i className="far fa-building" /> Oferta#{id} - Analiza nieruchomości</h3>
      <h5>{entry.adres}</h5>

      <div className="estate__content">
        <div className="estate__content__filters"></div>
        <div className="estate__content__maps">
          <MapHeatmap
            icon="far fa-money-bill"
            title="Ceny ubezpieczeń w okolicy"
            data={heat1}
            minLabel="50 000"
            maxLabel="250 000+"
          />
          <MapHeatmap
            icon="far fa-unlock"
            title="Bezpieczeństwo okolicy"
            data={heat1}
            minLabel="Niska przestępczość"
            maxLabel="Wysoka przestępczość"
          />
          <MapHeatmap
            icon="i icon-weather"
            title="Zagrożenia powodziowe"
            data={heat1}
            minLabel="Mała szansa"
            maxLabel="Duża szansa"
          />
          <MapHeatmap
            icon="far fa-fire"
            title="Zagrożenia pożarowe"
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
