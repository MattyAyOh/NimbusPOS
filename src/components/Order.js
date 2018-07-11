import React from "react"
import styled from "styled-components"
import moment from "moment"
import { observer } from "mobx-react"

import TimeSpanInput from "./TimeSpanInput"
import Checkout from "./Checkout"
import Extras from "./Extras"
import TabView from "./TabView"
import Loading from "./Loading"

@observer
class Order extends React.Component {
  render() {
    return (
      this.props.store.currentView.order == null
      ? <Loading />
      : <Layout>
          <Links>
            <Link onClick={() => this.props.store.cancelOrder(this.props.store.currentView.order.service)} >
              Cancel Order
            </Link>

            <Link onClick={() => this.props.store.closeOrder(this.propss.order)}>Close</Link>
          </Links>

          <h2>{this.props.store.currentView.order.service.name} #{this.props.store.currentView.order.service.position}</h2>

          <TimeSpanInput
            startTime={this.props.store.start_time}
            endTime={this.props.store.end_time}
            onStartTimeChange={(newTime) => this.timeUpdated("start_time", newTime)}
            onEndTimeChange={(newTime) => this.timeUpdated("end_time", newTime)}
            hourOptions={[18,19,20,21,22,23,0,1,2,3,4,5,6]}
          />

          <TabView
            store={this.props.store}
            tabs={{
              snacks: () => <Extras store={this.props.store} type="snack" />,
              drinks: () => <Extras store={this.props.store} type="drink" />,
              other: () => <Extras store={this.props.store} type="other" />,
              checkout: () => <Checkout store={this.props.store} />
            }}
          />
        </Layout>
    )
  }

  // `field`: `"start_time"` or `"end_time"`
  // `new_time`: a `moment` object
  timeUpdated(field, new_time) {
    const current_hour = moment().get("hour")
    const chosen_hour = new_time.get("hour")

    // Chose a time before this past midnight?
    if(current_hour < 12 && chosen_hour > 12)
      new_time.subtract(1, "day")

    // Chose a time after this coming midnight?
    if(current_hour > 12 && chosen_hour < 12)
      new_time.add(1, "day")

    this.props.store.currentView.order[field] = new_time
  }
}

const Link = styled.span`
  color: #fff;
  text-decoration: underline;
`

const Layout = styled.div`
  background-color: #253241;
  color: #fff;
  display: grid;
  grid-template-rows: 4rem 1fr 1fr 80%;
  height: 100%;
  overflow-y: scroll;
  padding: 0 4rem;
`

const Links = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
`

export default Order
