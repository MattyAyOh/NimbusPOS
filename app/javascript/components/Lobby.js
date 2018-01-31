import React from "react"
import styled from "styled-components"
import moment from "moment"

const blue = "#4a90e2"

const service_directory = {
  mahjong: "🀄️",
  pool: "🎱",
  ktv: "🎤",
}

class Lobby extends React.Component {
  render () {
    return (
      <Layout>
        { Object.keys(service_directory).map((service_name) => (
          <Service key={service_name}>
            <Emoji>{ service_directory[service_name] }</Emoji>

            <Tables>
              {this.props.services[service_name].map((table) => (
                <Table key={table.position}>
                  <Time>
                    {table.current_order &&
                      moment(table.current_order.start_time).format('LT')}
                  </Time>

                  <Number>{table.position}</Number>

                  <Price>
                    {table.current_order &&
                      "$" + toTwoDecimals(table.current_order.accumulated_cost)}
                  </Price>
                </Table>
              ))}
            </Tables>
          </Service>
        ))}
      </Layout>
    );
  }
}

const toTwoDecimals = (number) => (
  parseFloat(
    Math.round(
      number * 100
    ) / 100
  ).toFixed(2)
)

const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`

const Emoji = styled.span`
  font-size: 4rem;
  padding-bottom: 2rem;
`

const Service = styled.div`
  text-align: center;
`

const Tables = styled.div`
  margin-top: 2rem;
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

const Table = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-column-gap: 0.5rem;
  align-items: center;
`

export default Lobby
