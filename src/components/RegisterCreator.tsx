import React, { useContext } from 'react';
import Popup from 'reactjs-popup';
import { UserContext } from "../App.tsx";
import { User } from '../utils/types.ts';
import Button from './Button.tsx';

interface RegisterCreatorProps {
    open: boolean;
    close: () => void;
    updateUser: (user: User) => void;
    navigate: () => void;
}

function RegisterCreator(props: RegisterCreatorProps) {
    const context: object = useContext(UserContext);

    return (
        <Popup open={props.open} onClose={props.close}>
            <input type='text' id='email' name='email' placeholder='Email Address'></input>
            <input type='text' id='displayName' name='displayName' placeholder='Display Name'></input>
            <Button action={(e) => {
                const email = document.getElementById('email') as HTMLInputElement;
                const displayName = document.getElementById('displayName') as HTMLInputElement;
                if (email && displayName) {
                    let newUser: User = JSON.parse(JSON.stringify(context['user']));
                    newUser['email'] = email.value;
                    newUser['creator'] = true;
                    newUser['displayName'] = displayName.value;

                    props.updateUser(newUser);
                    props.navigate();
                }
            }} name='Submit' />
        </Popup>
    )
}

export default RegisterCreator;