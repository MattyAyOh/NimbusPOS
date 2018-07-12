import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Store from "./Store"

window.store = new Store()

window.store.addReservation({
  start_time: "2017-05-20 10pm",
  end_time: "2017-05-20 12pm",
  service: "pool",
  room: 4,
})

window.store.addReservation({
  start_time: "2017-05-20 12pm",
  end_time: "2017-05-21 4am",
  service: "karaoke",
  room: 1,
})

ReactDOM.render(<App store={window.store} />, document.getElementById('root'));
registerServiceWorker();
