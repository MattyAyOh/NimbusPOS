import React from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import Header from "./Header"
import emojis from "../Emojis"

import Icon, { Stack } from "@mdi/react"
import { mdiSmoking, mdiBlockHelper } from "@mdi/js"

const BigScreen = observer(({ extras, services, room_pricing_factor }) => (
  <Layout>
    <Layout.Section>
      <Heading>Drinks</Heading>

      {extras.filter(e => e.extra_type === 'drink').map(extra =>
        <Extra key={extra.name}>
          <Extra.Image src={extra.image_url} alt={extra.name} />
          <Extra.Name>{extra.name}</Extra.Name>
          <Price>{extra.price}</Price>
        </Extra>
      )}
    </Layout.Section>

    <Layout.Section>
      <Header/>

      <Embed
        alt="Video of Bub the cat yawning and stretching in front of a warm fire"
        src={`https://www.youtube.com/embed/ZuHZSbPJhaY?${
          [
            "autoplay=1",
            "loop=1",
            "playlist=ZuHZSbPJhaY",

            "controls=0",
            "fs=0",
            "iv_load_policy=3",
            "modestbranding=1",
          ].join("&")
        }`}
      />

      <NoSmoking>
        {[1,2,3].map((i) => (
          <Stack size="3rem" key={i}>
            <Icon path={mdiSmoking} color="white" size={0.7} />
            <Icon path={mdiBlockHelper} color="red"/>
          </Stack>
        ))}
      </NoSmoking>

      <Heading>Services</Heading>

        <Service>
          <Info>{emojis.mahjong}</Info>
          <Info>Mahjong</Info>
          <RentalPrice>
            {services.filter(s => s.service === 'mahjong')[0] && services.filter(s => s.service === 'mahjong')[0].hourly_rate}
          </RentalPrice>
        </Service>

        <Service>
          <Info>{emojis.pool}</Info>
          <Info>Pool</Info>
          <RentalPrice>
            {services.filter(s => s.service === 'pool')[0] && services.filter(s => s.service === 'pool')[0].hourly_rate}
          </RentalPrice>
        </Service>

        <Service>
          <Info>{emojis.ktv}</Info>
          <Info>KTV</Info>
          <RentalPrice>
            {services.filter(s => s.service === 'ktv')[0] && services.filter(s => s.service === 'ktv')[0].hourly_rate}
          </RentalPrice>
        </Service>

        <Service>
          <Info>{emojis.ktv}</Info>
          <Info>KTV (large)</Info>
          <RentalPrice>
            {services.filter(s => s.service === 'ktv' && s.position === 4)[0] && services.filter(s => s.service === 'ktv' && s.position === 4)[0].hourly_rate}
          </RentalPrice>
        </Service>

        <Banner>
          Discount!
          Rooms are 20% off,
          Mon - Thurs
        </Banner>
      </Layout.Section>

    <Layout.Section>
      <Heading>Snacks</Heading>

      {extras.filter(e => e.extra_type === 'snack').map(extra =>
        <Extra key={extra.name}>
          <Extra.Image src={extra.image_url} alt={extra.name} />
          <Extra.Name>{extra.name}</Extra.Name>
          <Price>{extra.price}</Price>
        </Extra>
      )}

      <Heading>Misc</Heading>

      {extras.filter(e => e.name === 'Playing Cards').map(extra =>
        <Extra key={extra.name}>
          <Extra.Image src={extra.image_url} alt={extra.name} />
          <Extra.Name>{extra.name}</Extra.Name>
          <Price>{extra.price}</Price>
        </Extra>
      )}
    </Layout.Section>
  </Layout>
))

const Layout = styled.div`
  background-color: black;
  color: white;
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 4rem;
`

Layout.Header = styled.div`
  grid-area: 1 / 1 / 1 / -1;
`

Layout.Section = styled.div`
  position: relative
`

const Heading = styled.h2`
  text-align: center;
  color: rgb(74,144,226);
`

const Banner = styled.div`
  background-color: #c44;
  padding: 1em;
  text-align: center;
  margin-top: 2em;
  position: relative;

  &:before, &:after {
    content: "";
    top: 0;
    position: absolute;
    display: block;
    border: 1.5em solid transparent;
    z-index: 1;
  }

  &:before {
    left: 0;
    border-left-color: black;
  }

  &:after {
    right: 0;
    border-right-color: black;
  }
`

const Info = styled.span`
  margin-left: 1rem;
`

const Extra = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem;
  border-top: 1px solid rgb(74,144,226);

  & > ${Info} {
    font-size: 1.4rem;
  }
`

const Price = styled(Info)`
  &:before {
    content: '$';
  }
`

const RentalPrice = styled(Price)`
  &:after {
    content: ' / hr';
  }
`

Extra.Name = Info

Extra.Image = styled.img`
  height: 3rem;
`

const Embed = styled.iframe`
  height: 18rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  width: 100%;
`

const Service = styled.div`
  font-size: 1.6rem;
  display: flex;
  justify-content: space-around;
`

const NoSmoking = styled.div`
  display: flex;
  justify-content: space-around;
`

export default BigScreen
