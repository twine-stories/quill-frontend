import React from 'react';
import Popup from 'reactjs-popup';

interface LoginWallProps {
    open: boolean;
    closeWall: () => void;
}

function LoginWall(props: LoginWallProps) {
    console.log(props.open);
    return (
        <Popup open={props.open} modal onClose={props.closeWall}>
            Must Login
            <button className='close' onClick={props.closeWall}>close</button>
        </Popup>
    )
}

export default LoginWall;