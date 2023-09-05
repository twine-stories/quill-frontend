import React, { useState, useContext, useEffect } from 'react'
import { Autocomplete, AutocompleteOption, Typography, Box } from '@mui/joy'
import styled from 'styled-components'
import { UserContext } from '../App.tsx'
import { Work, User } from '../utils/types.ts'
import LoginWall from './LoginWall.tsx'
import { genericGet } from '../utils/api.ts'
import CollabPopup from './CollabPopup.tsx'
import Button from '@mui/joy/Button'
import Menu from '@mui/joy/Menu'
import MenuItem from '@mui/joy/MenuItem'
import IconButton from './IconButton.tsx'
import './Hamburger.css'
import Search from './Search.tsx'

const Hamburger = ({isViewChapterPage}) => {
    const [openCollab, setOpenCollab] = useState<boolean>(false)
    const [openCreator, setOpenCreator] = useState<boolean>(false)
    const context: object = useContext(UserContext)
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [isMenuOpen, setMenuOpen] = useState<boolean>(false)
    const buttonRef = React.useRef(null)
    const [open, setOpen] = React.useState(false)
    const [openLogin, setOpenLogin] = React.useState(false)
    const blockAccess = (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        e.preventDefault()
        setOpenLogin(true)
    }

    const navToCreate = () => {
        setOpenCreator(false)
        window.location.href = '/create'
    }

    const createNav = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        if (context['user']['creator']) {
            navToCreate()
        } else {
            setOpenCreator(true)
        }
    }

    const openSearch = async () => {
        setIsSearching(true)
    }

    const closeWall = (): void => {
        setOpenLogin(false)
    }

    ;<IconButton
        action={openSearch}
        icon={isSearching ? 'icons/search_color.svg' : '/icons/search.svg'}
        color={isSearching ? 'litegreen' : 'green'}
    />

    return (
        <>
            <div className="parent-custom-button">
                <IconButton
                    action={() => {
                        setOpen(!open)
                    }}
                    icon={!open ? '/icons/hamburger.svg' : '/icons/cross.svg'}
                    ref={buttonRef}
                    buttonClassName="custom-button-class"
                    color="green"
                />
                <Menu
                    id="basic-menu"
                    anchorEl={buttonRef.current}
                    open={open}
                    aria-labelledby="basic-demo-button"
                    className="basics-demo-button"
                    style={{
                        top: '89px',
                        left: '1px',
                        position: 'absolute',
                        width: '95.5%',
                        paddingBottom: '20px',
                    }}
                >
                    <MenuItem style={{ outline: 'none' }}>
                        <span className="search-icon">
                            <Search />
                        </span>
                    </MenuItem>
                    <MenuItem>
                        <a href="/">home</a>
                    </MenuItem>
                    <MenuItem>
                        <a href="/art">art</a>
                    </MenuItem>
                    <MenuItem>
                        <a onClick={() => setOpenCollab(true)}>collab</a>
                    </MenuItem>

                    {context['user'] && context['user']['walletAddress'] ? (
                        <MenuItem>
                            <a
                                onClick={createNav}
                                style={{ marginRight: '30px' }}
                            >
                                create
                            </a>
                        </MenuItem>
                    ) : (
                        <MenuItem>
                            <a
                                onClick={blockAccess}
                                style={{ marginRight: '30px' }}
                            >
                                create
                            </a>
                        </MenuItem>
                    )}
                   {isViewChapterPage === true && (
                    <>
                   <MenuItem>
                        <a href="/about">About</a>
                    </MenuItem>
                    <MenuItem>
                       <a href="/feedback">Feedback</a>
                    </MenuItem>
                    <MenuItem>
                       <a href="/help">Algo Help</a>
                    </MenuItem>
                    <MenuItem>
                       <a href="/terms">Terms</a>
                    </MenuItem>
                    <MenuItem>
                    <IconButton
                        color="darkpurple"
                        icon="/icons/socials/twitter.svg"
                        action={() =>
                            window.open(
                                'https://twitter.com/twinestories',
                                '_blank'
                            )
                        }
                    />
                    <IconButton
                        color="darkpurple"
                        icon="/icons/socials/discord.svg"
                        action={() =>
                            window.open(
                                'https://discord.gg/HKrvJrRUwJ',
                                '_blank'
                            )
                        }
                    />
                    </MenuItem>
                    </>
                    )}    
                </Menu>
            </div>
            <CollabPopup open={openCollab} close={() => setOpenCollab(false)} />
            <LoginWall open={openLogin} closeWall={closeWall} />
        </>
    )
}

export default Hamburger
