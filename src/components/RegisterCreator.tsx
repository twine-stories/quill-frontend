import React, { useContext } from 'react';
import Popup from 'reactjs-popup';
import { UserContext } from "../App.tsx";
import { User } from '../utils/types.ts';

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
            <button onClick={(e) => {
                const email = document.getElementById('email') as HTMLInputElement;
                if (email) {
                    let newUser: User = JSON.parse(JSON.stringify(context['user']));
                    newUser['email'] = email.value;
                    newUser['creator'] = true;

                    props.updateUser(newUser);
                    props.navigate();
                }
            }}>Submit</button>
        </Popup>
    )
}

export default RegisterCreator;