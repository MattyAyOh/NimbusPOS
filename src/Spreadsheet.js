import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"

import ReactTable from "react-table";
import "react-table/react-table.css";

import Table from "./components/Table";
import Extra from "./components/Extra";
import moment from "moment"

@observer
class Spreadsheet extends React.Component {
  render() {
    const data = this.props.store[this.props.model.name.toLowerCase() + "s"];

    return (
      <div>
        <ReactTable
          data={data}
          columns={[{ Header: this.props.model.name, columns: this.columns() }]}
          defaultPageSize={10}
          className="-striped -highlight"
          SubComponent={item => React.createElement(this.subComponent(item))}
        />
      </div>
    );
  }

  subComponent(item) {
    return {
      "Service": () => <Table
        store={this.props.store}
        current_time={moment()}
        service={item.original}
      />,
      // "Extra": () => <Extra
      //   store={this.props.store}
      //   extra={item.original}
      // />,
    }[this.props.model.name] || (() => <div/>)
  }

  // TODO the data models should be aware of their own columns
  columns() {
    return {
      "Order": [
        { Header: "Cash Handled", accessor: "cash_handled" },
        { Header: "Start Time", accessor: "start_time" },
        { Header: "End Time", accessor: "end_time" },
      ],
      "Extra": [
        { Header: "Name", accessor: "name" },
        { Header: "Price", accessor: "price" },
        { Header: "Type", accessor: "extra_type" },
        { Header: "Image URL", accessor: "image_url" },
      ],
      "Service": [
        { Header: "Hourly Rate", accessor: "hourly_rate" },
        { Header: "Name", accessor: "name" },
        { Header: "Position", accessor: "position" },
        { Header: "Service", accessor: "service" },
        { Header: "Current Order", accessor: "current_order" },
        {
          expander: true,
          Header: () => <strong>More</strong>,
          width: 65,
          Expander: ({ isExpanded, ...rest }) =>
          <div>
          {isExpanded
            ? <span>&#x2299;</span>
            : <span>&#x2295;</span>}
          </div>,
          style: {
            cursor: "pointer",
            fontSize: 25,
            padding: "0",
            textAlign: "center",
            userSelect: "none"
          },
        },
      ],
      "LineItem": [
        { Header: "Name", accessor: "name" },
        { Header: "Price", accessor: "price" },
        { Header: "Quantity", accessor: "quantity" },
      ],
      "Reservation": [
        { Header: "Start Time", accessor: "start_time" },
        { Header: "End Time", accessor: "end_time" },
        { Header: "Service", accessor: "service" },
        { Header: "Room", accessor: "room" },
      ]
    }[this.props.model.name]
  }
}

export default Spreadsheet
