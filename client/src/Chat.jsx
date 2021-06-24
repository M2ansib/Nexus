import React from 'react'
import CancelIcon from '@material-ui/icons/Cancel'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid';
import { Link } from "react-router-dom"
import { motion } from 'framer-motion';

export default function Chat() {

    const variants = {
        initial: { opacity: 0, y: "-100vh" },
        open: { opacity: [0, 1, 1], y: ["-100vh", "0vh", "0vh"] },
        closed: { opacity: [1, 1, 0], y: ["0vh", "-100vh", "-100vh"] },
    }
    return (
        <motion.div
            initial="initial"
            animate="open"
            exit="closed"
            variants={variants}
        >
            <Grid container alignItems="center" justify="center" style={{ backgroundColor: "darkseagreen", height: "100vh" }}>
                <div>chat ui</div>
                <IconButton aria-label="close" color="inherit" component={Link} to="/dash">
                    <CancelIcon />
                </IconButton>
            </Grid>
        </motion.div>
    )
}