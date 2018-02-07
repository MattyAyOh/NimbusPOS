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
      <h2></h2>

      <TabView
        tabs={{
          snacks: () => <Extras
                          extras={props.extras}
                          items={props.state.snacks}
                          params={props.params}
                          state={props.state}
                          {...props.extras}
                        />,
          drinks: () => <Extras
                          extras={props.extras}
                          items={props.state.drinks}
                          params={props.params}
                          state={props.state}
                          {...props.extras}
                        />,
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
