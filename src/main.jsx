// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './redux/store';
import './index.css';

// // Initialize the mock service worker
// async function initMockServiceWorker() {
//   if (import.meta.env.DEV) {
//     const { worker } = await import('./mocks/browser');
//     return worker.start({
//       onUnhandledRequest: 'bypass',
//     });
//   }
//   return Promise.resolve();
// }

// Start the MSW and then render the app
// initMockServiceWorker().then(() => {
//   ReactDOM.createRoot(document.getElementById('root')).render(
//     <React.StrictMode>
//       <Provider store={store}>
//         <BrowserRouter>
//           <App />
//         </BrowserRouter>
//       </Provider>
//     </React.StrictMode>
//   );
// });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);