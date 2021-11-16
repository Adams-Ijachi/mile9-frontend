import { StrictMode } from 'react';
import { render } from 'react-dom';
import { RecoilRoot } from 'recoil';
import { ToastContainer } from 'react-toastify';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import reportWebVitals from './reportWebVitals';
import DebugObserver from './DebugObserver';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

render(
  <StrictMode>
    <RecoilRoot>
      <DebugObserver />
      <ErrorBoundary>
        <ToastContainer
          position={'top-right'}
          autoClose={4000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={true}
          pauseOnHover={true}
          draggable={true}
          theme={'light'}
        />
        <App />
      </ErrorBoundary>
    </RecoilRoot>
  </StrictMode>,
  document.getElementById('root')
);

// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
