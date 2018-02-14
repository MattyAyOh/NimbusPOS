import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import moment from "moment"
import jquery from "jquery"

import Checkout from "./Checkout"
import Extras from "./Extras"
import TabView from "./TabView"

class Order extends React.Component {
  constructor(props) {
    super(props)

    this.service = this.props
      .state
      .services
      .filter(s =>
        s.service == this.props.params.service &&
        s.position == this.props.params.number
      )[0]

    this.order = this.service.current_order

    this.state = {
      start_time: this.order.start_time,
      end_time: this.order.end_time,
    }
  }

  render() {
    return (
      <Layout>
        <CloseLink to="/" onClick={this.props.refresh}>Close</CloseLink>
        <Link to="/" onClick={this.cancelOrder.bind(this)}>Cancel Order</Link>

        <h2>{this.service.name} #{this.service.position}</h2>

        <input
          type="time"
          value={moment(this.state.start_time).format("HH:mm")}
          onChange={(event) => this.timeUpdated("start_time", event.target.value)}
        />

        to

        <input
          type="time"
          value={moment(this.state.end_time).format("HH:mm")}
          onChange={(event) => this.timeUpdated("end_time", event.target.value)}
        />

        <TabView
          tabs={{
            snacks: () => <Extras
                            extras={this.order.extras}
                            items={this.props.state.snacks}
                            order={this.order}
                            params={this.props.params}
                          />,
            drinks: () => <Extras
                            extras={this.order.extras}
                            items={this.props.state.drinks}
                            order={this.order}
                            params={this.props.params}
                          />,
            checkout: () => <Checkout
                            extras={this.order.extras}
                            order={this.order}
                            params={this.props.params}
                            service={this.service}
                          />
          }}
        />
      </Layout>
    )
  }

  cancelOrder() {
    let params = this.props.params

    jquery.ajax({
      url: "/destroy/order",
      type: "PUT",
      data: { params },
      success: (response) => this.props.refresh(),
    })
  }

  timeUpdated(field, new_time) {
    let new_timestamps = {
      start_time: this.state.start_time,
      end_time: this.state.end_time,
    }

    new_timestamps[field] = moment(new_time, "HH:mm").toDate()

    this.persist(new_timestamps)
  }

  persist = (state) => {
    let params = this.props.params

    this.setState({ ...state, persisted: false })

    jquery.ajax({
      url: "/update/order",
      type: "PUT",
      data: { params, state },
      success: (response) => this.setState({ persisted: response.persisted }),
    })
  }
}

const blue = "#4a90e2"
const Layout = styled.div`
  border-left: 2rem solid ${blue};
  display: grid;
  height: 100%;
  overflow-y: scroll;
  padding: 0 4rem;
`

const CloseLink = styled(Link)`
  text-align: right;
`

export default Order
