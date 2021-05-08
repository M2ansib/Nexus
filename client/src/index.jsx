import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import App from './App';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import './index.css';
import cyan from '@material-ui/core/colors/cyan';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import useDimensions from "react-cool-dimensions";
import { ResizeObserver } from "@juggle/resize-observer";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {main: '#c62828',},
    secondary: {main: '#c62828',},
  },
  typography: {
    fontFamily: [
      'Quicksand',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  
});

function Base() {
  const { observe, width, height } = useDimensions({
    useBorderBoxSize: true, // Tell the hook to measure based on the border-box size, default is false
    polyfill: ResizeObserver, // Use polyfill to make this feature works on more browsers
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

ReactDOM.render(<Base />, document.getElementById('root'));