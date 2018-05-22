import React from "react"
import styled from "styled-components"
import moment from "moment"

const time_format = "ddd M/DD, h:mm A"

const Reservation = ({ start_time, end_time, service_name, service_position }) => (
  <Layout>
    <p>{ service_name } { service_position }</p>
    <p>{ moment(start_time).format(time_format) } to { moment(end_time).format(time_format) }</p>
  </Layout>
)

const Layout = styled.div`
  margin-bottom: 2rem;
`

export default Reservation
