import React from 'react';
import { Sheet, Typography, Grid } from '@mui/joy';

interface HomeProps {
    title: string;
}

function HomeSlot(props: HomeProps) {
    return (
        <Grid>
            <Typography level='h2' color='purple' sx={{textAlign: 'center'}}>{props.title}</Typography>
            <Sheet
            color='home'
            variant='outlined'
            sx={{
                width: '250px',
                height: '375px',
                borderRadius: 'md',
                p: 3
            }}>
                
            </Sheet>
        </Grid>
    )
}

export default HomeSlot;