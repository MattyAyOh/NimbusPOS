import React from "react"
import styled from "styled-components"
import { primary as blue } from "colors"
import { observer, Observer } from "mobx-react"

@observer
class TabView extends React.Component {
  render() {
    return (
      <div>
        <TabSelector tabCount={Object.keys(this.props.tabs).length}>
          { Object.keys(this.props.tabs).map((tab) => (
            <Tab
              key={tab}
              onClick={() => this.props.assembly.right_half = this.props.assembly.right_half.split("/").splice(0, 4).concat(tab).join("/")}
              selected={window.location.pathname === this.props.assembly.right_half + "/" + tab}
            >
              {tab}
            </Tab>
          ))}
        </TabSelector>

        <Observer>
          {this.props.tabs[this.props.assembly.right_half.split("/")[4]]}
        </Observer>
      </div>
    )
  }
}

const TabSelector = styled.div`
  display: grid;
  grid-column-gap: 2rem;
  grid-template-columns: repeat(${p => p.tabCount - 1}, auto) 1fr;
  height: 4rem;
  overflow: hidden;
  font-size: 1.2rem;
`

const Tab = styled.span`
  text-align: right;
  text-transform: capitalize;
  color: ${(p) => p.selected ? blue : "inherit"};
  text-decoration: underline;
`

export default TabView;
