import React from 'react';
import './Footer.css';
import IconButton from './IconButton.tsx';
import { Grid } from '@mui/joy';

function Footer() {

    return (
        <Grid container direction='column' alignItems='center' justifyContent='space-around' id='footer'>
            <Grid container alignItems='center' justifyContent='space-around' columnSpacing={4} id='social-media'>
                <Grid><IconButton color='darkpurple' icon='/icons/socials/twitter.svg' /></Grid>
                <Grid><IconButton color='darkpurple' icon='/icons/socials/instagram.svg' /></Grid>
                <Grid><IconButton color='darkpurple' icon='/icons/socials/discord.svg' /></Grid>
            </Grid>
            <Grid container alignItems='center' justifyContent='space-around' id='footer-links' columnSpacing={6}>
                <Grid><a href='/about'>About</a></Grid>
                <Grid><a href='/feedback'>Feeback</a></Grid>
                <Grid><a href='/algo-help'>Algo Help</a></Grid>
                <Grid><a href='/terms'>Terms</a></Grid>
            </Grid>
        </Grid>
    )
}

export default Footer;