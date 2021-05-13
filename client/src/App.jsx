import React, {useEffect, useState} from 'react';

import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import TopBar from './TopBar';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import './index.css';
import cyan from '@material-ui/core/colors/cyan';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';

import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group";

import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  Redirect,
  useLocation,
  useParams
} from "react-router-dom";

import useDimensions from "react-cool-dimensions";
import ResizeObserver from "@juggle/resize-observer";
import OverlayScrollbars from 'overlayscrollbars';
import 'pace-js'
import 'pace-js/themes/blue/pace-theme-minimal.css'
import Login from './views/Login';
import Card from './Card';

OverlayScrollbars(document.body, {
  nativeScrollbarsOverlaid: {
      initialize: true
  },
  scrollbars: {
    autoHide: "move",
  }
});

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {main: '#2196f3',},
    secondary: {main: '#2196f3',},
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
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('/api/time').then(res => res.json()).then(data => {
        setCurrentTime(data.time);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            {/* <TopBar/>
            <div style={{"paddingBottom":"2.5em",}}></div> */}
            <Login/>
          </Route>
          <Route exact path="/dash">
            <TopBar/>
            <Box mx="2rem" py="2rem">
                <p>{currentTime}</p>
                <Card/>
            </Box>
          </Route>
          {/* <Route exact path="/login" component={Login} /> */}
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.render(<Base />, document.getElementById('root'));