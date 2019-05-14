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
        {...item}
        assembly={props.assembly}
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
