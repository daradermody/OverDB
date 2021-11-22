import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles'

const root = document.createElement('div');
document.body.appendChild(root);
document.body.style.fontFamily = 'Roboto';
document.body.style.margin = '0';

render((
  <ThemeProvider theme={createMuiTheme({ palette: { type: 'dark' } })}>
    <App/>
  </ThemeProvider>
), root);
