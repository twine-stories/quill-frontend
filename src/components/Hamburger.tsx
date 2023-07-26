import React, { useState, useContext, useEffect } from 'react';
import { Autocomplete, AutocompleteOption, Typography, Box } from '@mui/joy';
import styled from "styled-components";
import { UserContext } from "../App.tsx";
import { Work, User } from '../utils/types.ts';
import { genericGet } from '../utils/api.ts';
import CollabPopup from './CollabPopup.tsx';
import Button from '@mui/joy/Button';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import IconButton from './IconButton.tsx';
import "./Hamburger.css"
import Search from './Search.tsx';

// interface SearchStylingprops {
//    className?: string;
// }


// type dyad = {
//     isWork: boolean;
//     name: string;
//     link: string;
// }

const Hamburger = (props:SearchStylingprops) => {
    const [openCollab, setOpenCollab] = useState<boolean>(false);
    const [openCreator, setOpenCreator] = useState<boolean>(false);
    const context: object = useContext(UserContext);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    // const [dyads, setDyads] = useState<dyad[]>([]);
    const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
    const handleToggle = () => {
        setMenuOpen(!isMenuOpen)
        console.log("togglelisworking")
    }

    const buttonRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);

    // const handleClose = () => {
    //     setOpen(false);
    // };

    const navToCreate = () => {
        setOpenCreator(false);
        window.location.href = '/create';
    }

    const createNav = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        if (context['user']['creator']) {
            navToCreate();
        } else {
            setOpenCreator(true);
        }
    }
    const openSearch = async () => {
        setIsSearching(true);
    }

    const closeSearch = async () => {
        setIsSearching(false);
    }
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
    //         if (response2) {
    //             response2.forEach((user: User) => {
    //                 newDyads.push({ isWork: false, name: user.userName, link: `/profile/${user.userName}` });
    //             });
    //         }
    //         if (response1) {
    //             response1.forEach((work: Work) => {
    //                 newDyads.push({ isWork: true, name: work.title, link: `/story/${work.url}` });
    //             });
    //         }

    //         setDyads(newDyads);

    //     }

    //     getDyads();

    // }, []);


    // const searchIcon: JSX.Element = isSearching ?
    //     <Box display="flex">
            // <IconButton action={openSearch} icon={isSearching ? 'icons/search_color.svg'  : '/icons/search.svg'} color={isSearching ? "litegreen" : "green"} />

    //         <Autocomplete autoHighlight sx={{marginLeft:"10px",width:"73%"}} options={dyads} freeSolo={true} onClose={closeSearch} onChange={onChange}
    //             getOptionLabel={(option: string | dyad) => {
    //                 if (typeof option === 'string') {
    //                     return option;
    //                 } else {
    //                     return option.name;
    //                 }
    //             }
    //             }
    //             renderOption={(props, option) => {
    //                 return (
    //                     <>
    //                         <AutocompleteOption {...props}>
    //                             <div className="options" style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', gap: '0px'}}>
    //                                 <span style={{ color: "#9E9FEB", fontStyle: "Oxanium", fontSize: "18px", padding:'5px 10px 0px'  }}>{option.name}</span>
    //                                 <Typography level="body3" sx={{ margin: '1px' }}>
    //                                     <span style={{ color: "#9E9FEB", fontStyle: "Oxanium", fontSize: "12px",padding:'5px 10px 0px' }}>{option.isWork ? "Story" : "User"}</span>
    //                                 </Typography>
    //                             </div>
    //                         </AutocompleteOption>
    //                     </>
    //                 )
    //             }}
    //         />
    //     </Box>
    //     :
    //     <IconButton action={openSearch} icon='/icons/search.svg' color="green" />;
    <IconButton action={openSearch} icon={isSearching ? 'icons/search_color.svg'  : '/icons/search.svg'} color={isSearching ? "litegreen" : "green"} />


    return (
        <>

            <div className="parent-custom-button">

                <IconButton action={() => {
                    setOpen(!open);

                }} icon={!open ? '/icons/hamburger.svg' : '/icons/cross.svg'}
                    ref={buttonRef} buttonClassName="custom-button-class" color="green" />
                <Menu
                    id="basic-menu"
                    anchorEl={buttonRef.current}
                    open={open}
                    aria-labelledby="basic-demo-button"
                    className="basics-demo-button"
                    style={{ top: "89px", left: "1px", position: "absolute",width: "95.5%", paddingBottom:'20px'}}
                >
                    <MenuItem style={{outline:"none"}}><span className='search-icon'><Search/></span></MenuItem>
                    <MenuItem><a href="/">home</a></MenuItem>
                    <MenuItem><a href="/art">art</a></MenuItem>
                    <MenuItem><a onClick={() => setOpenCollab(true)}>collab</a></MenuItem>
                    <MenuItem><a onClick={createNav} style={{ marginRight: "30px" }}>create</a></MenuItem>
                </Menu>
            </div>
            <CollabPopup open={openCollab} close={() => setOpenCollab(false)} />
        </>
    )

}


export default Hamburger
