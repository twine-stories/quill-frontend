import React, { useContext, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import HomeSlot from '../components/HomeSlot.tsx';
import { Grid, Typography, Sheet } from '@mui/joy';

function Home() {
    return (
        <div>
            <Navbar />
            <Grid container alignItems='flex-start' justifyContent='space-around'>
                <HomeSlot title='Featured' />
                <HomeSlot title='Hot' />
                <HomeSlot title='Discover' />
            </Grid>
        </div>
    );
}

export default Home;