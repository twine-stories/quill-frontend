import React, {useState, useContext, useEffect} from 'react';
import Navbar from "../components/Navbar.tsx";
import {UserContext} from "../App.tsx";
import {Episode, User, Work} from '../utils/types.ts';
import {episodesGetByWorkId, workGetByUrl} from '../utils/api.ts';
import TwoColumnLayout from "../components/TwoColumnLayout.tsx";
import {Box, Button, Stack, Switch, Typography} from "@mui/joy";
import Sheet from "@mui/joy/Sheet";
import TwineInput from "../components/TwineInput.tsx";
import TwineButton from "../components/TwineButton.tsx";
import EpisodeTile from "../components/EpisodeTile.tsx";

function Story() {

    const [work, setWork] = useState<Work>(null);
    const [episodes, setEpisodes] = useState<Array<Episode>>( []);
    const context: object = useContext(UserContext);
    const user: User = context['user'];

    useEffect(() => {
        if (user) {
            workGetByUrl(window.location.href.split('/')[4], setWork, () => {
                console.log('fail');
            });
        }
    }, [user]);

    useEffect(() => {
        if (work) {
            episodesGetByWorkId(work['id'], () => {
                console.log('fail');
            }).then((response) => {setEpisodes(response)})
        }
    }, [episodes, work]);

    return (
        <div>
            <Navbar/>
            <TwoColumnLayout leftComponent={
                <div>
                    {work &&
                        <Box
                            sx={{
                                py: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                alignItems: 'center',
                                flexWrap: 'wrap',
                            }}
                        >
                            <Typography level="h1" sx={{color: "#E4E5FF"}}>{work['title']}</Typography>
                            <Typography level="h6" sx={{color: "#E4E5FF"}}>{work['description']}</Typography>

                            <TwineButton icon="/icons/purple_settings.svg" color="blackpurple" name="Edit Story" action={() => {
                                window.location.href = '/edit/story/' + work['url'];
                            }}/>
                            <TwineButton icon="/icons/purple_plus.svg" color="purple" name="New Episode" action={() => {
                                window.location.href = '/create/episode/' + work['url'];
                            }}/>

                            <Typography level="h2" sx={{color: "#9E9FEB"}}>Published Chapters</Typography>
                            {episodes.map((episode) => {
                                if (episode['publishStamp']) {
                                    return (
                                        <EpisodeTile episode={episode}/>
                                    )
                                }
                            })}

                            <Typography level="h2" sx={{color: "#9E9FEB"}}>Draft Chapters</Typography>
                            {episodes.map((episode) => {
                                if (!episode['publishStamp']) {
                                    return (
                                        <EpisodeTile episode={episode}/>
                                    )
                                }
                            })}


                        </Box>
                    }
                </div>
            }
                             rightComponent={
                                 <div>
                                     {work &&
                                         <Box
                                             sx={{
                                                 py: 2,
                                                 display: 'flex',
                                                 flexDirection: 'column',
                                                 gap: 1,
                                                 alignItems: 'center',
                                                 flexWrap: 'wrap',
                                             }}
                                         >
                                             <Typography level="h5" sx={{color: "#9E9FEB"}}>Creators</Typography>
                                             <Typography level="h6"
                                                         sx={{color: "#E4E5FF"}}>{work['creator']['displayName']}</Typography>
                                         </Box>
                                     }
                                 </div>
                             }
            />
        </div>
    );
}

export default Story;