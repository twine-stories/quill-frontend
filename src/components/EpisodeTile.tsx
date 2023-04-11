import React from 'react';
import {Episode, NFTCollection, Work} from '../utils/types.ts';
import {AspectRatio, Card, Typography} from "@mui/joy";

interface EpisodeTileProps {
    episode: Episode;
}

function EpisodeTile(props: EpisodeTileProps) {
    return (
        <Card variant="outlined" style={{
            backgroundColor: "#14100E",
            width:"100%",
            display: 'flex',
            flexDirection: 'row',
        }} onClick={() => {
            window.location.href = '/episode/' + props.episode['url']
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
    );
}

export default EpisodeTile;