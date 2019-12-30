import React from "react"
import { observer } from "mobx-react"
import { DateTime } from "luxon"
import { computed, observable, reaction } from "mobx"
import { types } from "mobx-state-tree"

import Extra from "./data/Extra"
import Order from "./data/Order"
import Reservation from "./data/Reservation"
import Service from "./data/Service"
import NewReservation from "./data/NewReservation"
import CalendarDate from "./data/CalendarDate"

import subscriptions from "./subscribe"
import { change_room_discount_day, change_room_pricing } from "./change"

// Queries
import ApolloClient from "apollo-client";
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
// that work together to operate on a single model.
// In this case, the "Assembly" contains routing logic,
// while details of each page are broken out into other components.
// As a result, we should strive to remove all code from this `render` function.

const Model = types.model({
  visible_tab: types.maybeNull(types.string),
  visible_service_type: types.maybeNull(types.string),
  visible_position: types.maybeNull(types.integer),

  scroll: 0,
  reservations: types.array(Reservation),
  services: types.array(Service),
  extras: types.array(Extra),
  room_pricing_factor: 1.0,
  room_discount_day: 0,
  active_orders: types.array(Order),
  new_reservation: NewReservation,
  reservation_date: CalendarDate,
}).actions(self => ({
  set_visible_tab(visible_tab) { self.visible_tab = visible_tab },
  set_visible_service_type(visible_service_type) { self.visible_service_type = visible_service_type },
  set_visible_position(visible_position) { self.visible_position = visible_position },
  set_scroll(scroll) { self.scroll = scroll },
  set_reservations(reservations) { self.reservations = reservations },
  set_services(services) { self.services = services },
  set_extras(extras) { self.extras = extras },
  set_room_pricing_factor(factor) { self.room_pricing_factor = factor },
  set_room_discount_day(day) { self.room_discount_day = day },
  set_active_orders(orders) { self.active_orders = orders },
}))

