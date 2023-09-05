import React, { useState, useContext, useEffect } from 'react'
import styled from 'styled-components'
import CollabPopup from '../CollabPopup.tsx'
import { UserContext } from '../../App.tsx'
import LoginWall from '../LoginWall.tsx'
import RegisterCreator from '../RegisterCreator.tsx'
import ClickProfile from '../ClickProfile.tsx'
import { Box } from '@mui/joy'
import '../layout/Navbar.css'
import Hamburger from '../Hamburger.tsx'
import Search from '../Search.tsx'

const NavDiv = styled.div`
    .nav-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
    }
    .nav-items-names {
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
    }
    @media screen and (max-width: 800px) and (min-width: 300px) {
        .nav-items-names a {
            font-size: 30px;
            margin-left: 5px !important;
            margin-right: 5px !important;
            padding-left: 0px !important;
            padding-top: 3px !important;
        }
    }
    .icon-search {
        display: flex;
        align-items: center;
    }
`

function Navbar({isViewChapterPage}) {
    const context: object = useContext(UserContext)
    const [open, setOpen] = useState<boolean>(false)
    const [openCreator, setOpenCreator] = useState<boolean>(false)
    const [openCollab, setOpenCollab] = useState<boolean>(false)
    const [isMenuOpen, setMenuOpen] = useState<boolean>(false)
    const blockAccess = (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        e.preventDefault()
        setOpen(true)
    }

    const createNav = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        if (context['user']['creator']) {
            navToCreate()
        } else {
            setOpenCreator(true)
        }
    }

    const navToCreate = () => {
        setOpenCreator(false)
        window.location.href = '/create'
    }

    const closeWall = (): void => {
        setOpen(false)
    }

    const closeCreator = (): void => {
        setOpenCreator(false)
    }

    return (
        <div style={{ marginBottom: '25px' }}>
            {context['user'] && context['user']['walletAddress'] ? (
                <>
                    <NavDiv>
                        <Box className="nav-container">
                            {!isMenuOpen && <Hamburger isViewChapterPage={isViewChapterPage} />}
                            <Box className="nav-logo">
                                <a href="/" id="navbarLogo">
                                    <img
                                        src="/icons/twine_logo_3.svg"
                                        width="100%"
                                    />
                                </a>
                            </Box>
                            <Box className="nav-items-names">
                                <a href="/art" style={{ marginLeft: '30px' }}>
                                    art
                                </a>
                                <a
                                    onClick={() => setOpenCollab(true)}
                                    style={{ margin: '0px 40px' }}
                                >
                                    collab
                                </a>
                                <a
                                    onClick={createNav}
                                    style={{ marginRight: '30px' }}
                                >
                                    create
                                </a>
                            </Box>
                            <Box className="icon-search nav-items-names">
                                <a className="search">
                                    <Search />
                                </a>
                                <a
                                    style={{
                                        paddingLeft: '10px',
                                        paddingTop: '10px',
                                    }}
                                >
                                    <ClickProfile
                                        isLoggedIn={true}
                                        logOutFunc={context['logOut']}
                                        connectAlgoFunc={async () => {}}
                                        connectPeraFunc={async () => {}}
                                        checkForPass={false}
                                    />
                                </a>
                            </Box>
                        </Box>
                    </NavDiv>
                    <RegisterCreator
                        open={openCreator}
                        close={closeCreator}
                        updateUser={context['updateUser']}
                        navigate={navToCreate}
                    />
                </>
            ) : (
                <>
                    <NavDiv>
                        <Box className="nav-container">
                            {!isMenuOpen && <Hamburger isViewChapterPage={isViewChapterPage} />}
                            <Box className="nav-logo">
                                <a href="/" id="navbarLogo">
                                    <img
                                        alt=""
                                        src="/icons/twine_logo_3.svg"
                                        width="80%"
                                    />
                                </a>
                            </Box>
                            <Box className="nav-items-names">
                                <a href="/art" style={{ marginLeft: '30px' }}>
                                    art
                                </a>
                                <a
                                    onClick={() => setOpenCollab(true)}
                                    style={{ margin: '0px 40px' }}
                                >
                                    collab
                                </a>
                                <a
                                    onClick={blockAccess}
                                    style={{ marginRight: '30px' }}
                                >
                                    create
                                </a>
                            </Box>
                            <Box className="icon-search nav-items-names">
                                <a className="search">
                                    <Search />
                                </a>
                                <a style={{ padding: '0px 10px' }}>
                                    <ClickProfile
                                        isLoggedIn={false}
                                        logOutFunc={() => {}}
                                        connectAlgoFunc={
                                            context['connectToMyAlgo']
                                        }
                                        connectPeraFunc={
                                            context['connectToPera']
                                        }
                                        checkForPass={false}
                                    />
                                </a>
                            </Box>
                        </Box>
                    </NavDiv>
                    <LoginWall open={open} closeWall={closeWall} />
                </>
            )}
            <CollabPopup open={openCollab} close={() => setOpenCollab(false)} />
        </div>
    )
}

export default Navbar
