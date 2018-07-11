import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Store from "./Store"

window.store = new Store()

ReactDOM.render(<App store={window.store} />, document.getElementById('root'));
registerServiceWorker();
