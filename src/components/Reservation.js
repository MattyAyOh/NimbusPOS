import React from "react"
import styled from "styled-components"

const Reservation = ({ start_time, end_time, service, room }) => (
  <Layout>
    <p>{ service } { room }</p>
    <p>{ start_time } to { end_time }</p>
  </Layout>
)

const Layout = styled.div`
  margin-bottom: 2rem;
`

export default Reservation
