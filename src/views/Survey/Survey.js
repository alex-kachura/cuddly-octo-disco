import React, { Component } from 'react'

import './Survey.css'
import SurveyComponent from '../../components/Survey/Survey'

class Survey extends Component {
  constructor(...args) {
    super(...args)

    this.goToConfirmation = this.goToConfirmation.bind(this)
  }

  goToConfirmation() {
    this.props.history.push('/confirmation')
  }

  render() {
    const surveyOptions = {
      onComplete: this.goToConfirmation
    }

    return (
      <div className="survey">
        {!surveyOptions.heatmap && <h3 className="survey__title">Wycena nieruchomości</h3>}
        <SurveyComponent {...surveyOptions} />
      </div>
    )
  }
}

export default Survey
