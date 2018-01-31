import React from "react"
import styled from "styled-components"

import Table from "./Table"

const service_directory = {
  mahjong: "🀄️ ",
  pool: "🎱 ",
  ktv: "🎤 ",
}

const Lobby = (props) => (
  <Layout>
    { Object.keys(service_directory).map((service_name) => (
      <Service key={service_name}>
        <Emoji>{ service_directory[service_name] }</Emoji>

        <Tables>
          {props.services[service_name].map((table) => (
            <Table service={service_name} {...table} key={table.position}/>
          ))}
        </Tables>
      </Service>
    ))}
  </Layout>
)

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
