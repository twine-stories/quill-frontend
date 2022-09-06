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
                const first = document.getElementById('firstName');
                const last = document.getElementById('lastName');
                if (first && last) {
                    sendRequest(context['address'], (first as HTMLInputElement).value, (last as HTMLInputElement).value);
                }
            }}>Submit</button>
        </Popup>
    )
}

export default FirstLogin;