import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"

import Spreadsheet from "./Spreadsheet"
import Logo from "./Logo"
import TabView from "./components/TabView"

@observer
class Visor extends React.Component {
  render() {
    let tabs = {}

    this.props.store.dataModels.forEach((model) =>
      tabs[model.name] = () =>
        <Spreadsheet store={this.props.store} model={model} />
    )

    return (
      <Layout>
        <Button onClick={() => this.props.store.toggleVisor()}>
          <Logo continuous />
        </Button>

        { this.props.store.visor &&
          <Background>
            <TabView
              store={this.props.store}
              tabs={tabs}
            />
          </Background>
        }
      </Layout>
    )
  }
}

const Layout = styled.div`
  position: fixed;
  top: 20px;
  left:20px;
`

const Background = styled.div`
  width: 90vw;
  padding: 1rem;
  height: auto;
  background-color: white;
  box-shadow: 0 3px 8px rgba(50, 50, 50, 0.17);
`

const Button = styled.div`
`

export default Visor
