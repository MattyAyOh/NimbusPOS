import React from "react"
import styled from "styled-components"
import { DateTime } from "luxon"
import { observer } from "mobx-react"
import Component from "../principals/Component"

const Reservation = observer(({ assembly, start_time, end_time, service_name, service_position }) => (
  <Component
    assembly={assembly}
    uuid="8d95acd5-fd55-413d-a98b-7c185b7f2436"
  >
    <p>{ service_name } { service_position }</p>

    <p>
      { DateTime.fromISO(start_time).toLocaleString(DateTime.DATE_TIME) }
      &nbsp; to &nbsp;
      { DateTime.fromISO(end_time).toLocaleString(DateTime.DATE_TIME) }
    </p>
  </Component>
))

const Layout = styled.div`
  margin-bottom: 2rem;
`

export default Reservation
