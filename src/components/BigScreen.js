import React from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import Header from "./Header"
import emojis from "../Emojis"

import Icon, { Stack } from "@mdi/react"
import { mdiWifi, mdiSmoking, mdiBlockHelper } from "@mdi/js"

@observer
class BigScreen extends React.Component {
  layout = React.createRef()
  left = React.createRef()
  leftHeading = React.createRef()
  center = React.createRef()
  centerHeading = React.createRef()
  wifi = React.createRef()
  wifiName = React.createRef()
  wifiIcon = React.createRef()
  wifiPassword = React.createRef()
  video = React.createRef()
  no_smoking = React.createRef()
  servicesHeading = React.createRef()
  serviceMahjong = React.createRef()
  serviceMahjongEmoji = React.createRef()
  serviceMahjongTitle = React.createRef()
  serviceMahjongPrice = React.createRef()
  servicePool = React.createRef()
  servicePoolEmoji = React.createRef()
  servicePoolTitle = React.createRef()
  servicePoolPrice = React.createRef()
  serviceKaraoke = React.createRef()
  serviceKaraokeEmoji = React.createRef()
  serviceKaraokeTitle = React.createRef()
  serviceKaraokePrice = React.createRef()
  discount = React.createRef()
  right = React.createRef()
  snacks_heading = React.createRef()
  misc_heading = React.createRef()

