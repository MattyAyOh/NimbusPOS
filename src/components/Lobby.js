import React from "react"
import styled from "styled-components"
import { DateTime } from "luxon"
import { Link } from "react-router-dom"
import { observable } from "mobx"
import { observer } from "mobx-react"
import Table from "./Table"
import service_icons from "../Emojis"

@observer
class Lobby extends React.Component {
  @observable current_time = DateTime.local()

  constructor(props) {
    super(props)

    this.timer = null
  }

  componentDidMount() {
    this.timer = setInterval(() => this.current_time = DateTime.local(), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    return (
      <Layout>
        { Object.keys(service_icons).map((service_name) => (
          <Column key={service_name}>
            <Emoji>{ service_icons[service_name] }</Emoji>

            <Tables>
              {this.props.services.filter(s => s.service === service_name).map((table) => (
                <Table
                  onEnsureCurrentOrder={this.props.onEnsureCurrentOrder}
                  current_time={this.current_time}
                  key={table.position}
                  service={table}
                  room_pricing_factor={this.props.room_pricing_factor}
                />
              ))}
            </Tables>
          </Column>
        ))}

        <Layout.Discount>
          Room Pricing:
          <PricingInput
            type="number"
            value={this.props.room_pricing_factor * 100}
            onChange={e => this.props.onRoomPricingFactorChange(e.target.value / 100.0)}
          />
          %
        </Layout.Discount>

        <Layout.ReservationLink to="/reservations">
          Reservations
        </Layout.ReservationLink>
      </Layout>
    )
  }
}

const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr 5rem 5rem;
  height: 100%;
`

Layout.Discount = styled.div`
  grid-area: 3 / 2 / 3 / 2;
`

const PricingInput = styled.input`
  width: 2rem;
  margin-left: 1rem;
`

Layout.ReservationLink = styled(Link)`
  grid-area: 2 / 2 / 2 / 2;
`

const Emoji = styled.span`
  font-size: 4rem;
  padding-bottom: 2rem;
`

const Column = styled.div`
  text-align: center;
`

const Tables = styled.div`
  margin-top: 2rem;
`

export default Lobby
