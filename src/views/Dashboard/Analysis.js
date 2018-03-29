import React from 'react'
import find from 'lodash/find'

import './Analysis.css'
import Store from '../../store/Store'
import Survey from '../../components/Survey/Survey'

const Analysis = ({ match }) => {
  const id = match.params.id
  const entry = find(Store.getValue('entries'), { id })

  if (!entry) {
    return (
      <div className="analysis">
        <h2>Entry {id} not found</h2>
      </div>
    )
  }

  return (
    <div className="analysis">
      <div className="breadcrumbs">
        <a href="/dashboard" className="link">Oferty klientów</a>
        <i className="fal fa-angle-right" />
        <a href={`/dashboard/${id}`} className="link">Oferta#{id}</a>
        <i className="fal fa-angle-right" />Analiza zachowania
      </div>

      <h3>Analiza zachowania</h3>

      <div className="analysis__wrapper">
        <div className="analysis__survey">
          <Survey track={false} heatmap prefill />
        </div>
        <div className="analysis__notes">
          <h3>Wnioski</h3>

          <ul>
            <li><i className="far fa-clock" /> 1. Klient spędził 2 minuty przy wyborze miejsca nieruchomości </li>
            <li><i className="i icon-answer-change" /> 2. Klient zmieniał opcje wielokrotnie </li>
            <li> <i className="i icon-answer-change" /> 3. Klient zmieniał opcje wielokrotnie w zakresie od 250 do 400 PLN</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Analysis
