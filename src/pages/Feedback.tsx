import React, { useContext, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import TwineInput from '../components/TwineInput.tsx';
import TwineButton from '../components/TwineButton.tsx';
import { Typography, Grid, Textarea, FormControl, FormLabel } from "@mui/joy";

function Feedback() {
    return (
        <div>
            <Navbar />
            <Grid container direction='column' alignItems='flex-start' justifyContent='space-around'>
                <Typography color='purple' level='h2'>Send Us Your Feedback</Typography>
                <Grid container direction='column' alignItems='flex-start' justifyContent='space-around' xs={12} rowSpacing={3} sx={{marginLeft: '20px'}}>
                    <Grid xs={11}>
                        <TwineInput label='Subject' placeholder='Enter a title for the issue...' />
                    </Grid>
                    <Grid xs={11}>
                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Textarea placeholder='Enter a description for the issue...' minRows={5}></Textarea>
                        </FormControl>
                    </Grid>
                    <Grid container alignItems='center' justifyContent='space-around' xs={11}>
                        <TwineButton name='Submit' color='darkpurple' />
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default Feedback;