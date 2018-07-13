import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"

import ReactTable from "react-table";
import "react-table/react-table.css";

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
        />
        <br />
      </div>
    );
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
