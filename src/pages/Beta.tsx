import React, { useContext, useState } from 'react';
import { Input, Grid } from '@mui/joy';
import TwineButton from '../components/TwineButton.tsx';
import { UserContext } from '../App.tsx';


function Beta() {
    const context: object = useContext(UserContext);
    const enterBeta: (code: string) => void = context['enterBeta'];

    return (
        <Grid>
            TWINE
            <Input id='betaAccess' placeholder='Enter passcode...' slotProps={{
                input: {
                    type: 'password'
                }
            }} />
            <TwineButton color='green' icon='icons/twine_logo.svg' name='Enter Beta' action={() => {
                return enterBeta((document.getElementById('betaAccess') as HTMLInputElement).value);
            }} />
        </Grid>
    );
}

export default Beta;