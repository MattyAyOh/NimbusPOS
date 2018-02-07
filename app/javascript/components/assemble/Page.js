import React from "react"
import styled from "styled-components"
import { Route } from "react-router"

/* `Page`
 * A generic React component that can be customized with a variety of behaviors.
 *
 * Settings:
 * `component`: A child component to display
 * `path`: The URL fragment at which to display the page
 * `position`:
 *     A position within the parent layout at which to display this page
 */
const Page = ({ path, component, position }) => (
  <Route
    path={path}
    component={({ match }) => (
      <Canvas position={position}>
        {React.createElement(component, { params: match.params })}
      </Canvas>
    )}
  />
)

const Canvas = styled.div`
  ${(p) => p.position};
  border: 1px solid #000;
  background-color: #fff;
`

export default Page
