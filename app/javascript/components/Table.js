import React from "react"
import styled from "styled-components"
import moment from "moment"
import {Link} from "react-router-dom"
import jquery from "jquery"

import bill_amount from "../utils/bill_amount"

const blue = "#4a90e2"
const grey = "#afb5bd"

class Table extends React.Component {
  render() {
    return (
      <Layout>
        <Time>
          {this.props.current_order &&
            moment(this.props.current_order.start_time).format('LT')}
        </Time>

        {this.props.current_order
        ? <Number active>
            <Link to={`/table/${this.props.service}/${this.props.position}`} >
              {this.props.position}
            </Link>
          </Number>
        : <Number onClick={this.ensureCurrentOrder.bind(this)} >
            {this.props.position}
          </Number>
        }

        <Price>
          {bill_amount(this.props.current_order, this.props.hourly_rate, this.props.current_time)}
        </Price>
      </Layout>
    )
  }

  ensureCurrentOrder() {
    const params = {
      service: this.props.service,
      position: this.props.position,
    }

    jquery.ajax({
      url: "/create/order",
      type: "PUT",
      data: { params },
      success: (response) => this.props.refresh(),
    })
  }
}

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

export default Table;
