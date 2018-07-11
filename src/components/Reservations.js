import React from "react"
import styled from "styled-components"

import Reservation from "./Reservation"

import { observer } from "mobx-react"

const Reservations = observer(({ reservations }) => (
  <Layout>
    <Layout.Title>Reservations</Layout.Title>

    {reservations.map((reservation) => (
      <Layout.Reservation {...reservation} />
    ))}
  </Layout>
))

const Layout = styled.div`
`

Layout.Title = styled.h1`
  text-align: center;
`

Layout.Reservation = styled(Reservation)`
`

export default Reservations
