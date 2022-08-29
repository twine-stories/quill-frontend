import { Accounts } from '@randlabs/myalgo-connect';
import React, { useState, useContext } from 'react';
import styled from "styled-components";
import Button from './Button.tsx';
import FirstLogin from './FirstLogin.tsx';
import { UserContext } from "../App.tsx";

const NavDiv = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
`;

function Navbar() {
    const context: object = useContext(UserContext);

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
                <NavDiv>
                    <a href="/">Home</a>
                    <a href="/written">Written</a>
                    <a href="/illustrated">Illustrated</a>
                    <a href="/create">Create</a>
                    <Button name="Connect" onClick={context['connectToMyAlgo']} />
                </NavDiv>}
        </div>
    );
}

export default Navbar;