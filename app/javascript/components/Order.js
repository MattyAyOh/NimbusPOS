import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"

import Loading from "./assemble/Loading"

import TabView from "./TabView"
import Extras from "./Extras"

const Order = (props) => (
  props.state
  ? <Layout>
      <CloseLink to="/">Close</CloseLink>

      <TabView
      tabs={{
        snacks: () => <Extras {...props.extras} items={props.state.snacks} />,
        drinks: () => <Extras {...props.extras} items={props.state.drinks} />,
        checkout: () => <div>Checkout!</div>,
      }}
      />
    </Layout>
  : <Loading/>
)

const Layout = styled.div`
  display: grid;
`

const CloseLink = styled(Link)`
  text-align: right;
`

export default Order
