import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18 and later
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './redux/rootReducer'; // Adjust this path according to your folder structure
import App from './App'; // Ensure this points to your App component

// Create a Redux store
const store = createStore(rootReducer); // If you have middleware, use applyMiddleware

// Render the App component inside the Redux Provider
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
