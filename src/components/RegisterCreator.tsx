import React, { useContext } from 'react';
import Popup from 'reactjs-popup';
import { UserContext } from "../App.tsx";

interface RegisterCreatorProps {
    open: boolean;
    updateUser: (user: object) => void;
    navigate: () => void;
}

function RegisterCreator(props: RegisterCreatorProps) {
    const context: object = useContext(UserContext);

    return (
        <Popup open={props.open}>
            <input type='text' id='email' name='email' placeholder='Email Address'></input>
            <button onClick={(e) => {
                const email = document.getElementById('email') as HTMLInputElement;
                if (email) {
                    let newUser: object = JSON.parse(JSON.stringify(context['user']));
                    console.log(newUser);
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