import React, {useState, useContext, useEffect} from 'react';
import Navbar from "../components/Navbar.tsx";
import {UserContext} from "../App.tsx";
import {Episode, User, Work, Pr} from '../utils/types.ts';
import {episodesGetByWorkId, genericGet, workGetByUrl} from '../utils/api.ts';
import TwoColumnLayout from "../components/TwoColumnLayout.tsx";
import {Box, Button, Stack, Switch, Typography} from "@mui/joy";
import Sheet from "@mui/joy/Sheet";
import TwineInput from "../components/TwineInput.tsx";
import TwineButton from "../components/TwineButton.tsx";
import EpisodeTile from "../components/EpisodeTile.tsx";
import { PROFILE_IMGS_BUCKET } from '../config.ts';
import IconButton from '../components/IconButton.tsx';

function Story() {

    const [work, setWork] = useState<Work>(null);
    const [episodes, setEpisodes] = useState<Array<Episode>>( []);
    const context: object = useContext(UserContext);
    const user: User = context['user'];
    const [creators, setCreators] = useState<Set<string>>(new Set());

    useEffect(() => {
        console.log(window.location.href.split('/'))
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
    }, [work]);

    useEffect(() => {
        // loop over all episodes
        for (let i = 0; i < episodes.length; i++) {
            const currEp = episodes[i];
            genericGet('/api/profitSplit/episode/' + currEp['id']).then((response) => {
                for (let j = 0; j < response.length; j++) {
                    const currSplit = response[j];
                    const tuple = [currSplit['creator'], currSplit['percentage']];
                    
                    setCreators((creators) => {
                        const newCreators = new Set(creators);
                        newCreators.add(JSON.stringify(tuple));
                        return newCreators;
                    });
                }
            });
        }
    }, [episodes]);

    useEffect(() => {
        console.log("creators", creators);
    }, [creators]);
            


    const goTo = async (link: string): Promise<void> => {
        window.open(link, '_blank');
    }

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

                            {user.walletAddress === work.creator.walletAddress &&
                                <>
                                    <TwineButton icon="/icons/purple_settings.svg" color="blackpurple" name="Edit Story" action={() => {
                                        window.location.href = '/edit/story/' + work['url'];
                                    }}/>
                                    <TwineButton icon="/icons/purple_plus.svg" color="purple" name="New Episode" action={() => {
                                        window.location.href = '/create/episode/' + work['url'];
                                    }}/>
                                </>
                            }

                            <Typography level="h2" sx={{color: "#9E9FEB"}}>Published Chapters</Typography>
                            {episodes.map((episode) => {
                                if (episode['publishStamp']) {
                                    return (
                                        <EpisodeTile episode={episode}/>
                                    )
                                }
                            })}

                            {user.walletAddress === work.creator.walletAddress &&
                                <>
                                    <Typography level="h2" sx={{color: "#9E9FEB"}}>Draft Chapters</Typography>
                                    {episodes.map((episode) => {
                                        if (!episode['publishStamp']) {
                                            return (
                                                <EpisodeTile episode={episode}/>
                                            )
                                        }
                                    })}
                                </>
                            }


                        </Box>
                    }
                </div>
            }
                             rightComponent={
                                 <div style={{backgroundColor: "#150f0e", borderRadius: "32px"}}>
                                    <Typography level="h5" sx={{color: "#9E9FEB", paddingTop: "15px", paddingLeft: "15px", fontFamily: 'Twine', fontStyle: 'normal', fontWeight: '400' }}>Creators</Typography>
                                    <div className="creator-list">
                                        {Array.from(creators).map((str_json) => {
                                            const [creator, percentage] = JSON.parse(str_json);
                                            return [creator, percentage];
                                            
                                        })
                                        .sort((a, b) => {
                                            return b[1] - a[1];
                                        
                                        }).map(([creator, percentage]) => {
                                            return (
                                                <div className="creator">
                                                    { creator &&
                                                        <Box
                                                        sx={{
                                                            py: 2,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: 1,
                                                            alignItems: 'center',
                                                            flexWrap: 'wrap',
                                                            marginTop: '-35px',
                                                            minWidth: '256px'
                                                        }}
                                                    >
                                                       <img
                                                           src = {creator && 'https://'+PROFILE_IMGS_BUCKET+'.s3.amazonaws.com/'+creator.profileImg}
                                                           alt = ""
                                                           width = "128"
                                                           height = "128"
                                                           onError={e => {
                                                               e.currentTarget.src = 'https://'+PROFILE_IMGS_BUCKET+'.s3.amazonaws.com/default.jpeg'
                                                           }}
                                                           className='profile-pic'
                                                       />
                                                        <Typography level="h4"
                                                                    sx={{color: "#E4E5FF", margin: "0px", fontFamily: 'Twine', fontStyle: 'normal', fontWeight:'400'}}>{creator['userName']}</Typography>
                                                    
                                                    <Stack direction="row" spacing = {1} alignItems= "center"  >
                                                       {creator.website && <IconButton sx = {{margin: "0px"}} color='darkpurple' icon='/icons/socials/website.svg' action={() => goTo(creator.website as string)} />}
                                                       {creator.twitter && <IconButton sx = {{margin: "0px"}} color='darkpurple' icon='/icons/socials/twitter.svg' action={() => goTo(creator.twitter as string)} />}
                                                       {creator.instagram && <IconButton sx = {{margin: "0px"}} color='darkpurple' icon='/icons/socials/instagram.svg' action={() => goTo(creator.instagram as string)} />}
                                                       {creator.reddit && <IconButton sx = {{margin: "0px"}} color='darkpurple' icon='/icons/socials/reddit.svg' action={() => goTo(creator.reddit as string)} />}
                                                       {creator.discord && <IconButton sx = {{margin: "0px"}} color='darkpurple' icon='/icons/socials/discord.svg' action={() => goTo(creator.discord as string)} />}
                                                   </Stack>
                                                    </Box>
                                                    
                                                    }

                                                </div>
                                            )})}
                                    </div>
                                 </div>
                             }
            />
        </div>
    );
}

export default Story;