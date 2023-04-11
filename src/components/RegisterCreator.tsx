import React, { useContext } from 'react';
import { UserContext } from "../App.tsx";
import { User } from '../utils/types.ts';
import TwineButton from './TwineButton.tsx';
import TwineInput from './TwineInput.tsx';
import { Modal, Sheet, Typography, Grid } from '@mui/joy';
import { genericPost } from '../utils/api.ts';

interface RegisterCreatorProps {
    open: boolean;
    close: () => void;
    updateUser: (user: User) => void;
    navigate: () => void;
}

function RegisterCreator(props: RegisterCreatorProps) {
    const context: object = useContext(UserContext);

    return (
        <Modal open={props.open} onClose={props.close}>
            <Sheet
            variant="outlined"
            sx={{
                maxWidth: '600px',
                width: '50vw',
                borderRadius: 'md',
                p: 3,
                boxShadow: 'lg',
            }}>
                <Typography level='h2' color='green'>Register as a Creator</Typography>
                <Grid container direction='column' sx={{marginLeft: '30px', marginBottom: '20px'}} rowSpacing={2}>
                    <Grid><TwineInput placeholder='Enter email...' label='email address' inputAttrs={{id: 'emailInput'}} /></Grid>
                    <Grid><TwineInput placeholder='Enter phone number...' label='phone number' inputAttrs={{id: 'phoneInput'}} /></Grid>
                </Grid>
                <Grid container alignItems='center' justifyContent='center'>
                    <TwineButton color='green' action={(e) => {
                        const email = document.getElementById('emailInput') as HTMLInputElement;
                        const phone = document.getElementById('phoneInput') as HTMLInputElement;
                        if (email && phone) {
                            let newUser: User = JSON.parse(JSON.stringify(context['user']));
                            newUser.email = email.value;
                            newUser.creator = true;

                            let phoneNumber: string = "";
                            const reg = new RegExp('^[0-9]+$');
                            for (let i = 0; i < phone.value.length; i++) {
                                console.log(phone.value[i] + " " + reg.test(phone.value[i]));
                                if (reg.test(phone.value[i])) {
                                    phoneNumber += phone.value[i];
                                }
                            }
                            if (phoneNumber.length !== 10) {
                                return;
                            }

                            newUser.phoneNumber = phoneNumber;

                            genericPost('/api/user/update', newUser).then((response) => {
                                props.updateUser(response);
                                props.navigate();  
                            });
                        }
                    }} name='Register' />
                </Grid>
            </Sheet>
        </Modal>
    )
}

export default RegisterCreator;