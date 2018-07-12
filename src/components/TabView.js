import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"

const blue = "#4a90e2"

@observer
class TabView extends React.Component {
  render() {
    return (
      <div>
        <TabSelector tabCount={Object.keys(this.props.tabs).length}>
          { Object.keys(this.props.tabs).map((tab) => (
            <Tab
              store={this.props.store}
              key={tab}
              onClick={() => this.props.store.showTab(tab)}
              selected={this.props.store.currentView.get("tab") === tab}
            >
              {tab}
            </Tab>
          ))}
        </TabSelector>

        { React.createElement(this.props.tabs[this.props.store.currentView.get("tab")]) }
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
