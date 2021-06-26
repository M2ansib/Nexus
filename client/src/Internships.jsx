import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import InternshipCard from './InternshipCard';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Modal from '@material-ui/core/Modal';
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar } from '@material-ui/core';
import MosaicContainer from './MosaicContainer';
import { motion } from 'framer-motion';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '50ch',
        },
    },
    paper: {
        padding: 10,
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
function PairingsList(props) {
    const { cal } = props
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [currentTime, setCurrentTime] = useState(0);
    const [search, setSearch] = useState("")

    const internships = [
        {
            position: "iCARE Counsellor",
            company: "Ministry of Education",
            imageLink: "https://az29734.vo.msecnd.net/clients/688/template/MOE_v2.png",
            learnMoreLink: "https://careers.pageuppeople.com/688/cwlive/en/job/560359/icare-counsellor",
            applyLink: "https://careers.pageuppeople.com/688/cwlive/en/job/560359/icare-counsellor",
            jobDescription: "As an iCARE Counsellor in the Academy of Singapore Teachers, you will support the social, emotional and psychological needs of officers in the Ministry."
        },
        {
            position: "Smart Nation Fellowship Programme",
            company: "GovTech Singapore",
            imageLink: "https://media-exp3.licdn.com/dms/image/C4D0BAQGT9Dy38Q2jdQ/company-logo_100_100/0/1519890805213?e=1632960000&v=beta&t=VO241Uw8hWcNy4uApUXKHSbessUgwHelq9QD4kI2zSo",
            learnMoreLink: "https://careers.pageuppeople.com/688/cwlive/en/job/560359/icare-counsellor",
            applyLink: "https://careers.pageuppeople.com/688/cwlive/en/job/560359/icare-counsellor",
            jobDescription: "Singapore is embarking on a journey to build a Smart Nation, with the aim of harnessing technology and data to improve the lives of citizens. If you are an established data scientist, engineer, software developer, technologist, designer or applied researcher, we need your expertise and experience! Take three months to one year to collaborate with us to co-create digital or engineering solutions that will make an impact on people’s lives."
        },
        {
            position: "iCARE Counsellor",
            company: "Ministry of Education",
            imageLink: "https://az29734.vo.msecnd.net/clients/688/template/MOE_v2.png",
            learnMoreLink: "https://careers.pageuppeople.com/688/cwlive/en/job/560359/icare-counsellor",
            applyLink: "https://careers.pageuppeople.com/688/cwlive/en/job/560359/icare-counsellor",
            jobDescription: "As an iCARE Counsellor in the Academy of Singapore Teachers, you will support the social, emotional and psychological needs of officers in the Ministry."
        },
        {
            position: "Smart Nation Fellowship Programme",
            company: "GovTech Singapore",
            imageLink: "https://media-exp3.licdn.com/dms/image/C4D0BAQGT9Dy38Q2jdQ/company-logo_100_100/0/1519890805213?e=1632960000&v=beta&t=VO241Uw8hWcNy4uApUXKHSbessUgwHelq9QD4kI2zSo",
            learnMoreLink: "https://careers.pageuppeople.com/688/cwlive/en/job/560359/icare-counsellor",
            applyLink: "https://careers.pageuppeople.com/688/cwlive/en/job/560359/icare-counsellor",
            jobDescription: "Singapore is embarking on a journey to build a Smart Nation, with the aim of harnessing technology and data to improve the lives of citizens. If you are an established data scientist, engineer, software developer, technologist, designer or applied researcher, we need your expertise and experience! Take three months to one year to collaborate with us to co-create digital or engineering solutions that will make an impact on people’s lives."
        },
        {
            position: "iCARE Counsellor",
            company: "Ministry of Education",
            imageLink: "https://az29734.vo.msecnd.net/clients/688/template/MOE_v2.png",
            learnMoreLink: "https://careers.pageuppeople.com/688/cwlive/en/job/560359/icare-counsellor",
            applyLink: "https://careers.pageuppeople.com/688/cwlive/en/job/560359/icare-counsellor",
            jobDescription: "As an iCARE Counsellor in the Academy of Singapore Teachers, you will support the social, emotional and psychological needs of officers in the Ministry."
        },
        {
            position: "Smart Nation Fellowship Programme",
            company: "GovTech Singapore",
            imageLink: "https://media-exp3.licdn.com/dms/image/C4D0BAQGT9Dy38Q2jdQ/company-logo_100_100/0/1519890805213?e=1632960000&v=beta&t=VO241Uw8hWcNy4uApUXKHSbessUgwHelq9QD4kI2zSo",
            learnMoreLink: "https://careers.pageuppeople.com/688/cwlive/en/job/560359/icare-counsellor",
            applyLink: "https://careers.pageuppeople.com/688/cwlive/en/job/560359/icare-counsellor",
            jobDescription: "Singapore is embarking on a journey to build a Smart Nation, with the aim of harnessing technology and data to improve the lives of citizens. If you are an established data scientist, engineer, software developer, technologist, designer or applied researcher, we need your expertise and experience! Take three months to one year to collaborate with us to co-create digital or engineering solutions that will make an impact on people’s lives."
        },
    ]

    function filterByValue(array, string) {
        return array.filter(o =>
            Object.keys(o).some(k => k !== "applyLink" && k !== "imageLink" && k !== "learnMoreLink" && o[k].toLowerCase().includes(string.toLowerCase())));
    }

    const handleChange = (e) => {
        setSearch(e.target.value)
    }

    const blogVariants = {
        enter: { transition: { staggerChildren: 0.04 } },
        exit: { transition: { staggerChildren: 0.02 } }
    };

    useEffect(() => {
        fetch('/api/time').then(res => res.json()).then(data => {
            setCurrentTime(data.time);
        });
    }, []);
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >

            <div className={classes.paper}>

                <motion.div
                    className="blog-list"
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    variants={blogVariants}
                >
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: 10
                    }}>
                        <Input type="search" placeholder="Search by position, company or job description..." style={{ width: "40%" }} value={search} onChange={handleChange} />
                    </div>
                    <MosaicContainer>
                        {console.log(filterByValue(internships, search))}
                        {filterByValue(internships, search).map((internship, index) => (
                            <InternshipCard position={internship.position} company={internship.company} imageLink={internship.imageLink} learnMoreLink={internship.learnMoreLink} applyLink={internship.applyLink} jobDescription={internship.jobDescription} />
                        ))}
                    </MosaicContainer>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default function Groupings() {

    return (

        <Grid xs={12} justify="flex-start" alignItems="flex-start">
            <PairingsList />
        </Grid>
    )
}