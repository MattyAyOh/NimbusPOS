import React from "react"
import { observer } from "mobx-react"
import { DateTime } from "luxon"
import { computed, observable, reaction } from "mobx"
import { types } from "mobx-state-tree"
import Aviator from "aviator"

import Lobby from "./components/Lobby"
import BigScreen from "./components/BigScreen"
import Admin from "./components/Admin"

import Extra from "./data/Extra"
import Order from "./data/Order"
import Reservation from "./data/Reservation"
import Service from "./data/Service"
import NewReservation from "./data/NewReservation"
import CalendarDate from "./data/CalendarDate"

// Queries
import ApolloClient from "apollo-client";
import gql from "graphql-tag"
import { InMemoryCache } from "apollo-cache-inmemory"
import { WebSocketLink } from "apollo-link-ws"
import { createHttpLink } from "apollo-link-http"
import { getMainDefinition } from "apollo-utilities"
import { setContext } from "apollo-link-context"
import { split } from "apollo-link"
import _ from "lodash"

// Direction:
//
// The "Assembly" is a collection of all of the software pieces
// that work together to operate on a single data set.
// In this case, the "Assembly" contains routing logic,
// while details of each page are broken out into other components.
// As a result, we should strive to remove all code from this `render` function.

const DataModel = types.model({
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
      "/admin": () => this.current_page = Admin,
      "/bigscreen": () => this.current_page = BigScreen,
    })

    Aviator.dispatch()
  }

  data = DataModel.create({
    new_reservation: {},
    reservation_date: { iso: DateTime.local().startOf("day").toISO() },
  })

  @observable current_page = Lobby

  componentDidMount() {
    reaction(
      () => this.data.room_pricing_factor,
      value => this.client.mutate({ mutation: gql`
        mutation (
          $created_at: timestamp!,
          $updated_at: timestamp!,
          $pricing_factor: float8!,
        ) {
          insert_room_pricing_events(objects: {
            pricing_factor: $pricing_factor,
            created_at: $created_at,
            updated_at: $created_at,
          }) { affected_rows }
        }
        `,
        variables: {
          pricing_factor: value || 1.0,
          created_at: DateTime.local().toUTC().toSQL(),
          updated_at: DateTime.local().toUTC().toSQL(),
        },
      })
    )

    reaction(
      () => this.data.room_discount_day,
      value => this.client.mutate({ mutation: gql`
        mutation (
          $created_at: timestamp!,
          $updated_at: timestamp!,
          $day_of_week: Int!,
        ) {
          insert_room_discount_day_events(objects: {
            day_of_week: $day_of_week,
            created_at: $created_at,
            updated_at: $created_at,
          }) { affected_rows }
        }
        `,
        variables: {
          day_of_week: value || 0,
          created_at: DateTime.local().toUTC().toSQL(),
          updated_at: DateTime.local().toUTC().toSQL(),
        },
      })
    )

    // TODO clean up the subscription when we're done with it.
    this.client.subscribe({ query: gql`
      subscription { extras(order_by: {id: asc}, where: {active: {_eq: true}}) {
        id
        name
        image_url
        extra_type
        price
      } }
    ` }).subscribe({
      next: result => this.data.set_extras(result.data.extras),
      error: (err) => console.error('err', err),
    })

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
      next: result => this.data.set_active_orders(result.data.orders.map(o => Order.create(o))),
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
      next: result => this.data.set_services(result.data.services),
      error: (err) => console.error('err', err),
    });

    // TODO clean up the subscription when we're done with it.
    this.client.subscribe({ query: gql`
      subscription {
        room_discount_day_events(order_by: {created_at: desc}, limit: 1) {
          day_of_week
      } }
    ` }).subscribe({
      next: result => this.data.set_room_discount_day((
        result.data.room_discount_day_events[0] ||
        { day_of_week: 0 }
      ).day_of_week),

      error: (err) => console.error('err', err),
    });

    // TODO clean up the subscription when we're done with it.
    this.client.subscribe({ query: gql`
      subscription {
        room_pricing_events(order_by: {created_at: desc}, limit: 1) {
          pricing_factor
      } }
    ` }).subscribe({
      next: result => this.data.set_room_pricing_factor(result.data.room_pricing_events[0].pricing_factor || 1),
      error: (err) => console.error('err', err),
    });

    // TODO clean up the subscription when we're done with it.
    this.client.subscribe({ query: gql`
      subscription {
        reservations {
          id
          start_time
          end_time
          service {
            name
            position
          }
      } }
    ` }).subscribe({
      next: result => this.data.set_reservations(result.data.reservations),
      error: (err) => console.error('err', err),
    });

    // TODO find a new hook for this. Maybe a reaction to `loaded`?
    // .then(() => {
    //   if(this.data.scroll !== 0)
    //     document.querySelector(".orderLayout").scroll(0, this.data.scroll)
    //   this.data.set_scroll(0);
    // })
  }

  @computed get visible_tab() { return this.data.visible_tab }
  @computed get visible_service_type() { return this.data.visible_service_type }
  @computed get visible_position() { return this.data.visible_position }
  @computed get scroll() { return this.data.scroll }
  @computed get reservations() { return this.data.reservations }
  @computed get services() { return this.data.services }
  @computed get extras() { return this.data.extras }
  @computed get room_pricing_factor() { return this.data.room_pricing_factor }
  @computed get room_discount_day() { return this.data.room_discount_day }
  @computed get active_orders() { return this.data.active_orders }
  @computed get new_reservation() { return this.data.new_reservation || {} }
  @computed get reservation_date() { return this.data.reservation_date }

  @computed get loaded() {
    return (
      this.services &&
      this.extras &&
      this.active_orders &&
      this.room_pricing_factor
    ) ? DateTime.local().toISO()
      : false
  }

  render () {
    if(this.current_page === BigScreen)
      return <BigScreen assembly={this} />

    if(this.current_page === Admin)
      return <Admin assembly={this} />

    return <Lobby assembly={this} />
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

    this.client.mutate({ mutation: gql`
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
      this.client.mutate({ mutation: gql`
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
      this.client.mutate({ mutation: gql`
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
      this.client.mutate({ mutation: gql`
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
      this.client.mutate({ mutation: gql`
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
    let dateAttrs = _.pick(
      this.reservation_date.luxon.toObject(),
      "year",
      "month",
      "day",
    )

    this.new_reservation.start_set(dateAttrs)
    this.new_reservation.end_set(dateAttrs)

    if(this.new_reservation.start.hour < 4)
      this.new_reservation.set_start(this.new_reservation.start.plus({ days: 1 }))
    if(this.new_reservation.end.hour < 4)
      this.new_reservation.set_end(this.new_reservation.end.plus({ days: 1 }))

    this.client.mutate({ mutation: gql`
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
        start_time: this.new_reservation.start.toUTC().toSQL(),
        end_time: this.new_reservation.end.toUTC().toSQL(),
        created_at: DateTime.local().toUTC().toSQL(),
        updated_at: DateTime.local().toUTC().toSQL(),
      },
    })
  }

  remove_reservation(id) {
    this.client.mutate({ mutation: gql`
      mutation ($id: bigint!) {
        delete_reservations(where: { id: { _eq: $id }} ) {
          affected_rows
      } }
      `,
      variables: { id },
    })
  }

  set_visible_order(service, position) {
    this.data.set_visible_service_type(service)
    this.data.set_visible_position(position)
    this.data.set_visible_tab("snacks")
  }

  cancelVisibleOrder = () => {
    this.client.mutate({ mutation: gql`
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
