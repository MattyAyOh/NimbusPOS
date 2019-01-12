import React from "react"
import styled from "styled-components"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { observer } from "mobx-react"
import { observable } from "mobx"

import Header from "./components/Header"
import Loading from "./components/Loading"
import Lobby from "./components/Lobby"
import Order from "./components/Order"
import Reservations from "./components/Reservations"
import BigScreen from "./components/BigScreen"

import Assemble from "./Assemble"
import Service from "./data/Service"
import Extra from "./data/Extra"
import Reservation from "./data/Reservation"

@observer
class App extends React.Component {
  assemble = new Assemble("https://localhost:3000")

  @observable loaded = false
  @observable reservations = []
  @observable services = []
  @observable extras = []
  @observable room_pricing_factor = 1.0

  componentDidMount() {
    this.assemble.watch("nimbus")`
    {
      services: Service.order(:service_type, :position),
      extras: Extra.where(active: true),
      reservations: Reservation.all.order(:start_time),
      room_pricing_factor: RoomPricingEvent.order(:created_at).last.try(:pricing_factor) || 100,
    }
    `((response) => {
      response.json().then(result => {
        this.loaded = true
        this.services = result.services.map(parseService)
        this.reservations = result.reservations.map(parseReservation)
        this.extras = result.extras.map(parseExtra)
        this.room_pricing_factor = result.room_pricing_factor
      })
      .then(() => {
        document.querySelector(".orderLayout").scroll(0, window.assemble.scroll)
        window.assemble.scroll = 0;
      })
    })
  }

  render () {
    return (
      <Router>
        <Switch>
          <Route
            path="/bigscreen"
            component={observer(() =>
              <BigScreen
                extras={this.extras}
                services={this.services}
                room_pricing_factor={this.room_pricing_factor}
              />
            )}
          />

          <Route path="/" component={observer(() => (
          <Layout>
            <Header/>

            <Layout.Left>
              { this.loaded
              ?  <Lobby
                    services={this.services}
                    onEnsureCurrentOrder={(service, number) => this.ensureCurrentOrder(service, number)}
                    room_pricing_factor={this.room_pricing_factor}
                    onRoomPricingFactorChange={value => this.assemble.run("nimbus")`
                      RoomPricingEvent.create!(pricing_factor: ${value || 1.0})
                    `}
                  />
              : <Loading/>
              }
            </Layout.Left>

            { this.loaded &&
              <Route
                path="/table/:service/:number"
                component={({match}) =>
                  <Layout.Right>
                    <Order
                      params={match.params}
                      match={match}
                      extras={this.extras}
                      order={(this.services.filter(s =>
                          s.service === match.params.service &&
                          s.position === parseInt(match.params.number, 10)
                        )[0] || {current_order: null}).current_order
                      }
                      onCancel={this.cancelOrder}
                      onPersist={(state) => this.persistOrder(state, match.params)}
                      onPersistExtra={(state, extra_name) => this.persistExtra(state, extra_name, match.params)}
                      room_pricing_factor={this.room_pricing_factor}
                    />
                  </Layout.Right>
                }
              />
            }

            <Route
              path="/reservations"
              component={({ match }) =>
                this.loaded
                ? <Layout.Right>
                    <Reservations
                      assemble={this.assemble}
                      reservations={this.reservations}
                      services={this.services}
                    />
                  </Layout.Right>
                : <Loading />
              } />
          </Layout>
          ))} />
        </Switch>
      </Router>
    );
  }

  // takes a `state` object, with:
  // `start_time`: `null` | `moment` object
  // `end_time`: `null` | `moment` object
  persistOrder = (state, params) => {
    if(state.start_time) state.start_time = state.start_time.format()
    if(state.end_time) state.end_time = state.end_time.format()

    return this.assemble.run("nimbus")`
      service = Service.find_by(
        service_type: ${JSON.stringify(params.service)},
        position: ${JSON.stringify(params.number)},
      )

      order = service.current_order || Order.create!(service: service)
      result = order.update!(JSON.parse('${JSON.stringify(state)}'))

      { persisted: result, closed: !order.open? }
    `
  }

  persistExtra(state, extra_name, params) {
    this.assemble.run("nimbus")`
      service = Service.find_by(
        service_type: ${JSON.stringify(params.service)},
        position: ${JSON.stringify(params.number)},
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
    `
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

const parseReservation = (json) => {
  return new Reservation(json)
}

export default App
