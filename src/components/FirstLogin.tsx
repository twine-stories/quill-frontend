import React, { useState, useContext } from 'react';
import { UserContext } from "../App.tsx";
import TwineButton from './TwineButton.tsx';
import TwineInput from './TwineInput.tsx';
import { Modal, Sheet, Typography, Grid, Checkbox } from '@mui/joy';

function FirstLogin() {
    const [canSubmit, setCanSubmit] = useState<boolean>(false);

    const context: object = useContext(UserContext);
    const sendRequest = context['addUser'];
    const open = context['openLogin'];
    const close = context['closeLogin'];

    const tosChange = (e) => {
        setCanSubmit(e.target.checked);
    }

    return (
        <Modal open={open} onClose={close}>
            <Sheet
            variant="outlined"
            sx={{
                maxWidth: '600px',
                width: '50vw',
                borderRadius: 'md',
                p: 3,
                boxShadow: 'lg',
            }}
            >
                <Typography level='h2' color='green'>Create an Account</Typography>
                <Grid sx={{marginLeft: '30px', marginBottom: '30px'}}>
                    <TwineInput label='first name' placeholder='Enter first name...' inputAttrs={{id: 'firstNameInput'}} />
                    <TwineInput label='last name' placeholder='Enter last name...' inputAttrs={{id: 'lastNameInput'}} />
                    <TwineInput label='username' placeholder='Enter username...' inputAttrs={{id: 'usernameInput'}} />
                </Grid>
                <Grid container alignItems='center' justifyContent='center'>
                    <Checkbox color='green' onChange={tosChange} sx={{marginBottom: '15px'}} size='sm' label="By checking this box, I verify that I have read and agree to the terms of use." slotProps={{
                        input: {
                            id: 'tos',
                            'aria-label': 'primary checkbox'
                        }
                    }} />
                    <TwineButton enabled={canSubmit} color='green' action={(e) => {
                        if (!(document.getElementById('tos') as HTMLInputElement).checked) {
                            return;
                        }

                        const first = document.getElementById('firstNameInput') as HTMLInputElement;
                        const last = document.getElementById('lastNameInput') as HTMLInputElement;
                        const username = document.getElementById('usernameInput') as HTMLInputElement;
                        if (first && last && username) {
                            sendRequest(context['address'], first.value, last.value, username.value);
                        }
                    }} name='Create Account' />
                </Grid>
            </Sheet>
        </Modal>
    )
}

export default FirstLogin;