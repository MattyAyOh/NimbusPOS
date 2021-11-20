import React from "react"
import styled from "styled-components"
import { primary as blue } from "colors"
import { observer, Observer } from "mobx-react"

class TabView extends React.Component {
  render() {
    return (
      <div>
        <TabSelector tabCount={Object.keys(this.props.tabs).length}>
          { Object.keys(this.props.tabs).map((tab) => (
            <Tab
              key={tab}
              onClick={() => this.props.assembly.model.set_visible_tab(tab)}
              selected={this.props.assembly.model.visible_tab === tab}
            >
              {tab}
            </Tab>
          ))}
        </TabSelector>

        <Observer>
          {this.visible_tab}
        </Observer>
      </div>
    )
  }

  get visible_tab() {
    let tab_name =
      this.props.assembly.visible_tab ||
      Object.keys(this.props.tabs)[0]

    return this.props.tabs[tab_name]
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

export default observer(TabView)
