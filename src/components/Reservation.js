import React from "react"
import styled from "styled-components"
import { DateTime } from "luxon"
import { observer } from "mobx-react"

const Reservation = observer(({ start_time, end_time, service_name, service_position }) => (
  <Layout>
    <p>{ service_name } { service_position }</p>

    <p>
      {
        DateTime.fromISO(start_time).toLocaleString(DateTime.DATETIME_SHORT)
      } to {
        DateTime.fromISO(end_time).toLocaleString(DateTime.DATETIME_SHORT)
      }
    </p>
  </Layout>
))

const Layout = styled.div`
  margin-bottom: 2rem;
`

export default Reservation
