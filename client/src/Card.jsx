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
import FormHelperText from '@material-ui/core/FormHelperText';

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

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

export default function PairingCard(props) {
    const classes = useStyles()
    const { name, initials, preferences, remarks, email, cal, index, setPairings } = props
    const [expanded, setExpanded] = React.useState(false);
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = useState(false)
    const [unpairOpen, setUnpairOpen] = useState(false)
    const [reportOpen, setReportOpen] = useState(false)

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const createEvent = (e) => {
        e.preventDefault()
        // let formData = new FormData()
        // formData.append("name", document.getElementById("summaryRef").value)
        // formData.append("begin", moment.utc(new Date(document.getElementById("startTime").value)).format("YYYY-MM-DD hh:mm:ss"))
        // formData.append("end", moment.utc(new Date(document.getElementById("endTime").value)).format("YYYY-MM-DD hh:mm:ss"))
        // formData.append("attendees", "ria.mundhra.2019@vjc.sg,test")

        fetch("/api/write_to_cal", {
            method: "POST",
            // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'name': document.getElementById("summaryRef").value,
                'begin': moment.utc(new Date(document.getElementById("startTime").value)).format("YYYY-MM-DD hh:mm:ss"),
                'end': moment.utc(new Date(document.getElementById("endTime").value)).format("YYYY-MM-DD hh:mm:ss"),
                'attendees': "ria.mundhra.2019@vjc.sg,test"
            })
        }).then(res => {
            cal?.refetchEvents()
            setOpen(false)
        })
    }
    const unpairUser = (e) => {
        e.preventDefault()
        setExpanded(false)
        setPairings(prevActions => (
            // Filter out the item with the matching index
            prevActions.filter((value, i) => i !== index)
        ));
        
        setUnpairOpen(false)
    }

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
                            <Avatar aria-label="recipe" className={classes.avatar}>
                                {initials}
                            </Avatar>
                        }
                        title={name}
                    />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Preferences: {preferences}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Remarks: {remarks}
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
                                <Button onClick={() => { setOpen(open => !open) }}>Schedule Meeting</Button>
                                <Button className="join" component={Link} to="/chat">Message</Button>
                                <Button onClick={() => { setUnpairOpen(unpairOpen => !unpairOpen) }}>Unpair</Button>
                                <Button onClick={() => { setReportOpen(unpairOpen => !unpairOpen) }}>Report</Button>
                            </ButtonGroup>
                        </CardContent>
                    </Collapse>
                </Card>
                <Modal
                    open={open}
                    onClose={() => { setOpen(open => !open) }}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div style={modalStyle} className={classes.modal}>
                        <h2>Event Details</h2>
                        <form onSubmit={createEvent} style={{ display: 'flex', flexDirection: "column", alignItems: "center" }}>
                            <FormControl style={{ width: 350 }} required>
                                <Input id="summaryRef" aria-describedby="my-helper-text" placeholder="event title" />
                            </FormControl>
                            <FormControl style={{ width: 350 }} required>
                                <Input id="startTime" aria-describedby="my-helper-text" placeholder="start time" type="datetime-local" />
                            </FormControl>
                            <FormControl style={{ width: 350 }} required>
                                <Input id="endTime" aria-describedby="my-helper-text" placeholder="end time" type="datetime-local" />
                            </FormControl>
                            <Button type="submit">Confirm</Button>
                        </form>
                    </div>
                </Modal>
                <Modal
                    open={unpairOpen}
                    onClose={() => { setUnpairOpen(open => !open) }}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div style={modalStyle} className={classes.modal}>
                        <h2>Confirm Unpair</h2>
                        <form onSubmit={unpairUser} style={{ display: 'flex', flexDirection: "column", alignItems: "center" }}>
                            <FormControl style={{ width: 350 }} required>
                                <FormHelperText>Your feedback is important to us! Please provide a reason for unpairing</FormHelperText>
                                <Input multiline id="summaryRef" aria-describedby="my-helper-text" placeholder="" />
                            </FormControl>
                            <Button type="submit">Unpair</Button>
                        </form>
                    </div>
                </Modal>
                <Modal
                    open={reportOpen}
                    onClose={() => { setReportOpen(open => !open) }}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div style={modalStyle} className={classes.modal}>
                        <h2>Report User</h2>
                        <form onSubmit={unpairUser} style={{ display: 'flex', flexDirection: "column", alignItems: "center" }}>
                            <FormControl style={{ width: 350 }} required>
                                <FormHelperText>Please provide reasons for reporting this user, and we will look into the matter!</FormHelperText>
                                <Input multiline id="summaryRef" aria-describedby="my-helper-text" placeholder="" />
                            </FormControl>
                            <Button type="submit">Report and Unpair</Button>
                        </form>
                    </div>
                </Modal>
            </motion.div>
        </>
    );
}
