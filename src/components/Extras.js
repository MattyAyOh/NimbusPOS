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
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;
`

export default Extras