  render = () => (
    <Layout container={this.props.container} ref={this.layout} innerRef={React.createRef()} >
      <Layout.Section container={this.layout} ref={this.left} innerRef={React.createRef()} >
        <Heading container={this.left} ref={this.leftHeading} innerRef={React.createRef()} >
          Drinks
        </Heading>

        {this.props.extras.filter(e => e.extra_type === 'drink').map(extra =>
          <Extra key={extra.name}>
            <Extra.Image src={extra.image_url} alt={extra.name} />
            <Extra.Name>{extra.name}</Extra.Name>
            <Price>{extra.price}</Price>
          </Extra>
        )}
      </Layout.Section>

      <Layout.Section container={this.layout} ref={this.center} innerRef={React.createRef()} >
        <Header container={this.center} ref={this.centerHeading} innerRef={React.createRef()} />

        <Wifi container={this.center} ref={this.wifi} innerRef={React.createRef()} >
          <Info container={this.wifi} ref={this.wifiName} innerRef={React.createRef()} >Nimbus</Info>
          <Icon container={this.wifi} ref={this.wifiIcon} innerRef={React.createRef()} size="2rem" color="white" path={mdiWifi} />
          <Info container={this.wifi} ref={this.wifiPassword} innerRef={React.createRef()} >01234567890</Info>
        </Wifi>

        <Embed
          container={this.center} ref={this.video} innerRef={React.createRef()}
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

        <NoSmoking container={this.center} ref={this.no_smoking} innerRef={React.createRef()} >
          {[1,2,3].map((i) => (
            <Stack size="3rem" key={i}>
              <Icon path={mdiSmoking} color="white" />
              <Icon path={mdiBlockHelper} color="red" />
            </Stack>
          ))}
        </NoSmoking>

        <Heading container={this.center} ref={this.servicesHeading} innerRef={React.createRef()} >Services</Heading>

        <Service container={this.center} ref={this.serviceMahjong} innerRef={React.createRef()} >
          <Info container={this.center} ref={this.serviceMahjongEmoji} innerRef={React.createRef()} >{emojis.mahjong}</Info>
          <Info container={this.center} ref={this.serviceMahjongTitle} innerRef={React.createRef()} >Mahjong</Info>
          <Price container={this.center} ref={this.serviceMahjongPrice} innerRef={React.createRef()} >
            {this.props.services.filter(s => s.service === 'mahjong')[0] && this.props.services.filter(s => s.service === 'mahjong')[0].hourly_rate}
          </Price>
        </Service>

        <Service container={this.center} ref={this.servicePool} innerRef={React.createRef()} >
          <Info container={this.center} ref={this.servicePoolEmoji} innerRef={React.createRef()} >{emojis.pool}</Info>
          <Info container={this.center} ref={this.servicePoolTitle} innerRef={React.createRef()} >Pool</Info>
          <Price container={this.center} ref={this.servicePoolPrice} innerRef={React.createRef()} >
            {this.props.services.filter(s => s.service === 'pool')[0] && this.props.services.filter(s => s.service === 'pool')[0].hourly_rate}
          </Price>
        </Service>

        <Service container={this.center} ref={this.serviceKaraoke} innerRef={React.createRef()} >
          <Info container={this.center} ref={this.serviceKaraokeEmoji} innerRef={React.createRef()} >{emojis.ktv}</Info>
          <Info container={this.center} ref={this.serviceKaraokeTitle} innerRef={React.createRef()} >KTV</Info>
          <Price container={this.center} ref={this.serviceKaraokePrice} innerRef={React.createRef()} >
            {this.props.services.filter(s => s.service === 'ktv')[0] && this.props.services.filter(s => s.service === 'ktv')[0].hourly_rate}
          </Price>
        </Service>

        <Service container={this.center} ref={this.serviceKaraokeLarge} innerRef={React.createRef()} >
          <Info container={this.center} ref={this.serviceKaraokeLargeEmoji} innerRef={React.createRef()} >{emojis.ktv}</Info>
          <Info container={this.center} ref={this.serviceKaraokeLargeTitle} innerRef={React.createRef()} >KTV (large)</Info>
          <Price container={this.center} ref={this.serviceKaraokeLargePrice} innerRef={React.createRef()} >
            {this.props.services.filter(s => s.service === 'ktv' && s.position === 4)[0] && this.props.services.filter(s => s.service === 'ktv' && s.position === 4)[0].hourly_rate}
          </Price>
        </Service>

        <Banner container={this.center} ref={this.discount} innerRef={React.createRef()} >
          Discount!
          Rooms are 20% off,
          Mon - Thurs
        </Banner>
      </Layout.Section>

      <Layout.Section container={this.layout} ref={this.right} innerRef={React.createRef()} >
        <Heading container={this.right} ref={this.snacks_heading} innerRef={React.createRef()} >Snacks</Heading>

        {this.props.extras.filter(e => e.extra_type === 'snack').map(extra =>
          <Extra key={extra.name}>
            <Extra.Image src={extra.image_url} alt={extra.name} />
            <Extra.Name>{extra.name}</Extra.Name>
            <Price>{extra.price}</Price>
          </Extra>
        )}

        <Heading container={this.right} ref={this.misc_heading} innerRef={React.createRef()} >Misc</Heading>

        {this.props.extras.filter(e => e.name === 'Playing Cards').map(extra =>
          <Extra key={extra.name}>
            <Extra.Image src={extra.image_url} alt={extra.name} />
            <Extra.Name>{extra.name}</Extra.Name>
            <Price>{extra.price}</Price>
          </Extra>
        )}
      </Layout.Section>
    </Layout>
  )
}

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
  margin-right: 1rem;
  font-size: 1.4rem;
`

const Extra = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem;
  border-top: 1px solid rgb(74,144,226);
`

const Price = styled(Info)`
  &:before {
    content: '$';
  }
`

Extra.Name = Info

Extra.Image = styled.img`
  height: 3rem;
`

const Embed = styled.iframe`
  height: 14rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  width: 100%;
`

const Service = styled.div`
  font-size: 1.6rem;
  display: flex;
  justify-content: space-around;

  & > ${Info} {
    font-size: 1.6rem;
  }

  & > ${Price}:after {
    content: ' / hr';
  }
`

const NoSmoking = styled.div`
  display: flex;
  justify-content: space-around;
  height: 3rem;
`

const Wifi = styled.div`
  align-items: center;
  display: flex;
  font-size: 1.2rem;
  justify-content: center;
  margin-top: 1rem;
`

export default BigScreen
