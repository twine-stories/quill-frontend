import './ClickProfile.css';
import { Menu, MenuItem, Modal, Sheet, Grid, ModalClose, Typography } from '@mui/joy';
import React, { useContext, useState, } from 'react';
import { User } from '../types';
import { UserContext } from "../App.tsx";
import { useNavigate } from 'react-router-dom';
import { String } from 'aws-sdk/clients/cloudhsm';
import IconButton from './IconButton.tsx';
import { PROFILE_IMGS_BUCKET } from '../config.ts';


export default function ClickProfile({ isLoggedIn, logOutFunc, connectAlgoFunc, connectPeraFunc} ) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const context: object = useContext(UserContext);
    const user: User = context['user'];

    let navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (button: String) => {
        setAnchorEl(null);
        if (button == "profile") {
            navigate("/profile");
        } else if (button == "logout") {
            logOutFunc();
            navigate("/");
        } else if (button == "algo") {
            connectAlgoFunc();
        } else if (button == "pera") {
            connectPeraFunc();
        }
    };

    // TODO: GET USER NAME

    return (
        <div>
            {isLoggedIn ? (
            <div>
                <img
                        src = {user && 'https://'+PROFILE_IMGS_BUCKET+'.s3.amazonaws.com/'+user.profileImg}
                        alt = ""
                        width = "64"
                        height = "64"
                        style = {{borderRadius: "50%"}}
                        onError={e => {
                            e.currentTarget.src = 'https://'+PROFILE_IMGS_BUCKET+'.s3.amazonaws.com/default.jpeg'
                        }}
                        onClick={handleClick}
                    />
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => handleClose("")}
                >
                    <MenuItem onClick={() => handleClose("profile")}>Profile</MenuItem>
                    <MenuItem onClick={() => handleClose("logout")}>Logout</MenuItem>
                </Menu>
            </div>
        ) : (
            <div>
                <a id='navbarLogin' onClick={handleClick}>Login</a>
                <Modal open={open} onClose={() => handleClose("")}>
                    <Sheet
                    variant="outlined"
                    sx={{
                        maxWidth: '650px',
                        width: '50vw',
                        borderRadius: 'md',
                        p: 4,
                        boxShadow: 'lg',
                    }}>
                        <Typography id='loginPopupHeader' color='green' level='h2'>Select Wallet</Typography>
                        <ModalClose />
                        <Grid id='loginPopup'>
                            <Typography id='loginPopupTop' color='white' level='h3'>
                                to tip, buy art, get tipped on your comments, become a creator or interact with the site, create or link a wallet.
                            </Typography>
                            <Grid sx={{marginBottom: '20px'}} className='loginPopupWallet' onClick={() => handleClose("pera")}>
                                <img className='walletLogo' src='/icons/pera.svg' alt='pera' />
                                <Typography level='h5'>Pera Wallet (Recommended)</Typography>
                            </Grid>
                            <Grid className='loginPopupWallet' onClick={() => handleClose("algo")}>
                                <img className='walletLogo' src='/icons/myalgo.svg' alt='myalgo' />
                                <Typography level='h5'>My Algo Wallet</Typography>
                            </Grid>
                            <Grid container justifyContent='center'>
                                <Grid container alignItems='center' justifyContent='center'>
                                    <Typography id='loginPopupBottom' color='green' level='h3'> how to set up a wallet video:</Typography>
                                    <img src='/icons/green_arrow_top_right.svg' alt='arrow' height='25px' width='25px' />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Sheet>
                </Modal>
            </div>
            )}
        </div>
                
    );

}