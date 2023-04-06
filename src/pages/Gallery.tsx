import React, {useContext, useEffect} from 'react';
import useState from 'react-usestateref'
import Navbar from "../components/Navbar.tsx";
import {UserContext} from "../App.tsx";
import {User, Episode} from '../utils/types.ts';
import styled from "styled-components";
import {AspectRatio, Box, Button, Card, Grid, IconButton, Input, Stack, Textarea, Typography} from "@mui/joy";
import {useImmer} from "use-immer";
import {enableMapSet} from "immer";
import Sheet from '@mui/joy/Sheet';
import ProfileWork from '../components/ProfileWork.tsx';
import {default as axios} from "axios";
import TwineButton from "../components/TwineButton.tsx";
import GalleryTile from "../components/GalleryTile.tsx";

interface WorkGalleryProps {
    art: boolean;
    draft: boolean;
    episodeName: string;
}

function Gallery(props: WorkGalleryProps) {

    const context: object = useContext(UserContext);
    const user: User = context['user'];

    const [view, setView] = useState(false);

    const [works, setWorks] = useState<Array<GalleryTile>>([]);

    useEffect(() => {
        if (user && user.creator && user.walletAddress) {
            axios.get('/api/work/creator/' + user.walletAddress)
                .then(response => {
                    if (response.data) {
                        var profileWorks: JSX.Element[] = [];
                        var i = 0;
                        response.data.forEach(element => {
                            profileWorks.push(<GalleryTile story={true} work={element} key={i}/>);
                            i += 1;
                        });
                        setWorks(profileWorks);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [context['user']]);

    return (
        <div>
            <Navbar/>
            <Typography level="h2" sx={{color: "#9E9FEB"}}>
                {props.episodeName ? props.episodeName : (props.draft ? "Draft" : "Published").concat(props.art ? " Art" : " Stories")}
            </Typography>
            <Box sx={{backgroundColor: "#14100E", borderRadius: 20}}>
                <Typography level="h5" sx={{color: "#9E9FEB"}}>
                    {works.length} {props.art ? "Art" : "Stories"}
                </Typography>

                <Grid
                    container
                    spacing={{xs: 3}}
                    columns={{xs: 12}}
                    sx={{flexGrow: 1}}
                >
                    {works.map((work, index) => (
                        <Grid xs={4} key={index}>
                            {work}
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <div>
                <TwineButton color='green' size='lg' icon='icons/green_plus.svg' name='Create New Story' />
            </div>
            <div>
                <TwineButton size='lg' icon='icons/paper.svg' name={"Open " + props.draft ? "Draft" : "Published"} />
            </div>
        </div>
    )
}

export default Gallery;