import React from "react"
import styled from "styled-components"
import { observer, Observer } from "mobx-react"
import { DateTime } from "luxon"
import { computed, observable, reaction, runInAction } from "mobx"
import Aviator from "aviator"

import Header from "./components/Header"
import Loading from "./components/Loading"
import Lobby from "./components/Lobby"
import Order from "./components/Order"
import BigScreen from "./components/BigScreen"
import Admin from "./components/Admin"

import OrderData from "./data/Order"

// Queries
import ApolloClient from "apollo-client";
import Network from "./Network"
import gql from "graphql-tag"
import { InMemoryCache } from "apollo-cache-inmemory"
import { WebSocketLink } from "apollo-link-ws"
import { createHttpLink } from "apollo-link-http"
import { getMainDefinition } from "apollo-utilities"
import { setContext } from "apollo-link-context"
import { split } from "apollo-link"

// Direction:
//
// The "Assembly" is a collection of all of the software pieces
// that work together to operate on a single data set.
// In this case, the "Assembly" contains routing logic,
// while details of each page are broken out into other components.
// As a result, we should strive to remove all code from this `render` function.

@observer
class Assembly extends React.Component {
  constructor(props) {
    super(props)
    this.network = new Network(process.env.REACT_APP_URL_API)

    const wsLink = new WebSocketLink({
      uri: `ws://${process.env.REACT_APP_URL_HASURA}`,
      options: {
        reconnect: true,
        connectionParams: {
          headers: {
            "x-hasura-access-key": process.env.REACT_APP_HASURA_SECRET,
          }
        }
      },

    })
    const httpLink = createHttpLink({ uri: `http://${process.env.REACT_APP_URL_HASURA}` })
    const authLink = setContext((_, { headers }) => (
      { headers: {
        ...headers,
          "x-hasura-access-key": process.env.REACT_APP_HASURA_SECRET,
      } }
    ))
    const link = split(({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httpLink,
    )
    this.client = new ApolloClient({
      link: authLink.concat(link),
      cache: new InMemoryCache(),
    })

    Aviator.setRoutes({
      // "/admin": () => this.current_page = Admin,
      "/bigscreen": () => this.current_page = BigScreen,
    })

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

    this.client.query({ query: gql`
      { extras(where: {active: {_eq: true}}) {
        id
        name
        image_url
        extra_type
        price
      } }
    ` }).then(result => runInAction(() => this.extras = result.data.extras))

    // TODO clean up the subscription when we're done with it.
    this.client.subscribe({ query: gql`
      subscription { orders(where: {closed_at: {_is_null: true}}) {
          id
          service_id
          closed_at
          start_time
          end_time
          order_extras {
            id
            extra_id
            quantity
            extra {
              name
              price
      } } } }
    ` }).subscribe({
      next: result => this.active_orders = result.data.orders.map(o => new OrderData(o)),
      error: (err) => console.error('err', err),
    });

    // TODO clean up the subscription when we're done with it.
    this.client.subscribe({ query: gql`
      subscription { services(order_by: {service_type: asc, position: asc}) {
        id
        hourly_rate
        name
        position
        service_type
      } }
    ` }).subscribe({
      next: result => this.services = result.data.services,
      error: (err) => console.error('err', err),
    });

    // TODO clean up the subscription when we're done with it.
    this.client.subscribe({ query: gql`
      subscription {
        room_pricing_events(order_by: {created_at: desc}, limit: 1) {
          pricing_factor
      } }
    ` }).subscribe({
      next: result => this.room_pricing_factor = result.data.room_pricing_events[0].pricing_factor || 1,
      error: (err) => console.error('err', err),
    });

    this.network.watch`{}`((response) =>
      response
      .json()
      .then((result) => {
        this.loaded = DateTime.local().toISO()
        // this.order_archive = result.order_archive.map(o => new OrderData(o))
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

    if(this.current_page === Admin)
      return <Admin assembly={this} />

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
      s.name.toLowerCase() === this.visible_service_type &&
      s.position === this.visible_position
    )[0]
  }

  @computed get snacks() {
    return this.extras.filter(s => s.extra_type === 0)
  }

  @computed get drinks() {
    return this.extras.filter(s => s.extra_type === 1)
  }

  @computed get others() {
    return this.extras.filter(s => s.extra_type === 2)
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

  ensureCurrentOrder(service_name, position) {
    this.visible_service_type = service_name.toLowerCase()
    this.visible_position = position
    this.visible_tab = "snacks"

    this.network.run`
      service = Service.find_by(
        service_type: ${JSON.stringify(service_name.toLowerCase())},
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
