import React from "react"
import styled from "styled-components"

import Reservation from "./Reservation"

const Reservations = () => (
  <Layout>
    <Layout.Title>Reservations</Layout.Title>

    {server("Reservation.all.order_by(:start_time)")
      .map((reservation) => (
        <Layout.Reservation
          {...reservation}
        />
    ))}
  </Layout>
)

const server = (code) => (
[
  {
    start_time: "2017-05-20 10pm",
    end_time: "2017-05-20 12pm",
    service: "pool",
    room: 4,
  },
  {
    start_time: "2017-05-20 12pm",
    end_time: "2017-05-21 4am",
    service: "karaoke",
    room: 1,
  },
]
)

const Layout = styled.div`
`

Layout.Title = styled.h1`
  text-align: center;
`

Layout.Reservation = styled(Reservation)`
`

export default Reservations
