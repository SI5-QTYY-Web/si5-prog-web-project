import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

import RouterUtils from './app/context/RouterUtils';
import { ThemeContextProvider } from './app/context/ThemeContext';


ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <RouterUtils>
        <ThemeContextProvider>
          <App />
        </ThemeContextProvider>
      </RouterUtils>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);
