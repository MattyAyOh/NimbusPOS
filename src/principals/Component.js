import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"
import { autorun, reaction, observable } from "mobx"

@observer
class Component extends React.Component {
  @observable styles = {
    height: "2rem",
    width: "2rem",
  }

  constructor(props) {
    super(props)

    this.boundary = React.createRef()

    this.props.assembly.network.watch`
      JSON.parse(Component.find_or_create_by(id: "${this.props.uuid}").style)
    `(response => {
      response
        .json()
        .then(style => {
        this.styles = style
        })
    })

    reaction(
      () => JSON.stringify(this.styles),
      (styles) => this.props.assembly.network.run`
        Component.find_or_create_by(id: "${this.props.uuid}").update(style: '${styles}')
      `
    )
  }

  render() {
    return (
      <Boundary
        style={JSON.parse(JSON.stringify(this.styles))}
        onClick={() => this.props.assembly.activeComponent = this}
        innerRef={this.boundary}
      >
        <ResizeHandle position="nw" component={this} positions={["-5px", null, "-5px", null]} />
        <ResizeHandle position="ne" component={this} positions={["-5px", null, null, "-5px"]} />
        <ResizeHandle position="sw" component={this} positions={[null, "-5px", "-5px", null]} />
        <ResizeHandle position="se" component={this} positions={[null, "-5px", null, "-5px"]} />

        <ResizeHandle position="n"  component={this} positions={["-5px", null, "calc(50% - 5px)", null]} />
        <ResizeHandle position="w"  component={this} positions={["calc(50% - 5px)", null, "-5px", null]} />
        <ResizeHandle position="e"  component={this} positions={["calc(50% - 5px)", null, null, "-5px"]} />
        <ResizeHandle position="s"  component={this} positions={[null, "-5px", "calc(50% - 5px)", null]} />

        {this.props.children}
      </Boundary>
    )
  }
}

const Boundary = styled.div`
  border: 1px dashed #4a90e2;
  resize: both;
  overflow: visible;
  position: relative;
`

const ResizeHandle = styled.div.attrs({
  onMouseDown: ({position, component}) => ((e) => {
    let handle = e.target

    let { width, height } =
      component.boundary.current.getBoundingClientRect()

    let containerPosition = calculateContainerPosition(component.props.container)

    handle.style.position = 'absolute';
    handle.style.zIndex = 1000;

    let startingPosition = {
      left: handle.getBoundingClientRect().left + handle.getBoundingClientRect().width / 2 - 1,
      top: handle.getBoundingClientRect().top  + handle.getBoundingClientRect().height / 2 - 1,
    }
    console.log(startingPosition)

    let offset = {
      left: startingPosition.left - e.pageX,
      top: startingPosition.top - e.pageY,
    }
    console.log(offset)

    moveTo(e.pageX + offset.left, e.pageY + offset.top)

    // centers the handle to (x, y) coordinates
    function moveTo(x, y) {
      if(position.indexOf('n') !== -1) {
        let shift = y - containerPosition.top
        component.styles.top = shift + 'px'
        component.styles.height = height - shift - 2 + 'px'
      }
      if(position.indexOf('w') !== -1) {
        let shift = x - containerPosition.left
        component.styles.left = shift + 'px'
        component.styles.width = width - shift - 2 + 'px'
      }
      if(position.indexOf('s') !== -1) {
        component.styles.height = y - containerPosition.top + 'px'
      }
      if(position.indexOf('e') !== -1) {
        component.styles.width = x - containerPosition.left + 'px'
      }
    }

    function onMouseMove(event) {
      moveTo(event.pageX + offset.left, event.pageY + offset.top)
    }

    // (3) move the handle on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // (4) drop the handle, remove unneeded handlers
    document.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      document.onmouseup = null;
    };
  }),

  onDragStart: () => () => (false),
})`
  border-radius: 50%;
  border: 1px solid blue;
  cursor: ${({position}) => `${position}-resize`};
  height: 8px;
  position: absolute;
  width: 8px;

  top: ${({positions}) => positions[0]};
  bottom: ${({positions}) => positions[1]};
  left: ${({positions}) => positions[2]};
  right: ${({positions}) => positions[3]};
`

const calculateContainerPosition = (container) => {
  if(!container || !container.current) {
    return { left: 0, top: 0 }
  } else {
    let left = (parseInt(getComputedStyle(container.current.props.innerRef.current).paddingLeft, 10) || 0) + container.current.props.innerRef.current.getBoundingClientRect().left
    let top =  (parseInt(getComputedStyle(container.current.props.innerRef.current).paddingTop, 10) || 0) + container.current.props.innerRef.current.getBoundingClientRect().top

    return { left, top }
  }
}

export default Component
