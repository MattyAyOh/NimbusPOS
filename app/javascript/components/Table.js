import React from "react"
import styled from "styled-components"
import moment from "moment"
import {Link} from "react-router-dom"

const blue = "#4a90e2"
const grey = "#afb5bd"

const Table = (table) => (
  <Layout>
    <Time>
      {table.current_order &&
        moment(table.current_order.start_time).format('LT')}
    </Time>

    <Number active={table.current_order}>
      <Link to={`/table/${table.service}/${table.position}`}>
        {table.position}
      </Link>
    </Number>

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
  color: ${grey};
  text-align: right;
`

const Number = styled.div`
  align-items: center;
  background-color: ${({active}) => active ? grey : blue};
  border: 1px solid white;
  color: white;
  display: grid;
  font-size: 2rem;
  height: 3rem;
  text-align: center;
  width: 3rem;
`

const Price = styled.span`
  color: ${grey};
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
