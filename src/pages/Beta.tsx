import React, { BaseSyntheticEvent, useContext, useState } from 'react';
import { Input, Grid } from '@mui/joy';
import TwineButton from '../components/TwineButton.tsx';
import { UserContext } from '../App.tsx';


function Beta() {
    const context: object = useContext(UserContext);
    const enterBeta: (code: string) => void = context['enterBeta'];

    const submitInput = (e: BaseSyntheticEvent) => {
        if (e.nativeEvent['keyCode'] === 13) {
            enterBeta((document.getElementById('betaAccess') as HTMLInputElement).value);
        }
    }

    return (
        <Grid container height='100vh' alignItems='center' justifyContent='space-around'>
            <Grid container direction='column' alignItems='center' justifyContent='space-around' height='75vh' xs={12}>
                <img src='icons/twine.svg' width='50%' />
                <Grid container rowSpacing={3} direction='column' xs={5}>
                    <Grid>
                        <Input color='brown' id='betaAccess' placeholder='Enter passcode...' slotProps={{
                            input: {
                                type: 'password',
                                onKeyDown: submitInput
                            }
                        }} />
                    </Grid>
                    <Grid>
                        <TwineButton color='green' size='lg' icon='icons/twine_logo.svg' name='Enter Beta' action={() => {
                            enterBeta((document.getElementById('betaAccess') as HTMLInputElement).value);
                        }} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Beta;