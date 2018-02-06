import React from "react"
import styled from "styled-components"

import Extra from "./Extra"

class Extras extends React.Component {
  render = () => (
    <div>
      {this.props.items.map((item) => (
        <Extra key={item.name} {...item} />
      ))}
    </div>
  )
}

export default Extras
