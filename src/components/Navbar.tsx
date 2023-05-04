import React, { useState, useContext, useEffect } from 'react';
import styled from "styled-components";
import CollabPopup from './CollabPopup.tsx';
import { UserContext } from "../App.tsx";
import LoginWall from './LoginWall.tsx';
import RegisterCreator from './RegisterCreator.tsx';
import ClickProfile from './ClickProfile.tsx';
import { Autocomplete } from '@mui/joy';
import IconButton from './IconButton.tsx';
import { Work } from '../utils/types.ts';
import { genericGet } from '../utils/api.ts';
import { useNavigate } from 'react-router-dom';

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
    const [isSearching , setIsSearching] = useState<boolean>(false);
    const [allWorks, setAllWorks] = useState<Work[]>([]);
    const [workStrings, setWorkStrings] = useState<string[]>([]);
    const [mapStringToLink, setMapStringToLink] = useState<Map<string, string>>(new Map<string, string>());

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

    const onChange = async (e: React.SyntheticEvent<Element, Event>, value: string | null) => {
        console.log(value);
        if (value !== null) {
            let link: string = mapStringToLink.get(value) || "";
            if (link) {
                navigate('/story/' + link);
            }
        }
    }


    useEffect(() => {
        genericGet("/api/works").then((res) => {
            setAllWorks(res);
            let workNames: string[] = [];
            let map: Map<string, string> = new Map<string, string>();
            res.forEach((work: Work) => {
                workNames.push(work.title);
                map.set(work.title, work.url);
            });
            setWorkStrings(workNames);
            setMapStringToLink(map);

        });

    }, []);

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
                        {
                            isSearching ?
                            <Autocomplete options = {workStrings}  freeSolo={true} onClose={closeSearch} onChange={onChange}
                            />
                            :
                            <IconButton action={openSearch} icon='/icons/search.svg' color="green" />
                        }
                        
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