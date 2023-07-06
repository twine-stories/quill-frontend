import React from 'react';
import './Footer.css';
import IconButton from './IconButton.tsx';
import { Grid } from '@mui/joy';

function Footer() {

    return (
        <Grid className="footer-styling" container direction='column' alignItems='center' justifyContent='space-around' id='footer'>
            <Grid container alignItems='center' justifyContent='space-around' columnSpacing={4} id='social-media'>
                <Grid><IconButton color='darkpurple' icon='/icons/socials/twitter.svg' action={() => window.open('https://twitter.com/twinestories','_blank')} /></Grid>
                <Grid><IconButton color='darkpurple' icon='/icons/socials/discord.svg' action={() => window.open('https://discord.gg/HKrvJrRUwJ','_blank')} /></Grid>
            </Grid>
            <Grid container alignItems='center' justifyContent='space-around' id='footer-links' columnSpacing={{ xs: 2, sm: 4, lg: 4.5, xl: 5 }}>
                <Grid className='about'><a href='/about'>About</a></Grid>
                <Grid><a href='/feedback'>Feedback</a></Grid>
                <Grid><a href='/help'>Algo Help</a></Grid>
                <Grid><a href='/terms'>Terms</a></Grid>
            </Grid>
        </Grid>
    )
}

export default Footer;