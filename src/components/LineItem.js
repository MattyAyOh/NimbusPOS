import React from "react"
import styled from "styled-components"

import { observer } from "mobx-react"

const LineItem = observer(({name, rate, quantity, amount}) => (
  <Layout>
    <span>{name}</span>
    <span>{rate && `$${rate}`}</span>
    <span>{quantity}</span>
    <Right>${amount}</Right>
  </Layout>
))

const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: 2rem;
`

const Right = styled.span`
  text-align: right;
`

export default LineItem
