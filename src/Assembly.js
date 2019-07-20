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
import Reservations from "./components/Reservations"
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
import _ from "lodash"

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
      "/admin": () => this.current_page = Admin,
      "/bigscreen": () => this.current_page = BigScreen,
    })

    Aviator.dispatch()
  }

  @observable current_page = Lobby

  @observable visible_tab = null
  @observable visible_service_type = null
  @observable visible_position = null

  @observable scroll = 0
  @observable reservations = []
  @observable services = []
  @observable extras = []
  @observable room_pricing_factor = 1.0
  @observable room_discount_day = 0
  @observable active_orders = []
  @observable new_reservation = {}
  @observable reservation_date = DateTime.local().startOf("day")

  componentDidMount() {
    reaction(
      () => this.room_pricing_factor,
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
      () => this.room_discount_day,
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
      next: result => this.extras = result.data.extras,
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
        room_discount_day_events(order_by: {created_at: desc}, limit: 1) {
          day_of_week
      } }
    ` }).subscribe({
      next: result => this.room_discount_day = (
        result.data.room_discount_day_events[0] ||
        { day_of_week: 0 }
      ).day_of_week,

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
      next: result => this.reservations = result.data.reservations,
      error: (err) => console.error('err', err),
    });

    // TODO find a new hook for this. Maybe a reaction to `loaded`?
    // .then(() => {
    //   if(this.scroll !== 0)
    //     document.querySelector(".orderLayout").scroll(0, this.scroll)
    //   this.scroll = 0;
    // })
  }

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
            this.visible_order
            ? <Order
                assembly={this}
                key={this.visible_service_type + this.visible_position + this.loaded}
              />
            : <Reservations assembly={this} />
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

  persistExtra(quantity, extra_name) {
    let extra = this.extras.filter(e => e.name === extra_name)[0]
    let order_extra = this.visible_order.extras.filter(e => e.extra_id === extra.id)[0]

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
    this.visible_service_type = service_name.toLowerCase()
    this.visible_position = position
    this.visible_tab = "snacks"

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

  createReservation() {
    let dateAttrs = _.pick(this.reservation_date.toObject(), "year", "month", "day")
    this.new_reservation.start_time = this.new_reservation.start_time.set(dateAttrs)
    this.new_reservation.end_time = this.new_reservation.end_time.set(dateAttrs)

    if(this.new_reservation.start_time.hour < 12)
      this.new_reservation.start_time = this.new_reservation.start_time.plus({ days: 1 })
    if(this.new_reservation.end_time.hour < 12)
      this.new_reservation.end_time = this.new_reservation.end_time.plus({ days: 1 })

    this.client.mutate({ mutation: gql`
      mutation (
        $created_at: timestamp!,
        $updated_at: timestamp!,
        $service_name: String!,
        $service_position: Int!,
        $start_time: timestamp!,
        $end_time: timestamp!,
      ) {
        insert_reservations(objects: {
          end_time: $end_time,
          start_time: $start_time,
          created_at: $created_at,
          updated_at: $created_at,
          service: {data: {
            name: $service_name,
            position: $service_position,
          } }
        }) { affected_rows }
      }
      `,
      variables: {
        service_name: this.new_reservation.service,
        service_position: this.new_reservation.position,
        start_time: this.new_reservation.start_time.toUTC().toSQL(),
        end_time: this.new_reservation.end_time.toUTC().toSQL(),
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
    this.visible_service_type = service
    this.visible_position = position
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
