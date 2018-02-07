import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import moment from "moment"
import jquery from "jquery"

import Loading from "./assemble/Loading"

import TabView from "./TabView"
import Extras from "./Extras"

class Order extends React.Component {
  constructor(props) {
    super(props)

    const order = this.props
      .state
      .services
      .filter(s => s.service == this.props.params.service && s.position == this.props.params.number)[0]
      .current_order

    this.state = {
      start_time: order.start_time,
      end_time: order.end_time,
    }
  }

  render() {
    return this.props.state
    ? <Layout>
        <CloseLink to="/">Close</CloseLink>
        <h2></h2>

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
                            extras={this.props.extras}
                            items={this.props.state.snacks}
                            params={this.props.params}
                            state={this.props.state}
                            {...this.props.extras}
                          />,
            drinks: () => <Extras
                            extras={this.props.extras}
                            items={this.props.state.drinks}
                            params={this.props.params}
                            state={this.props.state}
                            {...this.props.extras}
                          />,
            checkout: () => <div>Checkout!</div>,
          }}
        />
      </Layout>
    : <Loading/>
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

const Layout = styled.div`
  display: grid;
`

const CloseLink = styled(Link)`
  text-align: right;
`

export default Order
