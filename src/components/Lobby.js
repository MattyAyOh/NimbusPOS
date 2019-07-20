import React from "react"
import styled from "styled-components"
import { DateTime } from "luxon"
import { observable } from "mobx"
import { observer } from "mobx-react"
import Table from "./Table"
import service_icons from "../Emojis"
import Selection from "../principals/Selection"
import { primary } from "../colors"

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
              { this.props.assembly.services
                .filter(s => s.name.toLowerCase() === service_name)
                .map((service) => (
                  <Table
                    current_time={this.current_time}
                    key={service.id}
                    service={service}
                    assembly={this.props.assembly}
                  />
              ))}
            </Tables>
          </Column>
        ))}

        <Layout.Discount>
          { (
            this.props.assembly.room_discount_day === DateTime.local().weekday  ||
            this.props.assembly.room_discount_day === 0
          )
              ? `Today's discount: ${this.props.assembly.room_pricing_factor * 100}% room prices.`
              : `No discount today.`
          }
        </Layout.Discount>
      </Layout>
    )
  }
}

const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr 5rem 5rem;
  height: 100%;
  grid-row-gap: 2rem;
`

Layout.Discount = styled.div`
  grid-area: 2 / 1 / 2 / 4;
  text-align: center;
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
