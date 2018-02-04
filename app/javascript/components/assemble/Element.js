import React from "react"
import styled from "styled-components"
import { Route } from "react-router"

/* `Element`
 * A generic React component that can be customized with a variety of behaviors.
 *
 * Settings:
 * `position`: A position object provided by the parent layout
 * `path`: optional URL fragment at which to display the element
 */
const Element = (props) => {
  const area = (
    <Layout position={props.position}>
      Element
    </Layout>
  )

  const element = props.path
    ? <Route path={props.path} component={() => area} />
    : area

  return element
}

const Layout = styled.div`
  ${(p) => p.position};
`

export default Element
