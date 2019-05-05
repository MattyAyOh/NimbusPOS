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
        onResize={(e) => {
          debugger;
        }}
      >
        <ResizeHandle position="nw" positions={["-5px", null, "-5px", null]} />
        <ResizeHandle position="ne" positions={["-5px", null, null, "-5px"]} />
        <ResizeHandle position="sw" positions={[null, "-5px", "-5px", null]} />
        <ResizeHandle position="se" positions={[null, "-5px", null, "-5px"]} />

        <ResizeHandle position="n"  positions={["-5px", null, "calc(50% - 5px)", null]} />
        <ResizeHandle position="w"  positions={["calc(50% - 5px)", null, "-5px", null]} />
        <ResizeHandle position="e"  positions={["calc(50% - 5px)", null, null, "-5px"]} />
        <ResizeHandle position="s"  positions={[null, "-5px", "calc(50% - 5px)", null]} />

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
  onMouseDown: ({position}) => ((e) => {
    let handle = e.target

    let shiftX = e.clientX - handle.getBoundingClientRect().left;
    let shiftY = e.clientY - handle.getBoundingClientRect().top;

    handle.style.position = 'absolute';
    handle.style.zIndex = 1000;

    document.body.append(handle)
    moveTo(e.pageX, e.pageY)

    // centers the handle to (x, y) coordinates
    function moveTo(x, y) {
      handle.style.left = x - shiftX + 'px';
      handle.style.top = y - shiftY + 'px';
    }

    function onMouseMove(event) {
      moveTo(event.pageX, event.pageY);
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

export default Component
