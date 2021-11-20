import React from "react"
import styled from "styled-components"
import { observer, Observer } from "mobx-react"
import { DateTime } from "luxon"
import { observable, computed } from "mobx"
import Selection from "../principals/Selection"
import gql from "graphql-tag"
import OrderData from "../data/Order"
import LineGraph from "../LineGraph"

var colors = [
  "#b58900",
  "#cb4b16",
  "#dc322f",
  "#d33682",
  "#6c71c4",
  "#268bd2",
  "#2aa198",
  "#859900",
  "#b58900",
  "#cb4b16",
  "#dc322f",
  "#d33682",
  "#6c71c4",
  "#268bd2",
  "#2aa198",
  "#859900",
]

class Admin extends React.Component {
  timeframe = observable.box("All time")
  orders = observable.array([])

  componentDidMount() {
    // TODO clean up the subscription when we're done with it.
    this.props.assembly.graph.subscribe({ query: gql`
      subscription { orders(where: {closed_at: {_is_null: false}}) {
          id
          service_id
          closed_at
          start_time
          end_time
          service { hourly_rate name }
          order_extras {
            id
            extra_id
            extra { price name }
          }
      } }
    ` }).subscribe({
      next: result => this.orders =
        result.data.orders.map(o => OrderData.create(o)),
      error: (err) => console.error('err', err),
    });

    window.orders = this.orders
  }


  render () {
    var primaryAxis = {
      getValue: datum => datum.date,
    }
    var secondaryAxes = [
      {
        getValue: datum => datum.price,
      }
    ]

    return (
      <Layout>
        <Layout.Left>
          Nimbus

          <Timeframe>
            <Selection
              update={() => this.timeframe.get()}
              options={Object.keys(this.timeframes)}
              onChange={(selection) => this.timeframe.set(selection)}
            />
          </Timeframe>

          <Timeframe>
            {this.selected_timeframe_start.toLocaleString()}
            &nbsp;to&nbsp;
            {this.selected_timeframe_end.toLocaleString()}
          </Timeframe>
Time spent by service:
          <Observer>{() =>
            <Table>
              <tbody>
              {["KTV", "Pool", "Mahjong"].map(name => {
                let service_ids = this.props.assembly.services
                  .filter(s => s.name === name)
                  .map(s => s.id)

                let matching_orders = this.orders_within_timeframe
                  .filter(order => service_ids.includes(order.service_id))

                let hours_spent = matching_orders
                  .map(order => order.end_time.diff(order.start_time, "hours").hours)
                  .reduce((a,b) => a + b, 0)

                return (
                  <tr key={name}>
                    <td>{name}:</td>
                    <NumberCell>
                      {hours_spent.toFixed(2)} hours
                    </NumberCell>
                  </tr>
                )
              })}
              </tbody>
            </Table>
          }</Observer>

          Revenue by Item:
          <Observer>{() =>
            <Table>
              <tbody>
                <TotalRow key="Total">
                  <td>Total</td>
                  <CurrencyCell>
                    { this.selected_extras
                        .map(extra => this.amount_spent_on(extra, this.orders_within_timeframe))
                        .reduce((a,b) => a + b, 0)
                    }
                  </CurrencyCell>
                </TotalRow>

              {this.selected_extras
                .filter(extra => this.amount_spent_on(extra, this.orders_within_timeframe) > 0)
                .sort((a, b) => this.amount_spent_on(b, this.orders_within_timeframe) - this.amount_spent_on(a, this.orders_within_timeframe))
                .map(extra =>
                  <tr key={extra.id}>
                    <td>{extra.name}:</td>
                    <CurrencyCell>
                      {this.amount_spent_on(extra, this.orders_within_timeframe)}
                    </CurrencyCell>
                  </tr>
              )}
              </tbody>
            </Table>
          }</Observer>
        </Layout.Left>

        <Layout.Right>
          <p>Room Pricing:</p>
          <Selection
            update={() => this.props.assembly.room_pricing_factor}
            options={[0.5, 0.6, 0.75, 0.8, 0.9, 1]}
            render ={option => option * 100 + "%"}
            onChange={(selection) => this.props.assembly.model.set_room_pricing_factor(selection)}
          />

          <p>Applied on:</p>
          <Selection
            update={() => this.props.assembly.room_discount_day}
            options={[1, 2, 3, 4, 5, 6, 7, 0]}
            render ={option => option ? DateTime.fromObject({weekday: option}).toLocaleString({ weekday: "short" }) : "Any Day"}
            onChange={(selection) => this.props.assembly.model.set_room_discount_day(selection)}
          />

          <p>Progress Map</p>
          <LineGraph
            data={data}
            horizontalGuides={5}
            precision={0}
            verticalGuides={6}
            />
          </Layout.Right>
        </Layout>
      );
      }

