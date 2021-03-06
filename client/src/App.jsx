import React, { useEffect, useState } from 'react';
import $ from 'jquery';

import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import TopBar from './TopBar';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import './index.css';
import cyan from '@material-ui/core/colors/cyan';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Calendar, isPropsEqual } from '@fullcalendar/core';
import Box from '@material-ui/core/Box';

import { SnackbarProvider } from 'notistack';

import {
    TransitionGroup,
    CSSTransition,
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
import Register from './views/Register';
import Dashboard from './Dashboard';
import Profile from './Profile'
import Chat from './Chat'
import MatchRequestForm from './MatchRequestForm'
// import {App} from '../../asc-chat/src/main/App'
import Internships from './Internships'
import Pairings from './Pairings'
import Toolbar from './wrappers/Toolbar';

// import PubNub from "pubnub";
// import { PubNubProvider } from "pubnub-react";
// import pubnubKeys from "./chat/pubnub-keys.json";
import { motion, AnimatePresence } from "framer-motion"
import GradientCanvas from './wrappers/GradientCanvas';
import Interceptor from './Interceptor';

import Collapse from '@material-ui/core/Collapse';

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
        type: "light",
        primary: { main: '#2196f3', },
        secondary: { main: '#2196f3', contrastText: '#fff', },
        default: { main: "lightgreen" },
        error: { main: "#f08080" }
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

// const pubnub = new PubNub({
//     ...pubnubKeys,
//     uuid: "user_63ea15931d8541a3bd35e5b1f09087dc",
//     suppressLeaveEvents: true
// });

function ConditionalRedirect(props) {
    return (
        props.condition ?

        props.children:
        <Redirect to={props.to}/>
    )
}

function Base() {

    const { observe, width, height } = useDimensions({
        useBorderBoxSize: true, // Tell the hook to measure based on the border-box size, default is false
        polyfill: ResizeObserver, // Use polyfill to make this feature works on more browsers
    });
    const [cal, setCal] = useState()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const variants = {
        open: { opacity: 1, scale: [0.7, 2, 1, 1] },
        closed: { opacity: 0, scale: [2, 1, 0, 0] },
    }

    const fetch_isLoggedIn = () => {
        fetch("/api/logged_in")
            .then(res => res.json())
            .then(res => {
                console.log(res)
                setIsLoggedIn(res.result)
            },
                error => {
                    console.log(error)
                })
        return isLoggedIn
    }

    fetch_isLoggedIn();

    // useEffect(() => {
    //     fetch_isLoggedIn();
    // }, [])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                TransitionComponent={Collapse}
                maxSnack={3}
                preventDuplicate
                autoHideDuration={3000}
                
            >
                <Interceptor />
                <AnimatePresence exitBeforeEnter initial={false}>
                    <BrowserRouter>
                        <GradientCanvas includes={['/', '/register', '/mentor_register', '/mentee_register', '/match_request']} />
                        <TopBar excludes={['/', '/chat', '/register', '/mentor_register', '/mentee_register', '/match_request']} />
                        <Toolbar excludes={['/', '/chat', '/register', '/mentor_register', '/mentee_register', '/match_request']} />
                        <Switch location={location} key={location.pathname}>
                            <Route exact path="/">
                                {!isLoggedIn ? <Login /> : <Redirect to='/dash' />}
                            </Route>
                            <Route exact path="/register">
                                {!isLoggedIn ? <Register /> : <Redirect to='/dash' />}
                            </Route>
                            {/* <span>`Test: ${fetch("/api/testing", {method:'POST', body:JSON.stringify({loggedIn: isLoggedIn})})}`</span> */}
                            <ConditionalRedirect condition={isLoggedIn} to="/">
                                <Route exact path="/match_request">
                                    <MatchRequestForm />
                                </Route>
                                <Route exact path="/dash">
                                    <Dashboard setCal={setCal} />
                                </Route>
                                <Route exact path="/groupings">
                                    <Pairings cal={cal} />
                                </Route>
                                <Route exact path="/profile">
                                    <Profile />
                                </Route>
                                <Route exact path="/chat">
                                    <Chat />
                                </Route>
                            </ConditionalRedirect>
                            {/* <Route exact path="/internships">
                                    <Internships />
                                </Route> */}

                                {/* <Route exact path="/login" component={Login} /> */}
                        </Switch>
                    </BrowserRouter>
                </AnimatePresence>
            </SnackbarProvider>
        </ThemeProvider >
    );
}

ReactDOM.render(<Base />, document.getElementById('root'));
