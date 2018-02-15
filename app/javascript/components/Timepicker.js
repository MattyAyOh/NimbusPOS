import React from "react"
import styled from "styled-components"
import moment from "moment"

/*
 * Props:
 * `time`: a `moment` object
 * `onChange`: a callback function that takes a `moment` object.
 */
class Timepicker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
    }
  }

  render() {
    return (
      <Wrapper
      >
        <TimeInput
          type="time"
          value={this.props.time ? this.props.time.format("HH:mm") : ""}
          onChange={(event) => this.props.onChange(moment(event.target.value, "HH:mm"))}
          onFocus={() => this.setState({ open: true })}
          onKeyPress={(e) => e.key === "Enter" && this.enter(e)}
        />
      </Wrapper>
    )
  }

  enter(event) {
    event.target.blur()
    this.setState({ open: false})
  }
}

const TimeInput = styled.input`
  padding: 0.5rem;
`

const Wrapper = styled.div`
  display: inline-block;
`

export default Timepicker
