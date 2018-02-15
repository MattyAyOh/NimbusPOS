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
      <input
        type="time"
        value={this.props.time.format("HH:mm")}
        onChange={(time) => this.props.onChange(moment(time))}
      />
    )
  }
}

export default Timepicker
