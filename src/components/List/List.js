// Libs
import React from 'react'
import toPairs from 'lodash/toPairs'
import isNil from 'lodash/isNil'

// Module
import './List.css'

const List = ({ data }) =>
  <ul>
    {
      toPairs(data)
        .map((pair, index) =>
          isNil(pair[1]) ?
            null :
            <li key={index}><strong>{pair[0]}:</strong> {pair[1]}</li>
        )
    }
  </ul>

export default List
