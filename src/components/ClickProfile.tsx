import { Menu, MenuItem } from '@mui/joy';
import React, { useContext, useState, } from 'react';
import { User } from '../types';
import { UserContext } from "../App.tsx";
import { useNavigate } from 'react-router-dom';
import { String } from 'aws-sdk/clients/cloudhsm';
import TwineButton from './TwineButton.tsx';


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
                    src = "https://placehold.co/64x64"
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
                <TwineButton name = "Login" action={handleClick} />
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => handleClose("")}
                >
                    <MenuItem onClick={() => handleClose("algo")}>Login with MyAlgo</MenuItem>
                    <MenuItem onClick={() => handleClose("pera")}>Login with Pera</MenuItem>
                </Menu>
            </div>
            )}
        </div>
                
    );

}