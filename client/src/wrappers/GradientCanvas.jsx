import React, { useState, useEffect } from 'react';

// import "./../Login.css";

import { motion } from 'framer-motion';
import {useLocation} from 'react-router-dom';

export default function LandingPageComponent(props) {
    const loc = useLocation();
    if (props.includes)
        if (!props.includes.includes(loc.pathname)) return null;

    useEffect(() => {
        var gradient = new Gradient();
        gradient.initGradient("#gradient-canvas");
    }, []);

    return (
        // <motion.div
        // initial={{ scaleY: 0, scaleX: 0 }}
        // animate={{ scaleY: 1, scaleX: 1 }}
        // exit={{ scaleY: 0, scaleX: 0 }}
        // transition={{ duration: 0.5 }}
        // >
            <canvas id="gradient-canvas" data-js-darken-top data-transition-in style={{"width":"100%", height:"100%", position:"fixed"}}>
            {/* <!--
                Remove data-js-darken-top to keep the same brightness in the upper part of the canvas
            --> */}
            </canvas>
        // </motion.div>
    );
}