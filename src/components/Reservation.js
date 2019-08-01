import React from "react"
import styled from "styled-components"
import { DateTime } from "luxon"
import { observer } from "mobx-react"
import Button from "../principals/Button"

const Reservation = observer(({ assembly, start_time, end_time, service, id }) => (
  <Layout>
    <div>
      <Name>{ service.name } { service.position }:</Name>

      {
        start_time.toLocaleString(DateTime.TIME_24_SIMPLE)
      } to {
        end_time.toLocaleString(DateTime.TIME_24_SIMPLE)
      }
    </div>

    <Button onClick={() => assembly.remove_reservation(id)}>
      Remove
    </Button>
  </Layout>
))

const Layout = styled.div`
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: 1fr auto;
`

const Name = styled.span`
  font-weight: bold;
  margin-right: 2rem;
`

export default Reservation
