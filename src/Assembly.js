import React from "react"
import styled from "styled-components"
import { observer, Observer } from "mobx-react"
import { DateTime } from "luxon"
import { observable, reaction, computed } from "mobx"
import Aviator from "aviator"

import Header from "./components/Header"
import Loading from "./components/Loading"
import Lobby from "./components/Lobby"
import Order from "./components/Order"
import BigScreen from "./components/BigScreen"
import OrderData from "./data/Order"

import Network from "./Network"

@observer
class Assembly extends React.Component {
  constructor(props) {
    super(props)
    this.network = new Network(process.env.REACT_APP_URL_API)

    Aviator.setRoutes({ "/bigscreen": () => this.current_page = BigScreen })
    Aviator.dispatch()
  }

  @observable current_page = Lobby

  @observable visible_tab = null
  @observable visible_service_type = null
  @observable visible_position = null

  @observable scroll = 0
  @observable loaded = false
  @observable services = []
  @observable extras = []
  @observable room_pricing_factor = 1.0
  @observable active_orders = []
  @observable order_archive = []
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
      room_pricing_factor: RoomPricingEvent.order(:created_at).last.try(:pricing_factor) || 100,
      active_orders: Order.open,
      order_archive: Order.all,
    }
    `((response) =>
      response
      .json()
      .then((result) => {
        this.loaded = DateTime.local().toISO()
        this.services = result.services
        this.extras = result.extras
        this.room_pricing_factor = result.room_pricing_factor
        this.active_orders = result.active_orders.map(o => new OrderData(o))
        this.order_archive = result.order_archive.map(o => new OrderData(o))
      })
      .then(() => {
        if(this.scroll !== 0)
          document.querySelector(".orderLayout").scroll(0, this.scroll)
        this.scroll = 0;
      })
    )
  }

  render () {
    if(this.current_page === BigScreen)
      return <BigScreen assembly={this} />

    return (
      <Layout>
        <Header/>

        <Layout.Left>
          { this.loaded
          ? <Lobby assembly={this} />
          : <Loading/>
          }
        </Layout.Left>

        <Layout.Right>
          <Observer>{() =>
            this.loaded && this.visible_order
            ? <Order
                assembly={this}
                key={this.visible_service_type + this.visible_position + this.loaded}
              />
            : null
          }</Observer>
        </Layout.Right>
      </Layout>
    );
  }

  @computed get visible_order() {
    return (
      this.visible_service
      ? this.active_orders.filter(o => o.service_id === this.visible_service.id)[0]
      : null
    )
  }

  @computed get visible_service() {
    return this.services.filter(s =>
      s.service === this.visible_service_type &&
      s.position === this.visible_position
    )[0]
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
  persistVisibleOrder = (state) => {
    if(state.start_time) state.start_time = state.start_time.toISO()
    if(state.end_time) state.end_time = state.end_time.toISO()

    return this.network.run`
      order = Order.find(${this.visible_order.id})
      result = order.update!(JSON.parse('${JSON.stringify(state)}'))

      { persisted: result, closed: !order.open? }
    `.then((result) => {
      if(result.closed) this.props.assembly.set_visible_order(null, null)
    })
  }

  persistExtra(state, extra_name) {
    this.network.run`
      order = Order.find(${this.visible_order.id})
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
    this.visible_service_type = service
    this.visible_position = position
    this.visible_tab = "snacks"

    this.network.run`
      service = Service.find_by(
        service_type: ${JSON.stringify(service)},
        position: ${JSON.stringify(position)},
      )

      service.orders.open.first || service.orders.create!(start_time: Time.current)
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

  set_visible_order(service, position) {
    this.visible_service_type = service
    this.visible_position = position
  }

  cancelVisibleOrder = () => {
    this.network.run`
      Order.find(${this.visible_order.id}).destroy!
    `

    this.set_visible_order(null, null)
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
