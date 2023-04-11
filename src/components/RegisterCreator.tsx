import React, { useContext } from 'react';
import { UserContext } from "../App.tsx";
import { User } from '../utils/types.ts';
import TwineButton from './TwineButton.tsx';
import TwineInput from './TwineInput.tsx';
import { Modal, Sheet, Typography } from '@mui/joy';

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
            <Sheet>
                <TwineInput placeholder='Enter email...' label='email address' inputAttrs={{id: 'emailInput'}} />
                <TwineInput placeholder='Enter phone number...' label='phone number' inputAttrs={{id: 'phoneInput'}} />
                <TwineButton action={(e) => {
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

                        props.updateUser(newUser);
                        // props.navigate();
                    }
                }} name='Submit' />
            </Sheet>
        </Modal>
    )
}

export default RegisterCreator;