import React from 'react';
import { Modal, Sheet, Typography, Grid } from '@mui/joy';
import TwineButton from './TwineButton.tsx';

interface CollabPopupProps {
    open: boolean;
    close: () => void;
}

function CollabPopup(props: CollabPopupProps) {
    return (
        <Modal open={props.open} onClose={props.close}>
            <Sheet
            variant="outlined"
            sx={{
                maxWidth: '600px',
                width: '50vw',
                borderRadius: 'md',
                p: 2,
                boxShadow: 'lg',
            }}>
                <Grid container direction='column' alignItems='center' justifyContent='space-around'>
                    <Typography level='h3' sx={{textAlign: 'center'}} color='green'>Creator Collab Discord</Typography>
                    <Typography level='h6' sx={{textAlign: 'center'}} color='green'>Place for creators to meet other creators and fans to interact with creators and other fans!</Typography>
                    <Grid container alignItems='center' justifyContent='space-around'>
                        <TwineButton color='purple' name='Join Discord' action={() => window.open('https://discord.gg/HKrvJrRUwJ','_blank')} />
                        <TwineButton color='green' name='Cancel' action={props.close} />
                    </Grid>
                </Grid>
            </Sheet>
        </Modal>
    )
}

export default CollabPopup;