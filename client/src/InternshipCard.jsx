import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Link } from 'react-router-dom'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Button, ButtonGroup } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import moment, { calendarFormat } from 'moment';
import { motion } from "framer-motion"

const useStyles = makeStyles((theme) => ({
    root: {
        // minWidth: 200,
        width: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
    modal: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    }
}));

export default function InternshipCard(props) {
    const classes = useStyles()
    const { position, company, imageLink, applyLink, learnMoreLink, jobDescription } = props
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const transition = { duration: 0.5, ease: "easeInOut" };
    const postPreviewVariants = {
        initial: { x: "100%", opacity: 0 },
        enter: { x: 0, opacity: 1, transition },
        exit: { x: "-100%", opacity: 0, transition }
    };

    return (
        <>
            <motion.div variants={postPreviewVariants}>
                <Card className={classes.root} elevation={5}>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="recipe" className={classes.avatar} src={imageLink}>
                            </Avatar>
                        }
                        title={company}
                    />
                    <CardContent>
                        <Typography variant="h6" color="textSecondary" component="p">
                            {position}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {jobDescription}
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded,
                            })}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </CardActions>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <ButtonGroup fullWidth='true' orientation="vertical" display="flex" justifyContent="center" alignItems="center" size="large" color="primary" aria-label="large outlined primary button group">
                                <Button href={learnMoreLink}>Learn More</Button>
                                <Button href={applyLink}>Apply</Button>
                            </ButtonGroup>
                        </CardContent>
                    </Collapse>
                </Card>
            </motion.div>
        </>
    );
}
