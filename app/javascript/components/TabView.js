import React from "react"
import styled from "styled-components"

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
        <TabSelector>
          { Object.keys(this.props.tabs).map((tab) => (
            <span
              key={tab}
              onClick={() => this.setState({activeTab: tab})}
            >
              {tab}
            </span>
          ))}
        </TabSelector>

        {React.createElement(this.props.tabs[this.state.activeTab])}
      </div>
    )
  }
}

const TabSelector = styled.div`
  overflow: hidden;
`

export default TabView;