  get orders_within_timeframe() {
    return this.orders.filter(order =>
      DateTime.fromISO(order.closed_at) >= this.selected_timeframe_start &&
      DateTime.fromISO(order.closed_at) < this.selected_timeframe_end
    )
  }

  get selected_extras() {
    return this.props.assembly.extras
  }

  amount_spent_on(extra, orders) {
    return this.orders_within_timeframe
      .map(order => order.order_extras.filter(e => e.extra.name === extra.name).map(e => e.quantity))
      .flat()
      .reduce((a,b) => a + b, 0) * extra.price
  }

  get selected_timeframe_start() {
    return this.timeframes[this.timeframe][0]
  }

  get selected_timeframe_end() {
    return this.timeframes[this.timeframe][1]
  }

  get timeframes() {
    return {
      "Week to date":   [DateTime.fromObject({ weekDay: 1 }), DateTime.local()],
      "Month to date":  [DateTime.fromObject({ day: 1 }), DateTime.local()],
      "Rolling Week":   [DateTime.local().minus({ week: 1 }), DateTime.local()],
      "Rolling 30-day": [DateTime.local().minus({ day: 30 }), DateTime.local()],
      "All time": [
        this.orders.map(order => DateTime.fromISO(order.closed_at)).sort()[0] || DateTime.local(),
        DateTime.local(),
      ],
    }
  }
}

var parse_simple_series = (series) => {
  var days_in_series = series
  .map(order => ({
    day: new Date(order.end_time).setHours(0,0,0,0),
    price: (
      (new Date(order.end_time) - new Date(order.start_time))
      * order.service.hourly_rate
    ) + (
      order
      .order_extras
      .map(extra => extra.extra.price)
      .reduce((a,b) =>  a + b, 0)
    )
  }))
  console.log(days_in_series)

  const groupByDay = arr => {
    const map = {};
    arr.forEach(record => {
      if (!map[record.day]) {
        map[record.day] = 0
      };
      map[record.day] += record.price
    });
    return map;
  }

  console.log(groupByDay(days_in_series))

  return (
    Object.keys(
      days_in_series
      .reduce((a, b) => {
        debugger
        return {}
      }, {})
    ).map((day, i) => ({
    }))
  )
}
window.parse_simple_series = parse_simple_series

const data = [
  { label: "S", x: 0, y: 0 },
  { label: "M", x: 1, y: 400 },
  { label: "T", x: 2, y: 300 },
  { label: "W", x: 3, y: 100 },
  { label: "TH", x: 4, y: 400 },
  { label: "F", x: 5, y: 500 },
  { label: "S", x: 6, y: 400 }
];

const Layout = styled.div`
  display: grid;
  grid-row-gap: 2rem;
  grid-template-columns: 20% 80%;
  grid-template-rows: 4rem 1fr;
  height: 100vh;
`

Layout.Left = styled.div`
  grid-area: 1 / 1 / -1 / 1;
`

Layout.Right = styled.div`
  grid-area: 1 / 2 / -1 / 2;
`

const NumberCell = styled.td`
  text-align: right;
  padding-left: 1rem;
  `

const CurrencyCell = styled(NumberCell)`
  &:before {
    content: "$";
    color: #aaaaaa;
  }
`

const Timeframe = styled.div`
  margin: 1rem 0;
`

const Table = styled.table`
  margin: 1rem;
`

const TotalRow = styled.tr`
  outline: 1px solid #444444;
`

export default observer(Admin)
