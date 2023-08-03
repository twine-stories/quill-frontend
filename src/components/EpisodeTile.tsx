import React, {useContext} from 'react';
import {Episode, NFTCollection, Work} from '../utils/types.ts';
import {AspectRatio, Card, IconButton, Stack, Typography} from "@mui/joy";
import TwineButton from "./TwineButton.tsx";
import {useNavigate} from "react-router-dom";
import { CHAPTER_IMGS_BUCKET } from '../config.ts';
import { COVER_PATH } from '../utils/aws.ts';
import {EpisodeOrderContext} from "../pages/Story.tsx";

interface EpisodeTileProps {
    episode: Episode;
    isCreator : boolean;
    totalEpisodes?: number;
}

function EpisodeTile(props: EpisodeTileProps) {
    const context: object = useContext(EpisodeOrderContext);
    const moveUp: (id: number) => void = context['moveUp'];
    const moveDown: (id: number) => void = context['moveDown'];
    const deleteDraftChapter: (id: number) => void = context['deleteDraftChapter'];

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
                navigate('/chapter/' + props.episode['url'])
            }}>
                {/*<AspectRatio variant="outlined" ratio="16/9">*/}
                    <img
                        src={props.episode && 'https://'+CHAPTER_IMGS_BUCKET+'.s3.amazonaws.com/'+COVER_PATH+props.episode['cover']}
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
                        }}
                        loading="lazy"
                        alt=""
                        style={{aspectRatio: "1.5/1", width: "18%", height: "18%", objectFit: 'cover'}}

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
            {props.isCreator &&
            
                <Stack direction="column" alignItems= "center">
                {props.episode.episodeNumber !== -1 && props.episode.episodeNumber !== 0 &&
                    <IconButton onClick={function () {
                        moveUp(props.episode.episodeNumber)
                    }} variant="plain" color="neutral" sx={{ml: 'auto', '&:hover':{
                        backgroundColor:'#0d0603'
                    }}}><div className='arrowButton'><img className='arrowUpImg1' alt='arrowimg' src="/icons/hover-purple-arrow-up.svg"
                    width="30px" height="30px"/><img className='arrowUpImg2' alt='arrowimg' src="/icons/purple_arrow_up.svg"
                    width="30px" height="30px"/> </div></IconButton>
                }
                {props.episode.episodeNumber !== -1 && props.episode.episodeNumber !== props.totalEpisodes - 1 &&
                    <IconButton onClick={function () {
                        moveDown(props.episode.episodeNumber)
                    }} variant="plain" color="neutral" sx={{ml: 'auto', '&:hover':{
                        backgroundColor:'#0d0603'
                    }}}><img className='arrowButtonDown1' alt='arrowimg' src="/icons/purple_arrow_down.svg"
                    width="30px" height="30px"/><img className='arrowButtonDown2' alt='arrowimg' src="/icons/hover-purple-arrow-down.svg"
                    width="30px" height="30px"/></IconButton>
                }
            </Stack>
            }
            <Stack direction="column" alignItems= "center">
            {props.episode.episodeNumber === -1 &&
                <IconButton onClick={function () {
                    deleteDraftChapter(props.episode.id)
                }} variant="plain" color="neutral" sx={{ml: 'auto'}}><img src="/icons/red_remove.svg"
                                                                          width="30px" height="30px"/></IconButton>
            }
            </Stack>
        </Stack>
    );
}

export default EpisodeTile;