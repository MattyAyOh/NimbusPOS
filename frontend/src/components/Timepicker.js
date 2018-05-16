import React from "react"
import styled from "styled-components"
import moment from "moment"

const blue = "#4a90e2"

/*
 * Props:
 * `initialValue`: a `moment` object
 * `onChange`: a callback function that takes a `moment` object.
 * `hourOptions`: a list of allowed values for the hour
 * `minuteOptions`: a list of allowed values for the minute
 */
class Timepicker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      time: this.props.initialValue,
      enteredText: this.props.initialValue ? this.props.initialValue.format("HH:mm") : "",
      open: false,
    }
  }

  hourOptions() {
    return this.props.hourOptions ||
      Array.apply(null, {length: 24}).map(Number.call, Number)
  }

  minuteOptions() {
    return this.props.minuteOptions ||
      Array.apply(null, {length: 60}).map(Number.call, Number)
  }

  render() {
    let selectedHour = this.state.time && this.state.time.hour()
    let selectedMinute = this.state.time && this.state.time.minute()

    return (
      <Wrapper>
        <TimeInput
          onChange={(e) => this.setState({ enteredText: e.target.value })}
          onFocus={(e) => this.focused(e)}
          onKeyPress={(e) => e.key === "Enter" && this.enter(e)}
          placeholder="--:--"
          value={this.state.enteredText}
        />

        { this.state.open &&
          <TouchInput>
            <Scroll>
              {this.hourOptions().map((hour) => (
                <TimeOption
                  innerRef={(node) => node && (hour == selectedHour) && node.scrollIntoView()}
                  key={hour}
                  onClick={() => this.hourSelected(hour)}
                  selected={hour == selectedHour}
                >{pad(hour, 2)}</TimeOption>
              ))}
            </Scroll>

            <Scroll>
              {this.minuteOptions().map((minute) => (
                <TimeOption
                  innerRef={(node) => node && (minute == selectedMinute) && node.scrollIntoView()}
                  key={minute}
                  onClick={() => this.minuteSelected(minute)}
                  selected={minute == selectedMinute}
                >{pad(minute, 2)}</TimeOption>
              ))}
            </Scroll>
          </TouchInput>
        }
      </Wrapper>
    )
  }

  focused(event) {
    event.target.select()

    this.setState({
      open: true,
      time: this.state.time || moment(),
    })
  }

  enter(event) {
    event.target.blur()
    this.timeChanged(moment(event.target.value, "HH:mm"))
  }

  hourSelected(hour) {
    let minute = this.state.time.minute()
    let newTime = moment(`${hour}:${minute}`, "HH:mm")
    this.setState({ time: newTime, enteredText: newTime.format("HH:mm") })
  }

  minuteSelected(minute) {
    let hour = this.state.time.hour()
    let newTime = moment(`${hour}:${minute}`, "HH:mm")
    this.timeChanged(newTime)
  }

  timeChanged(newTime) {
    this.props.onChange(newTime)

    this.setState({
      enteredText: newTime.format("HH:mm"),
      open: false,
      time: newTime,
    })
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
  background-color: white;
  color: black;
  display: grid;
  grid-template-columns: 1fr 1fr;
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

export default Timepicker