@observer
class Assembly extends React.Component {
  constructor(props) {
    super(props)

    const wsLink = new WebSocketLink({
      uri: `ws://${process.env.REACT_APP_URL_HASURA}`,
      options: {
        reconnect: true,
        connectionParams: {
          headers: {
            // TODO is this needed if used alongside authLink?
            "x-hasura-access-key": process.env.REACT_APP_HASURA_PASSWORD,
          }
        }
      },

    })
    const httpLink = createHttpLink({ uri: `http://${process.env.REACT_APP_URL_HASURA}` })
    const authLink = setContext((_, { headers }) => (
      { headers: {
        ...headers,
          "x-hasura-access-key": process.env.REACT_APP_HASURA_PASSWORD,
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
    this.graph = new ApolloClient({
      link: authLink.concat(link),
      cache: new InMemoryCache(),
    })
  }

  model = Model.create({
    new_reservation: {},
    reservation_date: { iso: DateTime.local().startOf("day").toISO() },
  })

  componentDidMount() {
    reaction(
      () => this.model.room_pricing_factor,
      value => change_room_pricing(this.graph, { pricing_factor: value || 1.0 }),
    )

    reaction(
      () => this.model.room_discount_day,
      value => change_room_discount_day(this.graph, { day_of_week: value || 0 })
    )

    Object.keys(subscriptions).forEach(subscribe => {
      let follow = subscriptions[subscribe]

      this.graph.subscribe({ query: gql(subscribe) }).subscribe({
        next: follow(this.model),
        error: err => console.error("err", err),
      })
    })

    // TODO find a new hook for this. Maybe a reaction to `loaded`?
    // .then(() => {
    //   if(this.model.scroll !== 0)
    //     document.querySelector(".orderLayout").scroll(0, this.model.scroll)
    //   this.model.set_scroll(0);
    // })
  }

  @computed get visible_tab() { return this.model.visible_tab }
  @computed get visible_service_type() { return this.model.visible_service_type }
  @computed get visible_position() { return this.model.visible_position }
  @computed get scroll() { return this.model.scroll }
  @computed get reservations() { return this.model.reservations }
  @computed get services() { return this.model.services }
  @computed get extras() { return this.model.extras }
  @computed get room_pricing_factor() { return this.model.room_pricing_factor }
  @computed get room_discount_day() { return this.model.room_discount_day }
  @computed get active_orders() { return this.model.active_orders }
  @computed get new_reservation() { return this.model.new_reservation || {} }
  @computed get reservation_date() { return this.model.reservation_date }

  @computed get loaded() {
    return (
      this.services &&
      this.extras &&
      this.active_orders &&
      this.room_pricing_factor
    ) ? DateTime.local().toISO()
      : false
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
    if(state.start_time) state.start_time = state.start_time.toUTC().toSQL()
    if(state.end_time) state.end_time = state.end_time.toUTC().toSQL()

    this.graph.mutate({ mutation: gql`
      mutation (
        $order_id: bigint!,
        $state: orders_set_input,
      ) {
        update_orders(
          where: { id: { _eq: $order_id }, },
          _set: $state,
        ) {
          returning { closed_at }
        }
      }
      `,
      variables: {
        order_id: this.visible_order.id,
        state: state,
      },
    })
  }

  persistExtra(quantity, extra_name) {
    let extra = this.extras.filter(e => e.name === extra_name)[0]
    let order_extra = this.visible_order.order_extras.filter(e => e.extra_id === extra.id)[0]

    // Make sure the order_extra exists
    if(!order_extra)
      this.graph.mutate({ mutation: gql`
        mutation (
          $order_id: bigint!,
          $extra_id: bigint!,
        ) {
          insert_order_extras(objects: {
            order_id: $order_id,
            extra_id: $extra_id,
          }) { affected_rows }
        }
        `,
        variables: {
          order_id: this.visible_order.id,
          extra_id: extra.id,
        },
      })

    // set the quantity
    if(quantity > 0) {
      this.graph.mutate({ mutation: gql`
        mutation (
          $order_id: bigint!,
          $extra_id: bigint!,
          $quantity: Int!,
        ) {
          update_order_extras(
            where: {
            order_id: { _eq: $order_id },
            extra_id: { _eq: $extra_id },
          },
          _set: { quantity: $quantity }
          ) { affected_rows }
        }
        `,
        variables: {
          order_id: this.visible_order.id,
          extra_id: extra.id,
          quantity: quantity,
        },
      })
    } else {
      // quantity is 0; remove the record.
      this.graph.mutate({ mutation: gql`
        mutation (
          $order_id: bigint!,
          $extra_id: bigint!,
        ) {
          delete_order_extras(
            where: {
            order_id: { _eq: $order_id },
            extra_id: { _eq: $extra_id },
          },
          ) { affected_rows }
        }
        `,
        variables: {
          order_id: this.visible_order.id,
          extra_id: extra.id,
        },
      })
    }
  }

  ensureCurrentOrder(service_name, position) {
    this.set_visible_order(service_name.toLowerCase(), position)

    if(!this.visible_order) {
      this.graph.mutate({ mutation: gql`
        mutation (
          $service_id: bigint!,
          $start_time: timestamp,
          $end_time: timestamp,
        ) {
          insert_orders(objects: {
            end_time: $end_time,
            start_time: $start_time,
            service_id: $service_id,
          }) { affected_rows }
        }
        `,
        variables: {
          service_id: this.visible_service.id,
          start_time: DateTime.local().toUTC().toSQL(),
        },
      })
    }
  }

  create_reservation() {
    this.graph.mutate({ mutation: gql`
      mutation (
        $created_at: timestamp!,
        $updated_at: timestamp!,
        $service_id: bigint!,
        $start_time: timestamp!,
        $end_time: timestamp!,
      ) {
        insert_reservations(objects: {
          end_time: $end_time,
          start_time: $start_time,
          created_at: $created_at,
          updated_at: $created_at,
          service_id: $service_id,
        }) { affected_rows }
      }
      `,
      variables: {
        service_id: this.services.filter(s =>
          s.name === this.new_reservation.service &&
          s.position === this.new_reservation.position
        )[0].id,
        start_time: this.new_reservation.start_time.toUTC().toSQL(),
        end_time: this.new_reservation.end_time.toUTC().toSQL(),
        created_at: DateTime.local().toUTC().toSQL(),
        updated_at: DateTime.local().toUTC().toSQL(),
      },
    })
  }

  remove_reservation(id) {
    this.graph.mutate({ mutation: gql`
      mutation ($id: bigint!) {
        delete_reservations(where: { id: { _eq: $id }} ) {
          affected_rows
      } }
      `,
      variables: { id },
    })
  }

  set_visible_order(service, position) {
    this.model.set_visible_service_type(service)
    this.model.set_visible_position(position)
    this.model.set_visible_tab("snacks")
  }

  cancelVisibleOrder = () => {
    this.graph.mutate({ mutation: gql`
      mutation ($id: bigint!) {
        delete_order_extras(where: { order_id: { _eq: $id }} ){
          affected_rows
        }

        delete_orders(where: { id: { _eq: $id }} ) {
          affected_rows
      } }
      `,
      variables: { id: this.visible_order.id },
    })

    this.set_visible_order(null, null)
  }
}

export default Assembly
