import React from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import Header from "./Header"

const BigScreen = observer(({ extras, services, room_pricing_factor }) => (
  <Layout>
    <Header/>

    { room_pricing_factor < 1.0 &&
      <Banner>
        Discount! Rooms are {100 - room_pricing_factor * 100} % off!
      </Banner>
    }

    <iframe
      alt="Video of Bub the cat yawning and stretching in front of a warm fire"
      src="https://www.youtube.com/embed/ZuHZSbPJhaY?autoplay=1&loop=1&modestbranding=1&fs=0&controls=0&iv_load_policy=3"
    />
  </Layout>
))

const Layout = styled.div`
  background-color: black;
  color: white;
  height: 100vh;
`

const Banner = styled.div`
`

const Info = styled.span`
  margin-left: 1rem;
`

export default BigScreen
