import React from "react"
import styled from "styled-components"
import moment from "moment"

const blue = "#4a90e2"


const Table = (table) => (
  <Layout>
    <Time>
      {table.current_order &&
        moment(table.current_order.start_time).format('LT')}
    </Time>

    <Number>{table.position}</Number>

    <Price>
      {table.current_order &&
        "$" + toTwoDecimals(table.current_order.accumulated_cost)}
    </Price>
  </Layout>
)

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-column-gap: 0.5rem;
  align-items: center;
`

const Time = styled.span`
  text-align: right;
`

const Number = styled.span`
  text-align: center;
  display: block;
  background-color: ${blue};
  color: white;
  border: 1px solid white;
  font-size: 2rem;
  height: 3rem;
  width: 3rem;
`

const Price = styled.span`
  text-align: left;
`

const toTwoDecimals = (number) => (
  parseFloat(
    Math.round(
      number * 100
    ) / 100
  ).toFixed(2)
)

export default Table;
