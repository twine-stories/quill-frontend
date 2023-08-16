import React from 'react'
import { Modal, Sheet, Typography, Grid } from '@mui/joy'
import TwineButton from './TwineButton.tsx'

interface LoginWallProps {
    open: boolean
    closeWall: () => void
}

function LoginWall(props: LoginWallProps) {
    return (
        <Modal open={props.open} onClose={props.closeWall}>
            <Sheet
                variant="outlined"
                sx={{
                    maxWidth: '600px',
                    width: '50vw',
                    borderRadius: 'md',
                    p: 2,
                    boxShadow: 'lg',
                }}
            >
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="space-around"
                >
                    <Typography level="h4" sx={{ textAlign: 'center' }}>
                        Please login to access this page
                    </Typography>
                    <TwineButton
                        className="close"
                        action={props.closeWall}
                        name="Close"
                    />
                </Grid>
            </Sheet>
        </Modal>
    )
}

export default LoginWall
