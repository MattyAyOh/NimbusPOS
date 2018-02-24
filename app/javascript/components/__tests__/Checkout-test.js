import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import React from "react";
import renderer from 'react-test-renderer';

import Checkout from "../Checkout";

Enzyme.configure({ adapter: new Adapter() });

// Snapshot test - https://facebook.github.io/jest/docs/en/snapshot-testing.html
test("Displays correctly", () => {
  const tree = renderer.create(<Checkout {...default_props} />).toJSON();
  expect(tree).toMatchSnapshot();
})

test("Confirm button is disabled until 'Cash Handled' is inputted", () => {
  const checkout = Enzyme.shallow(<Checkout {...default_props} />);
});

const default_props = {
  onMount: () => {},
  order: {
    extras: [],
    cash_handled: null,
    end_time: "2018-02-24T21:00:00.000Z",
    start_time: "2018-02-24T20:00:00.000Z",
  },
  service: {
    hourly_rate: 20,
    name: "Mahjong",
    position: 1,
    service: "mahjong",
  },
  extras: [],
}
