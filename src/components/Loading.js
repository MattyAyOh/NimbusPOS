import React from "react"

import { observer } from "mobx-react"

@observer
class Loading extends React.Component {
  layout = React.createRef()

  render = () => (
    <div container={this.props.container} ref={this.layout} innerRef={React.createRef()} >
      Loading...
    </div>
  )
}

export default Loading
