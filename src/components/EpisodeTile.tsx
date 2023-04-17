import React from 'react';
import {Episode, NFTCollection, Work} from '../utils/types.ts';
import {AspectRatio, Card, Stack, Typography} from "@mui/joy";
import TwineButton from "./TwineButton.tsx";
import {useNavigate} from "react-router-dom";

interface EpisodeTileProps {
    episode: Episode;
}

function EpisodeTile(props: EpisodeTileProps) {
    let navigate = useNavigate();

    return (
        <Stack direction="row" spacing ={2} alignItems= "center" sx={{width: "100%"}}>
            <Card variant="outlined" style={{
                backgroundColor: "#14100E",
                width:"100%",
                display: 'flex',
                flexDirection: 'row',
            }} onClick={() => {
                navigate('/episode/' + props.episode['url'])
            }}>
                {/*<AspectRatio variant="outlined" ratio="16/9">*/}
                    <img
                        src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
                        srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"
                        loading="lazy"
                        alt=""
                    />
                {/*</AspectRatio>*/}
                <Typography level="h2" color="white">
                    {props.episode && props.episode['title']}
                </Typography>
            </Card>
            <TwineButton icon="/icons/purple_settings.svg" color="blackpurple" name="Edit Chapter" action={() => {
               navigate('/edit/episode/' + props.episode['url'])
            }}/>
        </Stack>
    );
}

export default EpisodeTile;