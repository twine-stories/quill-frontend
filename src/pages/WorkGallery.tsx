import React, {useContext, useEffect} from 'react';
import useState from 'react-usestateref'
import Navbar from "../components/Navbar.tsx";
import {UserContext} from "../App.tsx";
import {User, Episode} from '../utils/types.ts';
import styled from "styled-components";
import {AspectRatio, Box, Button, Card, IconButton, Input, Stack, Textarea, Typography} from "@mui/joy";
import {useImmer} from "use-immer";
import {enableMapSet} from "immer";
import Sheet from '@mui/joy/Sheet';
import ProfileWork from '../components/ProfileWork.tsx';
import {default as axios} from "axios";

interface WorkGalleryProps {
    draft: boolean;
}

function WorkGallery(props: WorkGalleryProps) {

    const context: object = useContext(UserContext);
    const user: User = context['user'];

    const [view, setView] = useState(false);

    const [works, setWorks] = useState<Array<ProfileWork>>();

    // useEffect(() => {
    //     if (user && user.creator && user.walletAddress) {
    //         axios.get('/api/work/creator/' + user.walletAddress)
    //             .then(response => {
    //                 if (response.data) {
    //                     var profileWorks: JSX.Element[] = [];
    //                     var i = 0;
    //                     response.data.forEach(element => {
    //                         profileWorks.push(<ProfileWork work={element} key={i} />);
    //                         i += 1;
    //                     });
    //                     setWorks(profileWorks);
    //                 }
    //             })
    //             .catch(error => {
    //                 console.error(error);
    //             });
    //     }
    // }, [context['user']]);

    return (
        <div>
            <Navbar />
            {user && <p>{user.firstName}</p>}
            {user && user.creator && works}
        </div>
    );

}

export default WorkGallery;