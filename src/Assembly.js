import React from "react"
import styled from "styled-components"
import { observer, Observer } from "mobx-react"
import { observable, reaction, computed } from "mobx"
import Aviator from "aviator"

import Header from "./components/Header"
import Loading from "./components/Loading"
import Lobby from "./components/Lobby"
import Order from "./components/Order"
import Reservations from "./components/Reservations"
import BigScreen from "./components/BigScreen"

import Network from "./Network"
import Service from "./data/Service"

@observer
class Assembly extends React.Component {
  constructor(props) {
    super(props)

    this.network = new Network(process.env.REACT_APP_URL_API)

    Aviator.setRoutes({ "/bigscreen": () => this.current_page = BigScreen })
    Aviator.dispatch()

    if(props.afterCreation)
      props.afterCreation(this)
  }

  @observable current_page = Lobby

  @observable scroll = 0
  @observable loaded = false
  @observable reservations = []
  @observable services = []
  @observable extras = []
  @observable room_pricing_factor = 1.0
  @observable new_reservation = {}

  componentDidMount() {
    reaction(
      () => this.room_pricing_factor,
      value => this.network.run`RoomPricingEvent.create!(pricing_factor: ${value || 1.0})`
    )

    this.network.watch`
    {
      services: Service.order(:service_type, :position),
      extras: Extra.where(active: true),
      reservations: Reservation.all.order(:start_time),
      room_pricing_factor: RoomPricingEvent.order(:created_at).last.try(:pricing_factor) || 100,
    }
    `((response) =>
      response
      .json()
      .then((result) => {
      this.loaded = true
      this.services = result.services.map(json => new Service(json))
      this.reservations = result.reservations
      this.extras = result.extras
      this.room_pricing_factor = result.room_pricing_factor
      })
      .then(() => {
        if(this.scroll !== 0)
          document.querySelector(".orderLayout").scroll(0, this.scroll)
        this.scroll = 0;
      })
    )
  }

  @observable right_half = null

  render () {
    if(this.current_page === BigScreen)
      return <BigScreen assembly={this} />

    return (
      <Layout>
        <Header/>

        <Layout.Left>
          { this.loaded
          ?  <Lobby
                assembly={this}
                onEnsureCurrentOrder={(service, number) => this.ensureCurrentOrder(service, number)}
              />
          : <Loading/>
          }
        </Layout.Left>

        <Layout.Right>
          { this.loaded && this.right_half &&
            ( this.visible_order
              ?
                  <Observer>{() =>
                    <Order
                      url={this.right_half}
                      order={this.visible_order}
                      onCancel={this.cancelOrder}
                      onPersist={(state) => this.persistOrder(state, { service: "ktv", number: "1" })}
                      onPersistExtra={(state, extra_name) => this.persistExtra(state, extra_name)}
                      assembly={this}
                    />
                  }</Observer>
              :
                <Observer>{() =>
                  <Reservations assembly={this} />
                }</Observer>
            )
          }
        </Layout.Right>
      </Layout>
    );
  }

  @computed get visible_order() {
    return (
      this.services.filter(s =>
        s.service === this.right_half.split("/")[2] &&
        s.position === parseInt(this.right_half.split("/")[3], 10)
      )[0] || {current_order: null}
    ).current_order
  }

  @computed get snacks() {
    return this.extras.filter(s => s.extra_type === "snack")
  }

  @computed get drinks() {
    return this.extras.filter(s => s.extra_type === "drink")
  }

  @computed get others() {
    return this.extras.filter(s => s.extra_type === "other")
  }

  // takes a `state` object, with:
  // `start_time`: `null` | `DateTime` object
  // `end_time`: `null` | `DateTime` object
  persistOrder = (state, params) => {
    if(state.start_time) state.start_time = state.start_time.toISO()
    if(state.end_time) state.end_time = state.end_time.toISO()

    return this.network.run`
      service = Service.find_by(
        service_type: ${JSON.stringify(params.service)},
        position: ${JSON.stringify(params.number)},
      )

      order = service.current_order || Order.create!(service: service)
      result = order.update!(JSON.parse('${JSON.stringify(state)}'))

      { persisted: result, closed: !order.open? }
    `
  }

  persistExtra(state, extra_name) {
    let params = {
      service: this.right_half.split("/")[2],
      number: this.right_half.split("/")[3],
    }

    this.network.run`
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
    return this.network.run`
      service = Service.find_by(
        service_type: ${JSON.stringify(service)},
        position: ${JSON.stringify(position)},
      )

      service.current_order || service.orders.create!(start_time: Time.current)
    `
  }

  createReservation() {
    this.network.run`
      Reservation.create!(
        start_time: ${JSON.stringify(this.new_reservation.start_time.toISO())},
        end_time: ${JSON.stringify(this.new_reservation.end_time.toISO())},
        service: Service.find_by(
          name: ${JSON.stringify(this.new_reservation.service)},
          position: ${JSON.stringify(this.new_reservation.position)},
        )
      )
    `.then(() => this.new_reservation = {})
  }

  cancelOrder = (service) => {
    this.network.run`
      Service.find_by(
        service_type: ${JSON.stringify(service.service)},
        position: ${JSON.stringify(service.position)}
      ).current_order.destroy!
    `.then(() => this.right_half = null)
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

export default Assembly
