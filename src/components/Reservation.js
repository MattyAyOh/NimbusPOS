import React from "react"
import styled from "styled-components"
import { DateTime } from "luxon"
import { observer } from "mobx-react"

const time_format = "ddd M/DD, h:mm A"

const Reservation = observer(({ start_time, end_time, service_name, service_position }) => (
  <Layout>
    <p>{ service_name } { service_position }</p>

    <p>
      { DateTime.fromISO(start_time).format(time_format) }
      to
      { DateTime.fromISO(end_time).format(time_format) }
    </p>
  </Layout>
))

const Layout = styled.div`
  margin-bottom: 2rem;
`

export default Reservation
