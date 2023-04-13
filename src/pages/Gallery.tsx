import React, {useContext, useEffect} from 'react';
import useState from 'react-usestateref'
import Navbar from "../components/Navbar.tsx";
import {UserContext} from "../App.tsx";
import {User, Episode} from '../utils/types.ts';
import {AspectRatio, Box, Button, Card, Grid, IconButton, Input, Stack, Textarea, Typography} from "@mui/joy";
import {useImmer} from "use-immer";
import {enableMapSet} from "immer";
import Sheet from '@mui/joy/Sheet';
import ProfileWork from '../components/ProfileWork.tsx';
import {default as axios} from "axios";
import TwineButton from "../components/TwineButton.tsx";
import GalleryTile from "../components/GalleryTile.tsx";
import { genericGet } from '../utils/api.ts';
import { NFTCollection, Work } from '../utils/types.ts';

interface WorkGalleryProps {
    art: boolean;
    draft: boolean;
}

function Gallery(props: WorkGalleryProps) {

    const context: object = useContext(UserContext);
    const user: User = context['user'];

    const [view, setView] = useState(false);

    const [galleryItems, setGalleryItems] = useState<Array<GalleryTile>>([]);

    useEffect(() => {
        if (user && user.creator && user.walletAddress) {
            let profileWorks: JSX.Element[] = [];
            let i = 0;
            const fetchAndSet = async () => {
                if (props.art) {
                    const response: NFTCollection[] = await genericGet('/api/collection/active/creator/' + user.walletAddress);
                    response.forEach((elem: NFTCollection) => {
                        profileWorks.push(<GalleryTile story={false} coll={elem} key={1} />)
                    });
                } else {
                    const response: Work[] = await genericGet('/api/work/creator/' + user.walletAddress);
                    response.forEach((element: Work) => {
                        if ((element.publishStamp && !props.draft) || (!element.publishStamp && props.draft)) {
                            profileWorks.push(<GalleryTile story={true} work={element} key={i}/>);
                        }
                        i += 1;
                    });
                }
            }

            fetchAndSet().then(() => {
                setGalleryItems(profileWorks);
            });
        }
    }, [context['user']]);

    return (
        <div>
            <Navbar/>
            <Typography level="h2" sx={{color: "#9E9FEB"}}>
                {props.episodeName ? props.episodeName : (props.draft ? "Draft" : "Published").concat(props.art ? " Collections" : " Stories")}
            </Typography>
            <Box sx={{backgroundColor: "#14100E", padding: '10px', marginBottom: '30px'}}>
                <Typography level="h5" sx={{color: "#9E9FEB"}}>
                    {galleryItems.length} {galleryItems.length === 1 ? (props.art ? "Collection" : "Story") : (props.art ? "Collections" : "Stories")}
                </Typography>

                <Grid
                    container
                    spacing={{xs: 3}}
                    columns={{xs: 12}}
                    sx={{flexGrow: 1, padding: '20px'}}
                >
                    {galleryItems.map((galleryTile, index) => (
                        <Grid xs={4} key={index}>
                            {galleryTile}
                        </Grid>
                    ))}
                </Grid>
            </Box>
            {props.art ?
                <div>
                    <div>
                        <TwineButton color='green' size='lg' icon='/icons/green_plus.svg' name='Create One Art' />
                    </div>
                    <div>
                        <TwineButton color='green' size='lg' icon='/icons/green_plus.svg' name='Publish Art Collection' />
                    </div>
                    <div>
                        <TwineButton size='lg' icon='/icons/purple_paper.svg' name={"Open " + props.draft ? "Draft" : "Published"} />
                    </div>
                </div>
                :
                <div>
                    <div>
                        <TwineButton color='green' size='lg' icon='/icons/green_plus.svg' name='Create New Stories' />
                    </div>
                    <div>
                        <TwineButton size='lg' icon='/icons/purple_paper.svg' name={"Open " + props.draft ? "Draft" : "Published"} />
                    </div>
                </div>
            }
        </div>
    )
}

export default Gallery;