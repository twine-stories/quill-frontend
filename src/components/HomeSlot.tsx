import React from 'react';
import './HomeSlot.css';
import { Sheet, Typography, Grid } from '@mui/joy';
import { Work } from '../utils/types.ts';

interface HomeProps {
    title: string;
    work: Work;
}

function HomeSlot(props: HomeProps) {

    if (props.work) {
        console.log(props.work.cover);
    }

    return (
        <Grid onClick={() => {if (props.work) {window.location.href = '/story/' + props.work['url']}}}>
            <Typography level='h2' color='purple' sx={{textAlign: 'center'}}>{props.title}</Typography>
            <Sheet
            color='home'
            variant={props.work ? 'outlined' : 'purpleDashed'}
            sx={{
                width: '250px',
                height: '375px',
                borderRadius: 'md',
                p: 3
            }}>
                <Grid container direction='column' alignItems='center' justifyContent='space-around' height='100%' className='homeGridContainer'>
                    <Typography level='h6' sx={{fontSize: '14px', textOverflow: 'ellipsis'}}>{props.work ? props.work.hook : 'click "create" on the top bar above to create your story and publish your first chapter'}</Typography>
                </Grid>
            </Sheet>
        </Grid>
    )
}

export default HomeSlot;