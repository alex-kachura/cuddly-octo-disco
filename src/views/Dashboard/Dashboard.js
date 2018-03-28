import React from 'react'

import './Dashboard.css'
import Store from '../../store/Store'
import Toggle from '../../components/Toggle/Toggle'
import Checkbox from '../../components/Checkbox/Checkbox'
import GoogleMap from '../../components/GoogleMap/GoogleMap'

export default class Dashboard extends React.Component {
  constructor(...args) {
    super(...args)

    this.state = {
      isShowMap: true
    }

    this.toggleMap = this.toggleMap.bind(this)
  }

  toggleMap() {
    this.setState({ isShowMap: !this.state.isShowMap })
  }

  toEntryDetails = (id) => {
    this.props.history.push(`/dashboard/${id}`)
  }

  render() {
    const { isShowMap } = this.state
    const entries = Store.getValue('entries')

    return (
      <div className="dashboard">
        <div className="dashboard__table-wrap">
          <table className="table">
            <caption>
              <div className="table__caption">
                <h3>Lista ofert</h3>
                <div className="toggle">
                  <i className="far fa-map" />
                  <Toggle checked={isShowMap} onChange={this.toggleMap} />
                </div>
              </div>
            </caption>

            <thead className="table__head">
              <tr className="table__head__filters">
                <th colSpan="8">
                  <div>
                    <label className="filter">
                      <span>Obszar</span>
                      <select>
                        <option>Centrum, Mokotów, Warszawa</option>
                      </select>
                    </label>
                    <div className="filter">
                      <span>Rodzaj nieruchomości</span>
                      <div>
                        <Checkbox
                          label={<span><i className={`far fa-building`} /> Mieszkania</span>}
                        />
                        <Checkbox
                          label={<span><i className={`far fa-home`} /> Domy</span>}
                        />
                      </div>
                    </div>
                    <label className="filter">
                      <span>Miesięczny koszt</span>
                      <select>
                        <option>Powyżej 500 PLN</option>
                      </select>
                    </label>
                    <label className="filter">
                      <span>Kwota ubezpieczenia</span>
                      <select>
                        <option>Powyżej 1000 000 PLN</option>
                      </select>
                    </label>
                  </div>
                </th>
              </tr>
              <tr className="table__head__column-names">
                <th>ID</th>
                <th>Rodzaj</th>
                <th>Koszt miesięczny</th>
                <th>Wartość ubezpieczenia</th>
                <th>Kto</th>
                <th>Miasto</th>
                <th>Data</th>
                <th />
              </tr>
            </thead>

            <tbody className="table__body">
              {
                entries.map(entry => (
                  <tr key={entry.id} onClick={() => this.toEntryDetails(entry.id)}>
                    <td>{entry.id}</td>
                    <td>
                      {
                        entry.mieszkanie ?
                          <span><i className="far fa-building" /> Mieszkanie</span> :
                          <span><i className="far fa-home" /> Dom</span>
                      }
                    </td>
                    <td>{entry.kosztMiesieczny}</td>
                    <td>{entry.wartoscUbezpieczenia}</td>
                    <td>{entry.name}</td>
                    <td>{entry.miasto}</td>
                    <td>{(new Date(Date.now())).toLocaleDateString('pl-PL')}</td>
                    <td><a>Szczegóły <i className="fal fa-angle-right" /></a></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {isShowMap && <GoogleMap zoom={13} />}
      </div>
    )
  }
}
