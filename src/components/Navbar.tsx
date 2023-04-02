import { Accounts } from '@randlabs/myalgo-connect';
import React, { useState, useContext } from 'react';
import styled from "styled-components";
import TwineButton from './TwineButton.tsx';
import FirstLogin from './FirstLogin.tsx';
import { UserContext } from "../App.tsx";
import LoginWall from './LoginWall.tsx';
import RegisterCreator from './RegisterCreator.tsx';

interface KonvaTextEventTarget extends EventTarget {
    index: number;
}
  
interface KonvaMouseEvent extends React.MouseEvent<HTMLElement> {
    target: KonvaTextEventTarget;
}

const NavDiv = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
`;

function Navbar() {
    const context: object = useContext(UserContext);
    const [open, setOpen] = useState<boolean>(false);
    const [openCreator, setOpenCreator] = useState<boolean>(false);

    const blockAccess = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        setOpen(true);
    }

    const createNav = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        if (context['user']['creator']) {
            navToCreate();
        } else {
            setOpenCreator(true);
        }
    }

    const navToCreate = () => {
        setOpenCreator(false);
        window.location.href = '/create';
    }

    const closeWall = (): void => {
        setOpen(false);
    }

    const closeCreator = (): void => {
        setOpenCreator(false);
    }

    return (
        <div>
            <FirstLogin />
            {context['user'] && context['user']['walletAddress'] ?
                <>
                    <NavDiv>
                        <a href="/">Twine</a>
                        <a href="/art">Art</a>
                        <a onClick={createNav}>Create</a>
                        <a href="/profile">Profile</a>
                        <TwineButton name="Log Out" action={context['logOut']} />
                    </NavDiv>
                    <RegisterCreator open={openCreator} close={closeCreator} updateUser={context['updateUser']} navigate={navToCreate} />
                </>
                :
                <>
                    <NavDiv>
                        <a href="/">Twine</a>
                        <a onClick={blockAccess}>Art</a>
                        <a onClick={blockAccess}>Create</a>
                        <TwineButton name="Connect" action={context['connectToMyAlgo']} />
                        <TwineButton name="Connect Pera" action={context['connectToPera']} />
                        <TwineButton name="Mock Connect" action={context['mockConnectToMyAlgo']} />
                    </NavDiv>
                    <LoginWall open={open} closeWall={closeWall} />
                </>
            }
        </div>
    );
}

export default Navbar;