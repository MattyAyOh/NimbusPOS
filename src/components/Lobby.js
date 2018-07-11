import React from "react"
import styled from "styled-components"
import moment from "moment"
import { observable } from "mobx"
import { observer } from "mobx-react"

import Table from "./Table"

const service_icons = {
  mahjong: "🀄️ ",
  pool: "🎱 ",
  ktv: "🎤 ",
}

@observer
class Lobby extends React.Component {
  @observable current_time = moment()

  constructor(props) {
    super(props)

    this.timer = null
  }

  componentDidMount() {
    this.timer = setInterval(() => this.current_time = moment(), 1000)
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
              {this.props.store.services.filter(s => s.service === service_name).map((table) => (
                <Table
                  store={this.props.store}
                  current_time={this.current_time}
                  key={table.position}
                  service={table}
                />
              ))}
            </Tables>
          </Column>
        ))}

        <Link onClick={() => this.props.store.showReservations()}>
          Reservations
        </Link>
      </Layout>
    )
  }
}

const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr 5rem;
  height: 100%;
`

// TODO handle colors better
const blue = "#4a90e2"

const Link = styled.span`
  grid-area: 2 / 2 / 2 / 2;
  color: ${blue};
  text-decoration: underline;
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
