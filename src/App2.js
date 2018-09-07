import React from "react"
import styled from "styled-components"
import { BrowserRouter as Router, Route } from "react-router-dom"
import { observer } from "mobx-react"
import { observable } from "mobx"

import Header from "./components/Header"
import Timeline from "./components/Timeline"
import Assemble from "./Assemble"
import moment from "moment"

const reservables = [
  { id: 11, title: 'Mahjong 1' },
  { id: 12, title: 'Mahjong 2' },
  { id: 13, title: 'Mahjong 3' },
  { id: 14, title: 'Mahjong 4' },
  { id: 15, title: 'Mahjong 5' },
  { id: 16, title: 'Mahjong 6' },
  { id: 17, title: 'Mahjong 7' },
  { id: 18, title: 'Mahjong 8' },

  { id: 21, title: 'Pool 1' },
  { id: 22, title: 'Pool 2' },
  { id: 23, title: 'Pool 3' },
  { id: 24, title: 'Pool 4' },

  { id: 31, title: 'KTV 1' },
  { id: 32, title: 'KTV 2' },
  { id: 33, title: 'KTV 3' },
  { id: 34, title: 'KTV 4' },
]

const reservations = [
  { id: 31, group: 31, title: 'KTV 1', start_time: moment().subtract(30, 'minute'), end_time: moment().add(90, 'minute') },
  { id: 32, group: 32, title: 'KTV 2', start_time: moment(), end_time: moment().add(1, 'hour') },
  { id: 33, group: 33, title: 'KTV 3', start_time: moment(), end_time: moment().add(1, 'hour') },
  { id: 34, group: 34, title: 'KTV 4', start_time: moment(), end_time: moment().add(2, 'hour') },
]

@observer
class App2 extends React.Component {
  render = () => (
    <Router>
      <Layout>
        <Header/>

        <Timeline
          reservables={reservables}
          reservations={reservations}
          businessHoursOpen={18}
          businessHoursClose={4}
        />
      </Layout>
    </Router>
  )
}

const Layout = styled.div`
  display: grid;
  grid-row-gap: 2rem;
`

export default App2
