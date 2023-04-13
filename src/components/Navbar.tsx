import { Accounts } from '@randlabs/myalgo-connect';
import React, { useState, useContext } from 'react';
import styled from "styled-components";
import TwineButton from './TwineButton.tsx';
import { UserContext } from "../App.tsx";
import LoginWall from './LoginWall.tsx';
import RegisterCreator from './RegisterCreator.tsx';
import ClickProfile from './ClickProfile.tsx';

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
    padding-top: 1rem;

    a {
        font-family: 'Twine';
        font-style: normal;
        font-weight: 400;
        font-size: 36px;
        line-height: 100%;
        color: #a3b832;
        margin: 0 1rem;
        text-decoration: none;
        cursor: pointer;
    }

    img { 
        cursor: pointer;
    }

    #navbarLogo {
        min-width: 120px;
    }

    #navbarLogin {
        color: #9E9FEB;
    }
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
        <div style={{marginBottom: '25px'}}>
            {context['user'] && context['user']['walletAddress'] ?
                <>
                    <NavDiv>
                        <a href="/" id='navbarLogo'>
                            <img src="/icons/twine_logo_2.svg" width="80%" />
                        </a>
                        <a href="/art">art</a>
                        <a href="https://discord.gg/HKrvJrRUwJ" target = "_blank">collab</a>
                        <a onClick={createNav}>create</a>

                        <ClickProfile
                            isLoggedIn={true}
                            logOutFunc={context['logOut']}
                            connectAlgoFunc={() => {}}
                            connectPeraFunc={() => {}}
                         />
                    </NavDiv>
                    <RegisterCreator open={openCreator} close={closeCreator} updateUser={context['updateUser']} navigate={navToCreate} />
                </>
                :
                <>
                    <NavDiv>
                        <a href="/" id='navbarLogo'>
                            <img src="icons/twine_logo_2.svg" width="80%" />
                        </a>
                        <a href="/art">art</a>
                        <a onClick={blockAccess}>collab</a>
                        <a onClick={blockAccess}>create</a>
                        <ClickProfile
                            isLoggedIn={false}
                            logOutFunc={() => {}}
                            connectAlgoFunc={context['connectToMyAlgo']}
                            connectPeraFunc={context['connectToPera']}
                         />
                    </NavDiv>
                    <LoginWall open={open} closeWall={closeWall} />
                </>
            }
        </div>
    );
}

export default Navbar;