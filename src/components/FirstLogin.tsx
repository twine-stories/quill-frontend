import React, { useContext } from 'react';
import Popup from 'reactjs-popup';
import { UserContext } from "../App.tsx";
import TwineButton from './TwineButton.tsx';

function FirstLogin() {
    const context: object = useContext(UserContext);
    const sendRequest = context['addUser'];
    const open = context['openLogin'];
    const close = context['closeLogin'];

    return (
        <Popup open={open} onClose={close}>
            <input type='text' id='firstName' name='firstName' placeholder='First Name'></input>
            <input type='text' id='lastName' name='lastName' placeholder='Last Name'></input>
            <TwineButton action={(e) => {
                const first = document.getElementById('firstName') as HTMLInputElement;
                const last = document.getElementById('lastName') as HTMLInputElement;
                if (first && last) {
                    sendRequest(context['address'], first.value, last.value);
                }
            }} name='Submit' />
        </Popup>
    )
}

export default FirstLogin;