import React, { BaseSyntheticEvent, useContext, useState } from 'react';
import { Input, Grid, Typography, Stack } from '@mui/joy';
import TwineButton from '../components/TwineButton.tsx';
import { UserContext } from '../App.tsx';
import TwineInput from '../components/TwineInput.tsx';
import IconButton from '../components/IconButton.tsx';
import './Beta.css';


function Beta() {
    const context: object = useContext(UserContext);
    const enterBeta: (code: string) => void = context['enterBeta'];

    const submitInput = (e: BaseSyntheticEvent) => {
        if (e.nativeEvent['keyCode'] === 13) {
            enterBeta((document.getElementById('betaAccess') as HTMLInputElement).value);
        }
    }

    return (
        <Grid container alignItems='center' justifyContent='center' sx={{minWidth: '100%'}}>
            <Grid container direction='column' alignItems='center' justifyContent='' xs={10} columns={1} sx={{margin: '0px 0px 60px'}}>
                <img src='/icons/TwineLogo.png' width='50%' style={{marginBottom: '-30px'}}/>
                <iframe style={{borderRadius: '5px', border: 'none', margin: '0px 40px 40px', height: '30vw', width: '50vw', maxWidth: '900px', maxHeight: '540px', minWidth: '100%', minHeight: '', padding: '15px', borderRadius: '15px', border: '1px solid #241D19'}}
                src="https://www.youtube.com/embed/4jjeJMxQibQ">
                
                </iframe>
                <Typography id='paragraph' color='white' level='p' sx={{marginBottom: '40px', textAlign: "left", width: "63vw", maxWidth: '100%', minWidth: '100%', lineHeight: "1.25",fontFamily:'Oxanium' , fontSize:'22px'}}>With Twine, creators come first. We afford authors and illustrators a genuine opportunity to make enough money to support themselves with their work. Unlike competitor platforms, Twine does not stand between creators and fans or determine how and what creators publish. Twine provides tools for creators to connect directly with each other, visualize worlds together, and grow loyal fanbases. Creators keep their IP and more than 90% of the revenue they generate. <br></br><br></br> We chose the name Twine because we were inspired by the science of forests. Transformational change can begin with small networks of people who fight for equity. A tree alone is vulnerable to weather, but a forest controls the weather.<br></br><br></br>Twine: We Create Worlds.</Typography>
               
                <Grid container rowSpacing={3} direction='column' sx={{maxWidth: '450px', minWidth: '350px', width: '30vw'}} >
                    <Grid>
                        <span>hello</span>
                        <TwineInput sx={{marginTop: "21px"}} placeholder='Enter passcode...' inputAttrs={{
                            type: 'password',
                            onKeyDown: submitInput,
                            id: 'betaAccess'
                        }} />
                    </Grid>
                    <Grid>
                        <TwineButton  sx={{width: "59%",height: "58px",borderRadius: "20px",padding: "24px",fontSize: "14px"}} color='green' size='lg' icon='/icons/twine_logo.svg' name='Enter Beta' action={() => {
                            enterBeta((document.getElementById('betaAccess') as HTMLInputElement).value);
                        }} />
                    </Grid>
                </Grid>
                <Stack direction="row" spacing = {2} alignItems= "center" sx={{alignSelf: "left", marginTop: '50px'}} >
                <IconButton className='svgBackground' sx={{margin: "0px", marginLeft:"250px"}} color='darkpurple' icon='/icons/socials/twitter.svg' backgroundColor='#5C720D' action={() => window.open('https://twitter.com/TwineStories', '_blank')} />
                <IconButton color='darkpurple' icon='/icons/socials/instagram.svg' backgroundColor='#5C720D' action={() => window.open('https://www.instagram.com/twine_stories/', '_blank')} />
                <IconButton color='darkpurple' icon='/icons/socials/discord.svg' backgroundColor='#5C720D' action={() => window.open('https://discord.com/invite/HKrvJrRUwJ', '_blank')} />
                <IconButton color='darkpurple' icon='/icons/music.svg' backgroundColor='#5C720D' action={() => window.open('https://discord.com/invite/HKrvJrRUwJ', '_blank')} />
                 <img src='/joindiscord.png' style={{marginTop: "-85px", marginLeft: "-10px"}}/>
                </Stack>
            </Grid>
            
            
        </Grid>
    );
}

export default Beta;