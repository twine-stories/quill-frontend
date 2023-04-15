import React, { useState } from 'react';
import './HomeSlot.css';
import { Sheet, Typography, Grid } from '@mui/joy';
import { Work } from '../utils/types.ts';
import { STORY_IMGS_BUCKET } from '../config.ts';
import { STORY_COVER_PATH } from '../utils/aws.ts';

interface HomeProps {
    title: string;
    work: Work;
}

function HomeSlot(props: HomeProps) {

    const [hovering, setHovering] = useState<boolean>(false);
    console.log(props.work);

    const unHoveredContent = <Grid container direction='column' alignItems='flex-start' justifyContent='flex-start' sx={{width: '250px'}}>
            {props.work && 
                <Grid>
                    <img alt='cover' src={'https://' + STORY_IMGS_BUCKET + '.s3.amazonaws.com/' + STORY_COVER_PATH + props.work.cover} width='250' height='375' className='home-cover' />
                </Grid>
            }
            <Grid xs={12}>
                <Typography level='h6'>
                    {props.work ? props.work.hook : 'click "create" on the top bar above to create a story and publish a chapter'}
                </Typography>
            </Grid>
        </Grid>;

    const hoveredContent = <Grid sx={{width: '250px', height: '100%'}}>
            {props.work &&
                <Typography level='h3' color='purple'>{props.work.title}</Typography>
            }
            <Typography className='full-hook' level='h6'>
                {props.work ? props.work.hook : 'click "create" on the top bar above to create a story and publish a chapter'}
            </Typography>
        </Grid>;

    return (
        <Grid className='home-slot' onClick={() => {if (props.work) {window.location.href = '/story/' + props.work['url']}}} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
            <Typography level='h2' color='purple' sx={{textAlign: 'center'}}>{props.title}</Typography>
            <Sheet
            color='home'
            variant={props.work ? 'outlined' : 'purpleDashed'}
            sx={{
                width: '260px',
                height: '450px',
                borderRadius: 'md',
                p: 3
            }}>
                <Grid container direction='column' alignItems='center' justifyContent={hovering ? 'flex-start' : 'space-between'} height='100%' xs={12}>
                    {hovering ? hoveredContent : unHoveredContent}
                </Grid>
            </Sheet>
        </Grid>
    )
}

export default HomeSlot;