import React, { useContext } from 'react';
import Popup from 'reactjs-popup';
import { UserContext } from "../App.tsx";

function FirstLogin() {
    const context: object = useContext(UserContext);
    const sendRequest = context['addUser'];
    const open = context['openLogin'];

    return (
        <Popup open={open}>
            <input type='text' id='firstName' name='firstName' placeholder='First Name'></input>
            <input type='text' id='lastName' name='lastName' placeholder='Last Name'></input>
            <button onClick={(e) => {
                const first = document.getElementById('firstName') as HTMLInputElement;
                const last = document.getElementById('lastName') as HTMLInputElement;
                if (first && last) {
                    sendRequest(context['address'], first.value, last.value);
                }
            }}>Submit</button>
        </Popup>
    )
}

export default FirstLogin;