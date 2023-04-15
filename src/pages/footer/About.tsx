import React from 'react';
import './About.css';
import Navbar from '../../components/Navbar.tsx';
import { Grid, Typography } from '@mui/joy';

function About() {

    return (
        <div>
            <Navbar />
            <Grid container alignItems='center' justifyContent='center'>
                <Grid container direction='column' alignItems='flex-start' justifyContent='space-around' id='about' xs={10}>
                    <Grid container alignItems='center' justifyContent='space-between' xs={12} columnSpacing={1}>
                        <Grid container direction='column' alignItems='flex-start' justifyContent='space-between' xs={7}>
                            <Typography level='h2' color='green'>About Us</Typography>
                            <Grid>
                                <Typography level='h6'>Putting artists first: Twine’s core value.</Typography>
                                <Typography level='h6'>Elevating original stories: Twine’s main goal.</Typography>
                            </Grid>
                        </Grid>
                        <Grid container alignItems='center' justifyContent='center' xs={5}>
                            <img id='about-logo' src='/icons/twine_logo.svg' />
                        </Grid>
                    </Grid>
                    <Typography level='h6'>With Twine, creators come first. Full-time writers and illustrators should be able to support themselves with their work. Too many legacy storytelling corporations, from animation companies to novel publishing houses, greenlight projects based on predicted audience interest or social media followings. Unlike competitor platforms, Twine does not stand between artists and fans: Twine does not regulate the flow of currency, control the intellectual property, or determine how and what artists publish. Twine provides tools for artists to connect directly with each other and grow a loyal fanbase.</Typography>
                    <Typography level='h6'>We chose the name Twine because we were inspired by the science of forests. Transformational change can begin with small networks of people who fight for equity. A tree alone is vulnerable to the weather, but a forest controls the weather.</Typography>
                    <Typography level='h6'>Twine: We Create Worlds.</Typography>
                </Grid>
            </Grid>
        </div>
    )
}

export default About;