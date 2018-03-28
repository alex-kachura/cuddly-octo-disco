import React from 'react'

import './Confirmation.css'

const Confirmation = ({ history }) => (
  <div className="confirmation">
    <div className="confirmation__container">
      <div className="confirmation__head">
        <div className="confirmation__head-text">
          Dziękujemy, ankieta została przesłana.<br />
          Odpowiemy na nią w ciągu 24h.
        </div>
      </div>
      <div className="confirmation__main">
        <button className="confirmation__button" onClick={() => history.push('/')}> Na główną</button>
      </div>
    </div>
  </div>
)

export default Confirmation
