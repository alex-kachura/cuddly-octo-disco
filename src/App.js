import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import './App.css'
import Survey from './views/Survey/Survey'
import Fork from './views/Fork/Fork'
import Confirmation from './views/Confirmation/Confirmation'
import Dashboard from './views/Dashboard/Dashboard'
import Entry from './views/Dashboard/Entry'
import Analysis from './views/Dashboard/Analysis'
import Estate from './views/Dashboard/Estate'
import Header from './components/Header/Header'
import Store from './store/Store'
import {
  entries,
  mouseHistory,
  mousePath,
} from './mocks'

class App extends React.Component {
  constructor(...args) {
    super(...args)

    Store.reset()

    // setting mock values:
    Store.setValue('entries', entries)
    Store.setValue('mouseHistory', mouseHistory);
    Store.setValue('mousePath', mousePath);
  }

  render() {
    return (
      <Router>
        <div className="app">
          <Header />
          <Route exact path="/" component={Fork} />
          <Route exact path="/survey" component={Survey} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/dashboard/:id" component={Entry} />
          <Route exact path="/dashboard/:id/analysis" component={Analysis} />
          <Route exact path="/dashboard/:id/estate" component={Estate} />
          <Route exact path="/confirmation" component={Confirmation} />
        </div>
      </Router>
    )
  }
}

export default App
