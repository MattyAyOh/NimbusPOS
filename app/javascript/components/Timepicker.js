import React from "react"
import styled from "styled-components"
import moment from "moment"

const blue = "#4a90e2"

/*
 * Props:
 * `time`: a `moment` object
 * `onChange`: a callback function that takes a `moment` object.
 */
class Timepicker extends React.Component {
  constructor(props) {
    super(props)

    this.scrollOptions = {
      behavior: "auto",
      block: "center",
      inline: "nearest",
    }

    this.state = {
      open: false,
    }
  }

  minuteRendered(node, minute) {
    if(node && this.props.time.minute() == minute)
      node.scrollIntoView(this.scrollOptions)
  }

  hourRendered(node, hour) {
    if(node && this.props.time.hour() == hour)
      node.scrollIntoView(this.scrollOptions)
  }

  render() {
    return (
      <Wrapper
      >
        <TimeInput
          value={this.props.time ? this.props.time.format("HH:mm") : ""}
          onChange={(event) => this.props.onChange(moment(event.target.value, "HH:mm"))}
          onFocus={() => this.focused()}
          onKeyPress={(e) => e.key === "Enter" && this.enter(e)}
        />

        { this.state.open &&
          <TouchInput>
            <Scroll>
              {Array.apply(null, {length: 24}).map(Number.call, Number).map((hour) => (
                <TimeOption
                  innerRef={(node) => this.hourRendered(node, hour)}
                  key={hour}
                  onClick={() => this.hourSelected(hour)}
                  selected={hour == this.props.time.hour()}
                >{pad(hour, 2)}</TimeOption>
              ))}
            </Scroll>

            <Scroll>
              {Array.apply(null, {length: 60}).map(Number.call, Number).map((minute) => (
                <TimeOption
                  innerRef={(node) => this.minuteRendered(node, minute)}
                  key={minute}
                  onClick={() => this.minuteSelected(minute)}
                  selected={minute == this.props.time.minute()}
                >{pad(minute, 2)}</TimeOption>
              ))}
            </Scroll>

            <Close onClick={() => this.setState({open: false})}>X</Close>
          </TouchInput>
        }
      </Wrapper>
    )
  }

  focused() {
    this.setState({ open: true })

    if(this.props.time == null)
      this.props.onChange(moment())
  }

  enter(event) {
    event.target.blur()
    this.setState({ open: false})
  }

  hourSelected(hour) {
    this.props.onChange(this.props.time.hour(hour))
  }

  minuteSelected(minute) {
    this.props.onChange(this.props.time.minute(minute))
    this.setState({open: false})
  }
}

function pad(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

const TimeInput = styled.input`
  padding: 0.5rem;
`

const Wrapper = styled.div`
  display: inline-block;
`

const TouchInput = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: white;
  height: 15rem;
  position: fixed;
  width: 10rem;
`

const Scroll = styled.div`
  border: 1px solid grey;
  overflow-y: scroll;
`

const TimeOption = styled.div`
  padding: 0.5rem;
  ${({selected}) => selected && `background-color: ${blue}; color: white;`}
`

const Close = styled.div`
  background-color: green;
  color: white;
  grid-column: 1 / -1;
  padding: 0.5rem;
  text-align: center;
`

export default Timepicker
