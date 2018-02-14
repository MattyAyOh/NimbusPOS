import React from "react"
import styled from "styled-components"

import Table from "./Table"

const service_directory = {
  mahjong: "🀄️ ",
  pool: "🎱 ",
  ktv: "🎤 ",
}

const Lobby = (props) => (
  <Layout position={props.position}>
    { Object.keys(service_directory).map((service_name) => (
      <Service key={service_name}>
        <Emoji>{ service_directory[service_name] }</Emoji>

        <Tables>
          {props.services.filter(s => s.service == service_name).map((table) => (
            <Table
              current_time={props.current_time}
              key={table.position}
              refresh={props.refresh}
              service={service_name}
              {...table}
            />
          ))}
        </Tables>
      </Service>
    ))}
  </Layout>
)

const Layout = styled.div`
  ${(p) => p.position};
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
