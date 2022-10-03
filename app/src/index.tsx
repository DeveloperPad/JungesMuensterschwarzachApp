import 'moment/locale/de';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as log from 'loglevel';

import { StyledEngineProvider, ThemeProvider } from '@mui/material';

import AdapterMoment from '@mui/lab/AdapterMoment';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { DeprecationService } from './js/services/DeprecationService';
import Formats from './js/constants/formats';
import { LocalizationProvider } from '@mui/lab';
import { ServiceWorkerRegistrationService } from './js/services/ServiceWorkerRegistrationService';
import getTheme from './js/constants/theme';
import moment from 'moment';

if (process.env.NODE_ENV === "production") {
  log.setLevel(log.levels.DEBUG);
} else {
  log.enableAll();
}

moment.locale(Formats.DATE.LOCALE);

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={getTheme()}>
      <LocalizationProvider dataAdapter={AdapterMoment} locale={Formats.DATE.LOCALE}>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <App />
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  </StyledEngineProvider>,
  document.getElementById("root") as HTMLElement
);

DeprecationService.run();
ServiceWorkerRegistrationService.register();