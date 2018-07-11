import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"
import { observable } from "mobx"

import Header from "./components/Header"
import Loading from "./components/Loading"
import Lobby from "./components/Lobby"
import Order from "./components/Order"
import Reservations from "./components/Reservations"

import Service from "./data/Service"
import Extra from "./data/Extra"

const reservations = [
  {
    start_time: "2017-05-20 10pm",
    end_time: "2017-05-20 12pm",
    service: "pool",
    room: 4,
  },
  {
    start_time: "2017-05-20 12pm",
    end_time: "2017-05-21 4am",
    service: "karaoke",
    room: 1,
  },
]

@observer
class App extends React.Component {
  @observable loaded = false
  @observable reservations = reservations
  @observable services = []
  @observable extras = []

  componentDidMount() {
    this.props.store.assemble.watch("nimbus")`
    {
      services: Service.order(:service_type, :position),
      extras: Extra.all,
    }
    `((result) => {
      this.loaded = true
      this.services = result.services.map(parseService)
      this.extras = result.extras.map(parseExtra)
    });
  }

  render () {
    return (
      <Layout>
        <Header/>

        <Layout.Left>
          { this.loaded
          ?  <Lobby
                store={this.props.store}
                services={this.services}
              />
          : <Loading/>
          }
        </Layout.Left>

        <Layout.Right>
          { this.loaded &&
            this.props.store.currentView &&
            this.props.store.currentView.name === "order" &&
            <Order
              store={this.props.store}
              extras={this.extras}
              order={this.props.store.currentView.order}
            />
          }

          { this.props.store.currentView &&
            this.props.store.currentView.name === "reservations" &&
            <Reservations reservations={this.reservations} />
          }
        </Layout.Right>
      </Layout>
    );
  }
}

const Layout = styled.div`
  display: grid;
  grid-row-gap: 2rem;
  grid-template-columns: 50% 50%;
  grid-template-rows: 4rem 1fr;
  height: 100vh;
`

Layout.Left = styled.div`
  grid-area: 2 / 1 / -1 / 1;
`

Layout.Right = styled.div`
  grid-area: 1 / 2 / -1 / 2;
`

const parseService = (json) => {
  return new Service(json)
}

const parseExtra = (json) => {
  return new Extra(json)
}

export default App
