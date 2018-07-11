import React from "react"
import styled from "styled-components"

import Extra from "./Extra"

import { observer } from "mobx-react"

const Extras = observer((props) => (
  <Layout>
    {props.store.extras.filter(extra =>
      extra.extra_type === props.type
    ).map(extra =>
      <Extra
        store={props.store}
        key={extra.name}
        extra={extra}
      />
    )}
  </Layout>
))

const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;
`

export default Extras
