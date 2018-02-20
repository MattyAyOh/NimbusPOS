import React from "react"
import styled from "styled-components"

const blue = "#4a90e2"

// TODO use routing
class TabView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: Object.keys(this.props.tabs)[0],
    }
  }

  render() {
    return (
      <div>
        <TabSelector tabCount={Object.keys(this.props.tabs).length}>
          { Object.keys(this.props.tabs).map((tab) => (
            <Tab
              role="link"
              key={tab}
              onClick={() => this.setState({activeTab: tab})}
              selected={this.state.activeTab == tab}
            >
              {tab}
            </Tab>
          ))}
        </TabSelector>

        {React.createElement(this.props.tabs[this.state.activeTab])}
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
