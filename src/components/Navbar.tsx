import React, { useState, useContext } from 'react';
import styled from "styled-components";
import CollabPopup from './CollabPopup.tsx';
import { UserContext } from "../App.tsx";
import LoginWall from './LoginWall.tsx';
import RegisterCreator from './RegisterCreator.tsx';
import ClickProfile from './ClickProfile.tsx';

const NavDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;

    a {
        font-family: 'Twine';
        text-decoration: none;
        font-style: normal;
        font-weight: 400;
        cursor: pointer;
        font-size: 36px;
        line-height: 100%;
        color: #a3b832;
        max-width: 15vw;
    }

    #navbarLogin {
        color: #9E9FEB;
    }  
`;

function Navbar() {
    const context: object = useContext(UserContext);
    const [open, setOpen] = useState<boolean>(false);
    const [openCreator, setOpenCreator] = useState<boolean>(false);
    const [openCollab, setOpenCollab] = useState<boolean>(false);

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
                            <img src="/icons/twine_logo_2.svg" width="100%" />
                        </a>
                        <a href="/art">art</a>
                        <a onClick={() => setOpenCollab(true)}>collab</a>
                        <a onClick={createNav}>create</a>

                        <a>
                            <ClickProfile
                                isLoggedIn={true}
                                logOutFunc={context['logOut']}
                                connectAlgoFunc={() => {}}
                                connectPeraFunc={() => {}}
                            />
                        </a>
                    </NavDiv>
                    <RegisterCreator open={openCreator} close={closeCreator} updateUser={context['updateUser']} navigate={navToCreate} />
                </>
                :
                <>
                    <NavDiv>
                        <a href="/" id='navbarLogo'>
                            <img src="icons/twine_logo_2.svg" width="100%" />
                        </a>
                        <a href="/art">art</a>
                        <a onClick={() => setOpenCollab(true)}>collab</a>
                        <a onClick={blockAccess}>create</a>
                        <a>
                            <ClickProfile
                                isLoggedIn={false}
                                logOutFunc={() => {}}
                                connectAlgoFunc={context['connectToMyAlgo']}
                                connectPeraFunc={context['connectToPera']}
                            />
                        </a>
                    </NavDiv>
                    <LoginWall open={open} closeWall={closeWall} />
                </>
            }
            <CollabPopup open={openCollab} close={() => setOpenCollab(false)} />
        </div>
    );
}

export default Navbar;