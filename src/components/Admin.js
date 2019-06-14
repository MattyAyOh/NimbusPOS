import React from "react"
import styled from "styled-components"
import { observer, Observer } from "mobx-react"
import { DateTime } from "luxon"
import { observable, reaction, computed } from "mobx"
import Selection from "../principals/Selection"

@observer
class Admin extends React.Component {
  timeframes = {
    "Week to date":   [DateTime.fromObject({ weekDay: 1 }), DateTime.local()],
    "Month to date":  [DateTime.fromObject({ day: 1 }), DateTime.local()],
    "Rolling Week":   [DateTime.local().minus({ week: 1 }), DateTime.local()],
    "Rolling 30-day": [DateTime.local().minus({ day: 30 }), DateTime.local()],
  }

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

        Revenue by Item:
        <Observer>{() =>
          <table>
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
          </table>
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
}

const Layout = styled.div`
`

const NumberCell = styled.td`
  text-align: right;
`

const Timeframe = styled.div`
  margin: 1rem 0;
`

export default Admin
