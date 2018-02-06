import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"

import TabView from "./TabView"
import Extras from "./Extras"

const Order = (props) => (
  <Layout>
    <CloseLink to="/">Close</CloseLink>

    <TabView
      tabs={{
        snacks: () => <Extras {...props.snacks} />,
        drinks: () => <Extras {...props.drinks} />,
        checkout: () => <div>Checkout!</div>,
      }}
    />
  </Layout>
)

const Layout = styled.div`
  display: grid;
`

const CloseLink = styled(Link)`
  text-align: right;
`

export default Order
