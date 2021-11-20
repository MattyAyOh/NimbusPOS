import React from "react"
import styled from "styled-components"
import { DateTime } from "luxon"
import { observer } from "mobx-react"
import { action, computed, observable } from "mobx"

const blue = "#4a90e2"

const scrollNodeIntoView = (boolean) => (node) =>
  node && boolean && node.scrollIntoView()

/*
 * Props:
 * `value`: a `DateTime` object
 * `onChange`: a callback function that takes a `DateTime` object.
 * `hourOptions`: a list of allowed values for the hour
 * `minuteOptions`: a list of allowed values for the minute
 */
class Timepicker extends React.Component {
  open = observable.box(false)

  hourOptions() {
    return this.props.hourOptions ||
      Array.apply(null, {length: 24}).map(Number.call, Number)
  }

  minuteOptions() {
    return this.props.minuteOptions ||
      Array.apply(null, {length: 60}).map(Number.call, Number)
  }

  get time() {
    return this.props.value || DateTime.local()
  }

  get displayText() {
    return this.props.value
      ? this.props.value.toLocaleString(DateTime.TIME_24_SIMPLE)
      : "--:--"
  }

  render() {
    let selectedHour = this.time.hour
    let selectedMinute = this.time.minute

    return (
      <Wrapper>
        <TimeInput onClick={() => this.toggleOpen()} >
          {this.displayText}
          { this.open.get() && <Right>X</Right> }
        </TimeInput>

        { this.open.get() &&
          <TouchInput>
            <Scroll>
              {this.hourOptions().map((hour) => (
                <TimeOption
                  innerRef={scrollNodeIntoView(hour === selectedHour)}
                  key={hour}
                  onClick={() => this.timeChanged({ hour }) }
                  selected={hour === selectedHour}
                >{pad(hour, 2)}</TimeOption>
              ))}
            </Scroll>

            <Scroll>
              {this.minuteOptions().map((minute) => (
                <TimeOption
                  innerRef={scrollNodeIntoView(minute === selectedMinute)}
                  key={minute}
                  onClick={() => this.timeChanged({ minute }) }
                  selected={minute === selectedMinute}
                >{pad(minute, 2)}</TimeOption>
              ))}
            </Scroll>
          </TouchInput>
        }
      </Wrapper>
    )
  }

  timeChanged(timeComponents) {
    this.props.onChange(this.time.set(timeComponents))
  }

  toggleOpen() {
    this.open.set(!this.open.get())
  }
}

function pad(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

const TimeInput = styled.span`
  display: inline-block;
  padding: 0.5rem;
  width: 4rem;
  border: 1px solid #aaaaaa;
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

const Right = styled.span`
  float: right;
`

const TimeOption = styled.div`
  padding: 0.5rem;
  ${({selected}) => selected && `background-color: ${blue}; color: white;`}
`

export default observer(Timepicker)
