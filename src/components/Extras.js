import React from "react"
import styled from "styled-components"

import Extra from "./Extra"

import { observer } from "mobx-react"

const Extras = observer((props) => (
  <Layout>
    {props.items.map((item) => (
      <Extra
        onPersist={props.onPersist}
        key={item.name}
        order={props.order}
        {...item}
      />
    ))}
  </Layout>
))

const Layout = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-row-gap: 1rem;
`

export default Extras
