import React from 'react';
import { Modal, Sheet, Typography } from '@mui/joy';
import TwineButton from './TwineButton.tsx';

interface LoginWallProps {
    open: boolean;
    closeWall: () => void;
}

function LoginWall(props: LoginWallProps) {
    return (
        <Modal open={props.open} onClose={props.closeWall}>
            <Sheet variant="outlined"
            sx={{
                maxWidth: '200px',
                borderRadius: 'md',
                p: 3,
                boxShadow: 'lg',
            }}>
                <Typography>Must Login</Typography>
                <TwineButton className='close' action={props.closeWall} name='Close' />
            </Sheet>
        </Modal>
    )
}

export default LoginWall;