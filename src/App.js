import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"
import { observable } from "mobx"

import Header from "./components/Header"
import Loading from "./components/Loading"
import Lobby from "./components/Lobby"
import Order from "./components/Order"
import Reservations from "./components/Reservations"

import Assemble from "./Assemble"
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
  assemble = new Assemble("https://localhost:3000")

  @observable loaded = false
  @observable reservations = reservations
  @observable services = []
  @observable extras = []

  componentDidMount() {
    this.assemble.watch("nimbus")`
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
                onEnsureCurrentOrder={(service, number) => this.ensureCurrentOrder(service, number)}
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
              onCancel={this.cancelOrder}
              onPersist={(state) => this.persistOrder(state, this.props.store.currentView.order)}
              onPersistExtra={(state, extra_name) => this.persistExtra(state, extra_name, this.props.store.currentView.order)}
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

  // takes a `state` object, with:
  // `start_time`: `null` | `moment` object
  // `end_time`: `null` | `moment` object
  persistOrder = (state, order) => {
    if(state.start_time) state.start_time = state.start_time.format()
    if(state.end_time) state.end_time = state.end_time.format()

    return this.assemble.run("nimbus")`
      service = Service.find_by(
        service_type: ${JSON.stringify(order.service.service)},
        position: ${JSON.stringify(order.service.position)},
      )

      order = service.current_order || Order.create!(service: service)
      result = order.update!(JSON.parse('${JSON.stringify(state)}'))

      { persisted: result, closed: !order.open? }
    `.then((result) => {
      if(result.closed) this.props.store.showLobby()
    })
  }

  persistExtra(state, extra_name, order) {
    this.assemble.run("nimbus")`
      service = Service.find_by(
        service_type: ${JSON.stringify(order.service.service)},
        position: ${JSON.stringify(order.service.position)},
      )

      order = service.current_order || Order.create!(service: service)
      extra = Extra.find_by(name: ${JSON.stringify(extra_name)})

      order_extra =
        OrderExtra.find_by(order: order, extra: extra) ||
        OrderExtra.create!(order: order, extra: extra)

      if(${JSON.stringify(state.quantity)}.to_i > 0)
        result = order_extra.update!(
          quantity: ${JSON.stringify(state.quantity)},
        )
      else
        order_extra.destroy!
      end
    `
  }

  ensureCurrentOrder(service, position) {
    return this.assemble.run("nimbus")`
      service = Service.find_by(
        service_type: ${JSON.stringify(service)},
        position: ${JSON.stringify(position)},
      )

      service.current_order || service.orders.create!(start_time: Time.current)
    `
  }

  cancelOrder = (service) => {
    this.assemble.run("nimbus")`
      Service.find_by(
        service_type: ${JSON.stringify(service.service)},
        position: ${JSON.stringify(service.position)}
      ).current_order.destroy!
    `.then(() => this.props.store.showLobby())
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
