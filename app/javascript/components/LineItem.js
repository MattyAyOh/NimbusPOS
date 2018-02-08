import React from "react"
import styled from "styled-components"

const LineItem = ({name, rate, quantity, amount}) => {
  return (
    <Layout>
      <span>{name}</span>
      <span>{rate && `$${rate}`}</span>
      <span>{quantity}</span>
      <span>${amount}</span>
    </Layout>
  )
}

const Layout = styled.div`
  display: grid;
`

export default LineItem
