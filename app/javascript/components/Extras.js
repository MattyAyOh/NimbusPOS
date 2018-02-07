import React from "react"
import styled from "styled-components"

import Extra from "./Extra"

const Extras = (props) => (
  <div>
    {props.items.map((item) => (
      <Extra
        key={item.name}
        params={props.params}
        state={props.state}
        {...item}
      />
    ))}
  </div>
)

export default Extras
