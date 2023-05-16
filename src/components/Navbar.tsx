import React, { useState, useContext, useEffect } from 'react';
import styled from "styled-components";
import CollabPopup from './CollabPopup.tsx';
import { UserContext } from "../App.tsx";
import LoginWall from './LoginWall.tsx';
import RegisterCreator from './RegisterCreator.tsx';
import ClickProfile from './ClickProfile.tsx';
import { Autocomplete, AutocompleteOption, Typography, ListItemContent } from '@mui/joy';
import IconButton from './IconButton.tsx';
import { Work, User} from '../utils/types.ts';
import { genericGet } from '../utils/api.ts';
import { useNavigate } from 'react-router-dom';
import { StyledAutocompleteListbox } from '@mui/joy/AutocompleteListbox/AutocompleteListbox.js';

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


type dyad = {
    isWork: boolean;
    name: string;
    link: string;
}

function Navbar() {
    const context: object = useContext(UserContext);
    const [open, setOpen] = useState<boolean>(false);
    const [openCreator, setOpenCreator] = useState<boolean>(false);
    const [openCollab, setOpenCollab] = useState<boolean>(false);
    const [isSearching , setIsSearching] = useState<boolean>(false);
    const [dyads, setDyads] = useState<dyad[]>([]);

    const navigate = useNavigate();

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

    const openSearch = async () => {
        setIsSearching(true);
    } 

    const closeSearch = async () => {
        setIsSearching(false);
    }

    const onChange = async (e: React.SyntheticEvent<Element, Event>, value: string | dyad | null) => {
        console.log(value);
        if (value !== null && typeof value !== 'string') {
            navigate(value.link);
        }
    }


    useEffect(() => {
        const getDyads = async () => {
            const response1 = await genericGet('/api/published_works');
            const response2 = await genericGet('/api/users');
            const newDyads: dyad[] = [];
            if (response2){
                response2.forEach((user: User) => {
                    newDyads.push({isWork: false, name: user.userName, link: `/profile/${user.userName}`});
                });
            }
            if (response1){ 
                response1.forEach((work: Work) => {
                    newDyads.push({isWork: true, name: work.title, link: `/story/${work.url}`});
                });
            }
            
            setDyads(newDyads);

        }

        getDyads();
        
    }, []);

    const searchIcon: JSX.Element = isSearching ?
        <Autocomplete autoHighlight sx= {{width: "225px"}} options = {dyads} freeSolo={true} onClose={closeSearch} onChange={onChange} 
        getOptionLabel={(option: string | dyad) => {
            if (typeof option === 'string') {
                return option;
                } else {
                    return option.name;
                }
            }
        }
        renderOption={(props, option) => {
            return (
                <AutocompleteOption {...props}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'left', gap: '0px'}}>
                    {option.name}
                    <Typography level="body3" sx={{margin: '1px'}}>
                    {option.isWork ? "Story" : "User"}
                    </Typography>
                </div>
                </AutocompleteOption>
            )
        }}
        />
        :
        <IconButton action={openSearch} icon='/icons/search.svg' color="green" />;

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
                        {searchIcon}
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
                            <img src="/icons/twine_logo_2.svg" width="100%" />
                        </a>
                        <a href="/art">art</a>
                        <a onClick={() => setOpenCollab(true)}>collab</a>
                        <a onClick={blockAccess}>create</a>
                        {searchIcon}
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