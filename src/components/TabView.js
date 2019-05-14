import React from "react"
import styled from "styled-components"
import { Switch, Route, Link } from "react-router-dom"
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
              key={tab}
              to={this.props.url + "/" + tab}
              selected={window.location.pathname === this.props.url + "/" + tab}
            >
              {tab}
            </Tab>
          ))}
        </TabSelector>

        <Switch>
          { Object.keys(this.props.tabs).map((tab) => (
            <Route
              key={tab}
              path={this.props.url + "/" + tab}
              component={this.props.tabs[tab]}
            />
          ))}
        </Switch>
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

const Tab = styled(Link)`
  text-align: right;
  text-transform: capitalize;
  color: ${(p) => p.selected ? blue : "inherit"};
  text-decoration: underline;
`

export default TabView;
