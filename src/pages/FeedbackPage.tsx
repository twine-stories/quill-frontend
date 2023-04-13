import React, { useContext } from 'react';
import Navbar from "../components/Navbar.tsx";
import TwineInput from '../components/TwineInput.tsx';
import TwineButton from '../components/TwineButton.tsx';
import { Typography, Grid, Textarea, FormControl, FormLabel } from "@mui/joy";
import { genericPost } from '../utils/api.ts';
import { UserContext } from "../App.tsx";
import { User, Feedback } from '../utils/types.ts';

function FeedbackPage() {
    const context: object = useContext(UserContext);
    const user: User = context['user'];

    return (
        <div>
            <Navbar />
            {user ?
            <Grid container direction='column' alignItems='center' justifyContent='space-around'>
                <Grid xs={11}><Typography color='purple' level='h2'>Send Us Your Feedback</Typography></Grid>
                <Grid container direction='column' alignItems='center' justifyContent='space-around' xs={11} rowSpacing={3}>
                    <Grid xs={11}>
                        <TwineInput label='Subject' placeholder='Enter a title for the issue...' inputAttrs={{id: 'feedbackSubj'}} />
                    </Grid>
                    <Grid xs={11}>
                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Textarea placeholder='Enter a description for the issue...' minRows={5} slotProps={{
                                textarea: {
                                    id: 'feedbackDesc'
                                }
                            }}></Textarea>
                        </FormControl>
                    </Grid>
                    <Grid container alignItems='center' justifyContent='space-around' xs={11}>
                        <TwineButton name='Submit' color='darkpurple' action={() => {
                            const desc: string = (document.getElementById('feedbackDesc') as HTMLInputElement).value;
                            const subj: string = (document.getElementById('feedbackSubj') as HTMLInputElement).value;

                            const feedback: Feedback = {
                                beta: true,
                                submitter: user,
                                subject: subj,
                                description: desc
                            };
                            genericPost('/api/feedback/submit', feedback).then(response => {
                                console.log(response);
                            });
                        }} />
                    </Grid>
                    <Grid container alignItems='center' justifyContent='space-around' xs={11}>
                        <Typography level='h6' sx={{fontFamily: 'Twine'}}>thank you!</Typography>
                    </Grid>
                </Grid>
            </Grid>
            :
            <Grid container direction='column' alignItems='center' justifyContent='space-around'>
                <Grid xs={11}><Typography color='purple' level='h2'>Send Us Your Feedback</Typography></Grid>
                <Grid xs={11}><Typography color='purple' level='h6'>Please login to share your feedback!</Typography></Grid>
            </Grid>
            }
        </div>
    );
}

export default FeedbackPage;