import React, { useContext } from 'react';
// import Popup from 'reactjs-popup';
import { UserContext } from "../App.tsx";
import TwineButton from './TwineButton.tsx';
import TwineInput from './TwineInput.tsx';
import { Modal, Sheet } from '@mui/joy';

function FirstLogin() {
    const context: object = useContext(UserContext);
    const sendRequest = context['addUser'];
    const open = context['openLogin'];
    const close = context['closeLogin'];

    return (
        <Modal open={open} onClose={close}>
            <Sheet
            variant="outlined"
            sx={{
                maxWidth: '500px',
                borderRadius: 'md',
                p: 3,
                boxShadow: 'lg',
            }}
            >
                <TwineInput label='first name' placeholder='Enter first name...' inputAttrs={{id: 'firstNameInput'}} />
                <TwineInput label='last name' placeholder='Enter last name...' inputAttrs={{id: 'lastNameInput'}} />
                <TwineInput label='username' placeholder='Enter username...' inputAttrs={{id: 'usernameInput'}} />
                <TwineButton action={(e) => {
                    const first = document.getElementById('firstNameInput') as HTMLInputElement;
                    const last = document.getElementById('lastNameInput') as HTMLInputElement;
                    const username = document.getElementById('usernameInput') as HTMLInputElement;
                    if (first && last && username) {
                        sendRequest(context['address'], first.value, last.value, username.value);
                    }
                }} name='Submit' />
            </Sheet>
        </Modal>
    )
}

export default FirstLogin;