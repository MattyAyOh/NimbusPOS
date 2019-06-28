import React from "react"
import styled from "styled-components"
import { observer, Observer } from "mobx-react"
import { DateTime } from "luxon"
import { observable, computed } from "mobx"
import Selection from "../principals/Selection"

@observer
class Admin extends React.Component {
  @observable timeframe = "Week to date"

  render () {
    return (
      <Layout>
        Nimbus

        <Timeframe>
          <Selection
            update={() => this.timeframe}
            options={Object.keys(this.timeframes)}
            onChange={(selection) => this.timeframe  = selection}
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
                <tr>
                  <td>{name}:</td>
                  <NumberCell>
                    {hours_spent.toFixed(2)} hours
                  </NumberCell>
                </tr>
              )
            })}
          </Table>
        }</Observer>

        Revenue by Item:
        <Observer>{() =>
          <Table>
            {this.selected_extras
              .filter(extra => this.amount_spent_on(extra, this.orders_within_timeframe) > 0)
              .sort((a, b) => this.amount_spent_on(b, this.orders_within_timeframe) - this.amount_spent_on(a, this.orders_within_timeframe))
              .map(extra =>
                <tr>
                  <td>{extra.name}:</td>
                  <NumberCell>
                    ${this.amount_spent_on(extra, this.orders_within_timeframe)}
                  </NumberCell>
                </tr>
            )}
          </Table>
        }</Observer>
      </Layout>
    );
  }

  @computed get orders_within_timeframe() {
    return this.props.assembly.order_archive.filter(order =>
      DateTime.fromISO(order.closed_at) > this.selected_timeframe_start &&
      DateTime.fromISO(order.closed_at) < this.selected_timeframe_end
    )
  }

  @computed get selected_extras() {
    return this.props.assembly.extras
  }

  amount_spent_on(extra, orders) {
    return this.orders_within_timeframe
      .map(order => order.extras.filter(e => e.extra.name === extra.name).map(e => e.quantity))
      .flat()
      .reduce((a,b) => a + b, 0) * extra.price
  }

  @computed get selected_timeframe_start() {
    return this.timeframes[this.timeframe][0]
  }

  @computed get selected_timeframe_end() {
    return this.timeframes[this.timeframe][1]
  }

  @computed get timeframes() {
    return {
      "Week to date":   [DateTime.fromObject({ weekDay: 1 }), DateTime.local()],
      "Month to date":  [DateTime.fromObject({ day: 1 }), DateTime.local()],
      "Rolling Week":   [DateTime.local().minus({ week: 1 }), DateTime.local()],
      "Rolling 30-day": [DateTime.local().minus({ day: 30 }), DateTime.local()],
      "All time": [
        this.props.assembly.order_archive.map(order => DateTime.fromISO(order.closed_at)).sort()[0],
        DateTime.local(),
      ]
    }
  }
}

const Layout = styled.div`
`

const NumberCell = styled.td`
  text-align: right;
  padding-left: 1rem;
`

const Timeframe = styled.div`
  margin: 1rem 0;
`

const Table = styled.table`
  margin: 1rem;
`

export default Admin
