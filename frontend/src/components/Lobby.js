import React from "react"
import styled from "styled-components"
import moment from "moment"

import Table from "./Table"

const service_icons = {
  mahjong: "🀄️ ",
  pool: "🎱 ",
  ktv: "🎤 ",
}

class Lobby extends React.Component {
  constructor(props) {
    super(props)

    this.timer = null

    this.state = { current_time: moment() }
  }

  componentDidMount() {
    this.timer = setInterval(() => this.setTime(), 1000)
  }

  setTime() {
    this.setState({ current_time: moment() })
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    return (
      <Layout>
        { Object.keys(service_icons).map((service_name) => (
          <Service key={service_name}>
            <Emoji>{ service_icons[service_name] }</Emoji>

            <Tables>
              {this.props.services.filter(s => s.service == service_name).map((table) => (
                <Table
                  current_time={this.state.current_time}
                  key={table.position}
                  refresh={this.props.refresh}
                  service={service_name}
                  {...table}
                />
              ))}
            </Tables>
          </Service>
        ))}
      </Layout>
    )
  }
}

const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`

const Emoji = styled.span`
  font-size: 4rem;
  padding-bottom: 2rem;
`

const Service = styled.div`
  text-align: center;
`

const Tables = styled.div`
  margin-top: 2rem;
`

export default Lobby
