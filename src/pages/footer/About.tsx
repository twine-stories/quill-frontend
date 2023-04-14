import React from 'react';
import './About.css';
import Navbar from '../../components/Navbar.tsx';
import { Grid, Typography } from '@mui/joy';

function About() {

    return (
        <div>
            <Navbar />
            <Grid container alignItems='center' justifyContent='center'>
                <Grid container direction='column' alignItems='center' justifyContent='space-around' id='about' xs={10}>
                    <Typography level='h2' color='purple'>About Us</Typography>
                    <Typography level='h3' color='purple'>Putting artists first: Twine’s core value.</Typography>
                    <Typography level='h3' color='purple'>Elevating original stories: Twine’s main goal.</Typography>
                    <Typography level='h6'>With Twine, creators come first. Full-time writers and illustrators should be able to support themselves with their work. Too many legacy storytelling corporations, from animation companies to novel publishing houses, greenlight projects based on predicted audience interest or social media followings. Unlike competitor platforms, Twine does not stand between artists and fans: Twine does not regulate the flow of currency, control the intellectual property, or determine how and what artists publish. Twine provides tools for artists to connect directly with each other and grow a loyal fanbase.</Typography>
                    <Typography level='h6'>We chose the name Twine because we were inspired by the science of forests. Transformational change can begin with small networks of people who fight for equity. A tree alone is vulnerable to the weather, but a forest controls the weather.</Typography>
                    <Typography level='h1' color='green'>Twine: We Create Worlds.</Typography>
                </Grid>
            </Grid>
        </div>
    )
}

export default About;