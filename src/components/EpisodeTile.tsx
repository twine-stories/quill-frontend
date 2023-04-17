import React from 'react';
import {Episode, NFTCollection, Work} from '../utils/types.ts';
import {AspectRatio, Card, Stack, Typography} from "@mui/joy";
import TwineButton from "./TwineButton.tsx";
import {useNavigate} from "react-router-dom";
import { CHAPTER_IMGS_BUCKET } from '../config.ts';
import { COVER_PATH } from '../utils/aws.ts';

interface EpisodeTileProps {
    episode: Episode;
    isCreator : boolean;
}

function EpisodeTile(props: EpisodeTileProps) {
    let navigate = useNavigate();

    const stringToDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

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
                        src={props.episode && 'https://'+CHAPTER_IMGS_BUCKET+'.s3.amazonaws.com/'+COVER_PATH+props.episode['cover']}
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
                        }}
                        loading="lazy"
                        alt=""
                        style={{aspectRatio: "1.5/1", width: "18%", height: "18%"}}

                    />
                {/*</AspectRatio>*/}
                <div className='date-title' style={{display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'left', width: '100%'}}>
                    <Typography level="h6" color="white" sx={{marginLeft: "10px", marginTop: "0px", marginBottom: "0px"}}>
                        {props.episode && stringToDate(props.episode['publishStamp'])}
                    </Typography>
                    <Typography level="h2" color="white" sx={{marginLeft: "10px", minWidth: "600px"}}>
                        {props.episode && props.episode['title']}
                    </Typography>
                </div>
                
            </Card>
        </Stack>
    );
}

export default EpisodeTile;