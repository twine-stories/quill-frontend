import React, { useState, useContext, useEffect } from 'react';
import styled from "styled-components";
import CollabPopup from './CollabPopup.tsx';
import { UserContext } from "../App.tsx";
import LoginWall from './LoginWall.tsx';
import RegisterCreator from './RegisterCreator.tsx';
import ClickProfile from './ClickProfile.tsx';
import { Autocomplete, AutocompleteOption, Typography, Box } from '@mui/joy';
import IconButton from './IconButton.tsx';
import { Work, User} from '../utils/types.ts';
import { genericGet } from '../utils/api.ts';
import './Navbar.css';
import Hamburger from './Hamburger.tsx';
import Search from './Search.tsx';



const NavDiv = styled.div`
.nav-container{
  display:flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.nav-items-names{
  a{
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
      padding-left: 0px !important;;
      padding-top: 3px !important;;
    }
  }
.icon-search{
    display:flex;
    align-items: center;
}`;

// type dyad = {
//     isWork: boolean;
//     name: string;
//     link: string;
// }

function Navbar() {
    const context: object = useContext(UserContext);
    const [open, setOpen] = useState<boolean>(false);
    const [openCreator, setOpenCreator] = useState<boolean>(false);
    const [openCollab, setOpenCollab] = useState<boolean>(false);
    // const [isSearching , setIsSearching] = useState<boolean>(false);
    // const [dyads, setDyads] = useState<dyad[]>([]);
    const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
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

    
    //     setIsSearching(true);
    // } 

    // const closeSearch = async () => {
    //     setIsSearching(false);
    // }

    // const onChange = async (e: React.SyntheticEvent<Element, Event>, value: string | dyad | null) => {
    //     console.log(value);
    //     if (value !== null && typeof value !== 'string') {
    //         window.location.href = value.link;
    //     }
    // }


    // useEffect(() => {
    //     const getDyads = async () => {
    //         const response1 = await genericGet('/api/published_works');
    //         const response2 = await genericGet('/api/users');
    //         const newDyads: dyad[] = [];
    //         if (response2){
    //             response2.forEach((user: User) => {
    //                 newDyads.push({isWork: false, name: user.userName, link: `/profile/${user.userName}`});
    //             });
    //         }
    //         if (response1){ 
    //             response1.forEach((work: Work) => {
    //                 newDyads.push({isWork: true, name: work.title, link: `/story/${work.url}`});
    //             });
    //         }
            
    //         setDyads(newDyads);

    //     }

    //     getDyads();
        
    // }, []);

    // const searchIcon: JSX.Element = isSearching ?
    //     <Autocomplete autoHighlight sx= {{width: "225px"}} options = {dyads} freeSolo={true} onClose={closeSearch} onChange={onChange} 
    //     getOptionLabel={(option: string | dyad) => {
    //         if (typeof option === 'string') {
    //             return option;
    //             } else {
    //                 return option.name;
    //             }
    //         }
    //     }
    //     renderOption={(props, option) => {
    //         return (
    //             <AutocompleteOption {...props}>
    //             <div style={{display: 'flex', flexDirection: 'column', alignItems: 'left', gap: '0px'}}>
    //                 {option.name}
    //                 <Typography level="body3" sx={{margin: '1px'}}>
    //                 {option.isWork ? "Story" : "User"}
    //                 </Typography>
    //             </div>
    //             </AutocompleteOption>
    //         )
    //     }}
    //     />
    //     :
    //     <IconButton action={openSearch} icon='/icons/search.svg' color="green" />;

    return (
        <div style={{marginBottom: '25px'}}>
            {context['user'] && context['user']['walletAddress'] ?
                <>
                    <NavDiv>
                    <Box className='nav-container'>
                    {!isMenuOpen && <Hamburger/>}
                    <Box className='nav-logo'>
                        <a href="/" id='navbarLogo'>
                            <img src="/icons/twine_logo_2.svg" width="100%" />
                        </a>
                    </Box>
                    <Box className='nav-items-names'>
                        <a href="/art" style={{marginLeft:"30px"}}>art</a>
                        <a onClick={() => setOpenCollab(true)} style={{margin:"0px 40px"}}>collab</a>
                        <a onClick={createNav} style={{marginRight:"30px"}}>create</a>
                    </Box>
                    <Box className='icon-search nav-items-names'>
                    <a className="search"><Search/></a>
                        <a style={{paddingLeft:"10px",paddingTop: "10px"}}>
                            <ClickProfile
                                isLoggedIn={true}
                                logOutFunc={context['logOut']}
                                connectAlgoFunc={() => {}}
                                connectPeraFunc={() => {}}
                            />
                        </a>
                    </Box>
                    </Box>
                    </NavDiv>
                    <RegisterCreator open={openCreator} close={closeCreator} updateUser={context['updateUser']} navigate={navToCreate} />
                </>
                :
                <>
                    <NavDiv>
                        <Box className='nav-container'>
                        {!isMenuOpen && <Hamburger/>}
                        <Box className='nav-logo'>
                        <a href="/" id='navbarLogo'>
                            <img alt="" src="/icons/twine_logo_2.svg" width="100%"/>
                        </a>
                        </Box>
                        <Box className='nav-items-names'>
                        <a href="/art" style={{marginLeft:"30px"}}>art</a>
                        <a onClick={() => setOpenCollab(true)} style={{margin:"0px 40px"}}>collab</a>
                        <a onClick={blockAccess} style={{marginRight:"30px"}}>create</a>
                        </Box>
                        <Box className='icon-search nav-items-names'>
                        <a className="search"><Search/></a>
                        <a style={{padding:"0px 10px"}}>
                            < ClickProfile
                                isLoggedIn={false}
                                logOutFunc={() => {}}
                                connectAlgoFunc={context['connectToMyAlgo']}
                                connectPeraFunc={context['connectToPera']}
                            />
                        </a>
                        </Box>
                        </Box>
                    </NavDiv>
                    <LoginWall open={open} closeWall={closeWall} />
                </>
            }
            <CollabPopup open={openCollab} close={() => setOpenCollab(false)} />
        </div>
    );
}

export default Navbar;