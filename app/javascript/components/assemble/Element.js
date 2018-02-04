import React from "react"
import styled from "styled-components"
import { Route } from "react-router"

/* `Element`
 * A generic React component that can be customized with a variety of behaviors.
 *
 * Settings:
 * `component`: A child component to display
 * `path`: An optional URL fragment at which to display the element.
 * `position`:
 *     A position within the parent layout at which to display this element.
 */
const Element = (props) => {
  const area = (
    <Canvas position={props.position}>
      {React.createElement(props.component)}
    </Canvas>
  )

  const element = props.path
    ? <Route path={props.path} component={() => area} />
    : area

  return element
}

const Canvas = styled.div`
  ${(p) => p.position};
  border: 1px solid #000;
  background-color: #fff;
`

export default Element
