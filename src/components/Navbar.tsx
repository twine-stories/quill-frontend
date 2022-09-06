import { Accounts } from '@randlabs/myalgo-connect';
import React, { useState, useContext } from 'react';
import styled from "styled-components";
import Button from './Button.tsx';
import FirstLogin from './FirstLogin.tsx';
import { UserContext } from "../App.tsx";
import LoginWall from './LoginWall.tsx';

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

    const blockAccess = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        setOpen(true);
    }

    const closeWall = (): void => {
        setOpen(false);
    }

    return (
        <div>
            <FirstLogin />
            {context['user'] && context['user']['walletAddress'] ?
                <NavDiv>
                    <a href="/">Home</a>
                    <a href="/written">Written</a>
                    <a href="/illustrated">Illustrated</a>
                    <a href="/create">Create</a>
                    <a href="/profile">Profile</a>
                    <Button name="Log Out" onClick={context['logOut']} />
                </NavDiv>
                :
                <>
                    <NavDiv>
                        <a href="/">Home</a>
                        <a href="/written">Written</a>
                        <a href="/illustrated">Illustrated</a>
                        <a onClick={blockAccess}>Create</a>
                        <Button name="Connect" onClick={context['connectToMyAlgo']} />
                    </NavDiv>
                    <LoginWall open={open} closeWall={closeWall} />
                </>
                }
        </div>
    );
}

export default Navbar;