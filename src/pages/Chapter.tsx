import React, {useState, useContext, useEffect} from 'react';
import './Chapter.css';
import Navbar from "../components/Navbar.tsx";
import {UserContext} from "../App.tsx";
import {Episode, User, Work, Like, ProfitSplit} from '../utils/types.ts';
import {episodeGetByUrl, episodesGetByWorkId, genericGet, workGetByUrl, genericPost} from '../utils/api.ts';
import {AspectRatio, Box, Button, Stack, Switch, Typography, Grid, Link} from "@mui/joy";
import IconButton from "../components/IconButton.tsx";
import {CHAPTER_DELIMETER, CHAPTER_IMG_DELIMETER} from "../utils/constants.ts";
import { CHAPTER_IMGS_BUCKET } from '../config.ts';
import CommentSection from '../components/CommentSection.tsx';
import ErrorPopup from '../components/ErrorPopup.tsx';
import TwineButton from '../components/TwineButton.tsx';
import {marked} from 'marked';
import TwineInput from '../components/TwineInput.tsx';
import { tip } from '../utils/blockchain/tipping.ts';
import { ConnectType } from '../utils/enums.ts';

function Chapter() {

    const [episode, setEpisode] = useState<Episode>([]);
    const context: object = useContext(UserContext);
    const user: User = context['user'];
    const [liked, setLiked] = useState<boolean>(false);
    const [numLikes, setNumLikes] = useState<number>(0);

    const [openError, setOpenError] = useState<boolean>(false);

    const [collaborators, setCollaborators] = useState<JSX.Element[]>([]);
    const [creators, setCreators] = useState<string[]>([]);
    const [percentages, setPercentages] = useState<number[]>([]);

    useEffect(() => {
        episodeGetByUrl(window.location.href.split('/')[4], setEpisode, () => {
            console.log('fail');
        });
    }, []);

    useEffect(() => {
        if (episode && episode.id) {
            if (user) {
                const episode_str: string = String(episode.id);
                genericGet('/api/like/isLikedByUser/' + user.userName + '/' + episode_str).then((response: any) => {
                    setLiked(response);
                });
            }
            genericGet('/api/profitSplit/episode/' + episode.id).then((response: ProfitSplit[]) => {
                const sortedResp: ProfitSplit[] = response.sort((a,b) => b.percentage - a.percentage);
                let collabs: JSX.Element[] = [];
                let creators: string[] = [];
                let percentages: number[] = [];
                let index: number = 0;
                sortedResp.forEach((item: ProfitSplit) => {
                    collabs.push(<Typography key={index} level='h3' color='white' onClick={() => window.location.href = '/profile/' + item.creator.userName} sx={{cursor: 'pointer', fontSize: '20px'}}>{item.creator.firstName + ' ' + item.creator.lastName}</Typography>)
                    creators.push(item.creator.walletAddress);
                    percentages.push(item.percentage);
                    index++;
                })
                setCollaborators(collabs);
                setCreators(creators);
                setPercentages(percentages);
            });
        }
    }, [episode, user]);

    useEffect(() => {
        if (episode && episode.id) {
            const episode_str: string = String(episode.id);
            genericGet('/api/like/numLikes/' + episode_str).then((response: any) => {
                setNumLikes(response);
            });
        }
    });

    const likeAction = () => {
        if (user) {
            const likeObj: Like = {
                liker: user,
                episode: episode
            }
            if (liked) {
                setLiked(false);
                genericPost('/api/like/unlike', likeObj).then((response: any) => {
                    const episode_str: string = String(episode.id);
                    genericGet('/api/like/numLikes/' + episode_str).then((response: any) => {
                        setNumLikes(response);
                    });
                });
            } else {
                setLiked(true);
                genericPost('/api/like/like', likeObj).then((response: any) => {
                    const episode_str: string = String(episode.id);
                    genericGet('/api/like/numLikes/' + episode_str).then((response: any) => {
                        setNumLikes(response);
                    });
                });

            }
        } else {
            setOpenError(true);
        }
    }

    return (
        <div>
            <Navbar/>
            {episode && episode['content'] &&
            <Grid xs={12} container justifyContent='center'>
                <Grid xs={12} id='chapter-content'>
                    <Box
                        sx={{
                            py: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            alignItems: 'flex-start',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Grid xs={12} container alignItems='center' justifyContent='space-between'>
                            <Link sx={{'&:hover': {
                                'textDecoration': 'none'
                            }}} href={'/story/' + episode.work.url}><Typography level='h1' color='purple'>{episode.work.title}</Typography></Link>
                            <Grid container direction='row'>
                                <IconButton action = {likeAction} icon={liked ? '/icons/heart-red.svg' : '/icons/heart.svg'} color = "purple"/>
                                <Typography level='h6' sx={{marginLeft: '10px'}}>{String(numLikes) + ' like' + (numLikes === 1 ? '' : 's')}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container alignItems='center' justifyContent='flex-start'>
                            <Typography sx={{marginRight: '20px'}} level="h3" color='white'>{episode.title}</Typography>
                        </Grid>
                        <Grid container>
                            <TwineInput type='number' label='Tip amount:' placeholder='tip amount' inputAttrs={{id: 'tipInput'}} />
                            <TwineButton color='green' name='Confirm' action={() => {
                                if (user) {
                                    const tipVal = document.getElementById('tipInput') as HTMLInputElement;
                                    if (tipVal && tipVal.value) {
                                        tip(user.walletAddress, creators, percentages, BigInt(tipVal.value) * 1000000n, user.connectType === ConnectType.PERA);
                                    }
                                } else {
                                    // handle case where user is not logged in
                                    setOpenError(true);
                                }
                            }} />
                        </Grid>
                        {(user && user.userName === episode.work.creator.userName) &&
                            <TwineButton sx={{width: "100%"}} icon="/icons/green_setting.svg" color="blackgreen" name="Edit Chapter" action={() => {
                                window.location.href = '/edit/chapter/' + episode.url;
                            }}/>
                        }
                        <Grid xs={12}>
                            {
                                loadEpisodeContent(episode['content'])
                            }
                        </Grid>

                    </Box>
                    <Grid sx={{marginBottom: '50px'}}>
                        <Typography level='h3' color='purple'>{'Creator' + (collaborators.length === 1 ? '' : 's') + ':'}</Typography>
                        {collaborators}
                    </Grid>
                    <CommentSection episode={episode} />
                    <ErrorPopup isOpen={openError} onClose={() => setOpenError(false)} message='Please log in to like, follow, or tip.' />
                </Grid>
            </Grid>
            }
        </div>
    );

    function loadEpisodeContent(content: string) {
        let rawContentArray = content.split(CHAPTER_DELIMETER);
        let compoundedElements: JSX.Element[] = [];
        for (let i = 0; i < rawContentArray.length; i++) {
            if (rawContentArray[i].includes(CHAPTER_IMG_DELIMETER)) {
                let imgSrc: string = rawContentArray[i].split(CHAPTER_IMG_DELIMETER)[1];
                if (imgSrc) {
                    compoundedElements.push(
                        <AspectRatio key={i} variant="plain" minHeight="120px" maxHeight="300px" objectFit="contain">
                            <img
                                src={'https://' + CHAPTER_IMGS_BUCKET + '.s3.amazonaws.com/' + imgSrc}
                                loading="lazy"
                                alt=""
                            />
                        </AspectRatio>)
                }
            } else {
                // compoundedElements.push(<Typography key={i} level="h6">{marked.parse(rawContentArray[i])}</Typography>)
                compoundedElements.push(<div key={i} className='chapter-text' dangerouslySetInnerHTML={{__html: marked.parse(rawContentArray[i])}}></div>)
            }
        }
        return compoundedElements;
    }
}

export default Chapter;