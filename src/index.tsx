import React from 'react';
import './index.css';
import './override-module.d.ts';
import reportWebVitals from './reportWebVitals';
import {SplashScreen} from "./SplashScreen";
import { createRoot } from 'react-dom/client';
import {initializeGoogleTagManager} from "./util/configurations/configurationGoogleTagManager";

import('react-ga4').then(({ default: ReactGA }) => {
    ReactGA.initialize(window.ID_GOOGLE_ANALYTICS);
});


window.addEventListener('load', () => {
    import('./util/helpers/pdfFontsHelper').then(({ PDFFontsHelper }) => {
      PDFFontsHelper.register();
    });
  });


document.addEventListener('DOMContentLoaded', () => {
    const gtmId = window.ID_GOOGLE_TAG_MANAGER;
    if (window.IS_PRODUCTION_ENV)
        initializeGoogleTagManager(gtmId);

    const container = document.getElementById('root');
    const root = createRoot(container!);
    root.render(<SplashScreen />);
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
