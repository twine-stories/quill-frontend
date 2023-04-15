import React, {useState, useContext, useEffect} from 'react';
import Navbar from "../components/Navbar.tsx";
import {UserContext} from "../App.tsx";
import {Episode, User, Work, Like} from '../utils/types.ts';
import {episodeGetByUrl, episodesGetByWorkId, genericGet, workGetByUrl, genericPost} from '../utils/api.ts';
import TwoColumnLayout from "../components/TwoColumnLayout.tsx";
import {AspectRatio, Box, Button, Stack, Switch, Typography} from "@mui/joy";
import Sheet from "@mui/joy/Sheet";
import TwineInput from "../components/TwineInput.tsx";
import TwineButton from "../components/TwineButton.tsx";
import IconButton from "../components/IconButton.tsx";
import ReactMarkdown from 'https://esm.sh/react-markdown@7'
const DELIMITER = "🗿³¤";


function Chapter() {

    const [episode, setEpisode] = useState<Episode>([]);
    const context: object = useContext(UserContext);
    const user: User = context['user'];
    const [liked, setLiked] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            episodeGetByUrl(window.location.href.split('/')[4], setEpisode, () => {
                console.log('fail');
            });
            
            
            
            
        }
    }, [user]);

    useEffect(() => {
        if (episode && user && episode.id) {
            console.log(episode);
            console.log(user);
            const episode_str: string = String(episode.id);
            genericGet('/api/like/isLikedByUser/' + user.userName + '/' + episode_str).then((response: any) => {
                setLiked(response);
            });
        }
    }, [episode, user]);

    const likeAction = () => {
        console.log('like');
        if (user) {
            const likeObj: Like = {
                user: user,
                episode: episode
            }
            if (liked) {
                genericPost('/api/like/unlike', likeObj).then((response: any) => {
                    setLiked(false);
                });
            } else {
                genericPost('/api/like/like', likeObj).then((response: any) => {
                    setLiked(true);
                });

            }
       }
    }

    return (
        <div>
            <Navbar/>
            <TwoColumnLayout leftComponent={
                <div>
                    {episode && episode['content'] &&
                        <div>
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
                            <Typography level="h1" sx={{color: "#E4E5FF"}}>{episode['title']}</Typography>
                            <IconButton action = {likeAction} icon='/icons/heart.svg' color = "purple"/>
                            
                            <Sheet sx={{width: '50%', my: 1, borderRadius: "20px",}} color="neutral"
                                   variant="outlined">
                                {
                                    loadEpisodeContent(episode['content'])
                                }
                            </Sheet>
                            <p>{String(liked)}</p>

                        </Box>
                        
                        </div>
                    }
                </div>
            }
                             rightComponent={
                                 <div>
                                     {episode && episode['work'] && episode['work']['creator'] &&
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
                                                         sx={{color: "#E4E5FF"}}>{episode['work']['creator']['userName']}</Typography>
                                         </Box>
                                     }
                                 </div>
                             }
            />
        </div>
    );

    function loadEpisodeContent(content: string) {
        let rawContentArray = content.split(DELIMITER);
        var compoundedElements = [];
        for (let i = 0; i < rawContentArray.length; i++) {
            if (rawContentArray[i].includes("https")) {
                compoundedElements.push(
                    <AspectRatio variant="plain" minHeight="120px" maxHeight="300px" objectFit="contain"
                                 sx={{my: 2}}>
                        <img
                            src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
                            srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"
                            loading="lazy"
                            alt=""
                        />
                    </AspectRatio>)
            } else {
                compoundedElements.push(<Typography level="h6"
                                                    sx={{color: "#9E9FEB"}}><ReactMarkdown>{rawContentArray[i]}</ReactMarkdown></Typography>)
            }
        }
        return compoundedElements;
    }
}

export default Chapter;