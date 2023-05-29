import React, { BaseSyntheticEvent, useContext, useState } from 'react';
import { Input, Grid, Typography, Stack } from '@mui/joy';
import TwineButton from '../components/TwineButton.tsx';
import { UserContext } from '../App.tsx';
import TwineInput from '../components/TwineInput.tsx';
import IconButton from '../components/IconButton.tsx';


function Beta() {
    const context: object = useContext(UserContext);
    const enterBeta: (code: string) => void = context['enterBeta'];

    const submitInput = (e: BaseSyntheticEvent) => {
        if (e.nativeEvent['keyCode'] === 13) {
            enterBeta((document.getElementById('betaAccess') as HTMLInputElement).value);
        }
    }

    return (
        <Grid container height='1700px' alignItems='center' justifyContent='space-around'>
            <Grid container direction='column' alignItems='center' justifyContent='space-around' height='1600px' xs={12} columns={1}>
                <img src='/icons/twine.svg' width='55%' />
                <iframe width="65%" height="40%"
                src="https://www.youtube.com/embed/4jjeJMxQibQ">
                </iframe>
                <Typography id='paragraph' color='white' level='p' sx={{textAlign: "left", width: "65%", lineHeight: "1.25", marginTop: "-40px"}}>With Twine, creators come first. We afford authors and illustrators a genuine opportunit to make enough money to support themselves with their work. Unlike competitor platforms, Twine does not stand between creators and fans or determine how and what creators publish. Twine provides tools for creators to connect directly with each other, visualize worlds together, and grow loyal fanbases. Creators keep their IP and &gt;90% of revenue they generate. <br></br><br></br> We chose the name Twine because we were inspired by the science of forests. Transformational change can begin with small networks of people who fight for equity. A tree alone is vulnerable to weather, but a forest controls the weather.<br></br><br></br>Twine: We Create Worlds.</Typography>
               
                <Grid container rowSpacing={3} direction='column' xs={5} sx={{marginTop: "-50px"}} >
                    <Grid>
                        <TwineInput placeholder='Enter passcode...' inputAttrs={{
                            type: 'password',
                            onKeyDown: submitInput,
                            id: 'betaAccess'
                        }} />
                    </Grid>
                    <Grid>
                        <TwineButton color='green' size='lg' icon='/icons/twine_logo.svg' name='Enter Beta' action={() => {
                            enterBeta((document.getElementById('betaAccess') as HTMLInputElement).value);
                        }} />
                    </Grid>
                </Grid>
            </Grid>
            <Stack direction="row" spacing = {2} alignItems= "center" sx={{alignSelf: "left"}} >
                <IconButton sx={{margin: "0px", marginLeft:"250px"}}color='darkpurple' icon='/icons/socials/twitter.svg' action={() => window.open('https://twitter.com/TwineStories', '_blank')} />
                <IconButton color='darkpurple' icon='/icons/socials/instagram.svg' action={() => window.open('https://www.instagram.com/twine_stories/', '_blank')} />
                <IconButton color='darkpurple' icon='/icons/socials/discord.svg' action={() => window.open('https://discord.com/invite/HKrvJrRUwJ', '_blank')} />
                <img src='/joindiscord.png' style={{marginTop: "-85px", marginLeft: "-10px"}}/>
            </Stack>
            
        </Grid>
    );
}

export default Beta;