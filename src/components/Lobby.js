import React from "react"
import styled from "styled-components"
import { DateTime } from "luxon"
import { observable } from "mobx"
import { observer, Observer } from "mobx-react"
import Table from "./Table"
import service_icons from "../Emojis"
import { primary } from "../colors"
import Header from "./Header"
import Loading from "./Loading"
import Order from "./Order"
import Reservations from "./Reservations"

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
        <Header/>

        <Layout.Left>
          { this.loaded
          ? <InnerLayout>
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

              <InnerLayout.Discount>
                { (
                  this.props.assembly.room_discount_day === DateTime.local().weekday  ||
                  this.props.assembly.room_discount_day === 0
                )
                    ? `Today's discount: ${this.props.assembly.room_pricing_factor * 100}% room prices.`
                    : `No discount today.`
                }
              </InnerLayout.Discount>
            </InnerLayout>
          : <Loading/>
          }
        </Layout.Left>

        <Layout.Right>
          <Observer>{() =>
            this.visible_order
            ? <Order
                assembly={this.props.assembly}
                key={this.visible_service_type + this.visible_position + this.loaded}
              />
            : <Reservations assembly={this.props.assembly} />
          }</Observer>
        </Layout.Right>
      </Layout>
    )
  }
}

const InnerLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr 5rem 5rem;
  height: 100%;
  grid-row-gap: 2rem;
`

InnerLayout.Discount = styled.div`
  grid-area: 2 / 1 / 2 / 4;
  text-align: center;
`

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
