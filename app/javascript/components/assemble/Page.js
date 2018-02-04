import React from "react"
import styled from "styled-components"
import { Route } from "react-router"

/* `Page`
 * A generic React component that can be customized with a variety of behaviors.
 *
 * Settings:
 * `component`: A child component to display
 * `path`: An optional URL fragment at which to display the page.
 * `position`:
 *     A position within the parent layout at which to display this page.
 */
const Page = (props) => {
  const area = (
    <Canvas position={props.position}>
      {React.createElement(props.component)}
    </Canvas>
  )

  const page = props.path
    ? <Route path={props.path} component={() => area} />
    : area

  return page
}

const Canvas = styled.div`
  ${(p) => p.position};
  border: 1px solid #000;
  background-color: #fff;
`

export default Page
