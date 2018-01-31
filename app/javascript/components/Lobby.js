import React from "react"
import styled from "styled-components"

const blue = "#4a90e2"

class Lobby extends React.Component {
  render () {
    return (
      <Layout>
        <Service>
          <Emoji> 🀄️ </Emoji>

          <Tables>
            <Time>8:00</Time>
            <Number>1</Number>
            <Price>$14.00</Price>

            <Time></Time>
            <Number>2</Number>
            <Price></Price>

            <Time></Time>
            <Number>3</Number>
            <Price></Price>

            <Time></Time>
            <Number>4</Number>
            <Price></Price>

            <Time></Time>
            <Number>5</Number>
            <Price></Price>

            <Time></Time>
            <Number>6</Number>
            <Price></Price>

            <Time></Time>
            <Number>7</Number>
            <Price></Price>

            <Time></Time>
            <Number>8</Number>
            <Price></Price>
          </Tables>
        </Service>

        <Service>
          <Emoji> 🎱 </Emoji>

          <Tables>
            <Time></Time>
            <Number>1</Number>
            <Price></Price>

            <Time></Time>
            <Number>2</Number>
            <Price></Price>

            <Time></Time>
            <Number>3</Number>
            <Price></Price>

            <Time></Time>
            <Number>4</Number>
            <Price></Price>
          </Tables>
        </Service>

        <Service>
          <Emoji> 🎤 </Emoji>

          <Tables>
            <Time></Time>
            <Number>1</Number>
            <Price></Price>

            <Time></Time>
            <Number>2</Number>
            <Price></Price>

            <Time>7:30</Time>
            <Number>3</Number>
            <Price>$19</Price>

            <Time></Time>
            <Number>4</Number>
            <Price></Price>
          </Tables>
        </Service>
      </Layout>
    );
  }
}

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

export default Lobby
