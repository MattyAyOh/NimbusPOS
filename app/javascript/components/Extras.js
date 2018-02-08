import React from "react"
import styled from "styled-components"

import Extra from "./Extra"

const Extras = (props) => (
  <div>
    {props.items.map((item) => (
      <Extra
        key={item.name}
        order={props.order}
        params={props.params}
        {...item}
      />
    ))}
  </div>
)

export default Extras
