import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './global.css';
import { BrowserRouter } from 'react-router-dom';
import { Auth0ProviderWithNavigate } from './Auth/Auth0ProviderWithNavigate';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <App />
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>
);
