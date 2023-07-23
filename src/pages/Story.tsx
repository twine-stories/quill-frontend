import React, {useState, useContext, useEffect, createContext} from 'react';
import Navbar from "../components/Navbar.tsx";
import {UserContext} from "../App.tsx";
import {Episode, User, Work, Pr} from '../utils/types.ts';
import {episodesGetByWorkId, genericGet, genericPost, workGetByUrl} from '../utils/api.ts';
import TwoColumnLayout from "../components/TwoColumnLayout.tsx";
import {Box, Stack, Grid, Typography} from "@mui/joy";
import TwineButton from "../components/TwineButton.tsx";
import EpisodeTile from "../components/EpisodeTile.tsx";
import { PROFILE_IMGS_BUCKET } from '../config.ts';
import IconButton from '../components/IconButton.tsx';
import { useNavigate } from 'react-router-dom';

export const EpisodeOrderContext = createContext(null as any);

function Story() {

    const [work, setWork] = useState<Work>(null);
    const [episodes, setEpisodes] = useState<Array<Episode>>( []);
    const [publishedEpisodes, setPublishedEpisodes] = useState<Array<Episode>>( []);
    const context: object = useContext(UserContext);
    const user: User = context['user'];
    const [creators, setCreators] = useState<Set<string>>(new Set());

    useEffect(() => {
        workGetByUrl(window.location.href.split('/')[4], setWork, () => {
            console.log('fail');
        });
    }, []);

    useEffect(() => {
        if (work) {
            episodesGetByWorkId(work['id'], () => {
                console.log('fail');
            }).then((response) => {setEpisodes(response)})
        }
    }, [work]);

    useEffect(() => {
        var tempPublishedEpisodes = []

        // loop over all episodes
        for (let i = 0; i < episodes.length; i++) {
            const currEp = episodes[i];
            if (currEp['published']) {
                tempPublishedEpisodes.push(currEp)
            }

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
        setPublishedEpisodes(tempPublishedEpisodes)
    }, [episodes]);



    const goTo = async (link: string): Promise<void> => {
        window.open(link, '_blank');
    }

    let navigate = useNavigate();

    const goToSameTab = async (link: string): Promise<void> => {
        navigate(link);
    }

    const moveChapterUp = async (chapterNumber: number): void => {
        const lowerChapterNumberToSwap = chapterNumber - 1
        let newPublishedEpisodes: JSX.Element[] = [];
        for (let i = 0; i < publishedEpisodes.length; i++) {
            var currPubEp = publishedEpisodes[i];

            let newPubEp = currPubEp;
            if (currPubEp.episodeNumber === chapterNumber) {
                newPubEp.episodeNumber = currPubEp.episodeNumber - 1;
            } else if (currPubEp.episodeNumber === lowerChapterNumberToSwap) {
                newPubEp.episodeNumber = currPubEp.episodeNumber + 1;
            }

            genericPost("/api/episode/update", newPubEp);

            newPublishedEpisodes.push(newPubEp)
        }

        setPublishedEpisodes(newPublishedEpisodes);
    };

    const moveChapterDown = async (chapterNumber: number): void => {
        const higherChapterNumberToSwap = chapterNumber + 1
        let newPublishedEpisodes: JSX.Element[] = [];
        for (let i = 0; i < publishedEpisodes.length; i++) {
            var currPubEp = publishedEpisodes[i];

            let newPubEp = currPubEp;
            if (currPubEp.episodeNumber === chapterNumber) {
                newPubEp.episodeNumber = currPubEp.episodeNumber + 1;
            } else if (currPubEp.episodeNumber === higherChapterNumberToSwap) {
                newPubEp.episodeNumber = currPubEp.episodeNumber - 1;
            }

            genericPost("/api/episode/update", newPubEp);

            newPublishedEpisodes.push(newPubEp)
        }

        setPublishedEpisodes(newPublishedEpisodes);
    };


    const deleteDraftChapter = async (chapterId: number): void => {

    };

    return (
        <div>
            <Navbar/>
            <Grid container direction='column' alignItems='center'>
                <Grid sx={{width: '65vw'}}>
                    <TwoColumnLayout leftComponent={
                        <div>
                            {work && work.creator &&
                                <Box
                                    sx={{
                                        py: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1,
                                        alignItems: 'left',
                                        flexWrap: 'wrap'
                                    }}
                                >
                                    <Typography level="h1" sx={{color: "#E4E5FF"}}>{work['title']}</Typography>
                                    <Typography level="h6" sx={{color: "#E4E5FF"}}>{work['description']}</Typography>

                                    {(user && user.walletAddress === work.creator.walletAddress) &&
                                        <div style={{display: "flex", gap: "10px"}}>
                                            <TwineButton sx={{width: "50%"}} icon="/icons/purple_settings.svg" color="blackpurple" name="Edit Story" action={() => {
                                                window.location.href = '/edit/story/' + work['url'];
                                            }}/>
                                            {/* FYI: publishedEpisodes.length is the new chapter's number */}
                                            <TwineButton sx={{width: "50%"}}  icon="/icons/purple_plus.svg" color="purple" name="New Chapter" action={() => {
                                                window.location.href = '/create/chapter/' + work['url'] + '/' + publishedEpisodes.length;
                                            }}/>
                                        </div>
                                    }

                                    {episodes &&
                                        <>
                                            <Typography level="h2" sx={{color: "#9E9FEB"}}>Published Chapters</Typography>

                                            {
                                                <EpisodeOrderContext.Provider value={{
                                                    'moveUp': moveChapterUp,
                                                    'moveDown': moveChapterDown,
                                                    'deleteDraftChapter': deleteDraftChapter
                                                }}>
                                                    {
                                                        publishedEpisodes.toSorted((e1, e2) => {
                                                            return e1.episodeNumber - e2.episodeNumber}).map((episode) => {
                                                            return (<EpisodeTile isCreator={user && user.walletAddress === work.creator.walletAddress} episode={episode} totalEpisodes={publishedEpisodes.length}/>)
                                                        })

                                                    }
                                                </EpisodeOrderContext.Provider>
                                            }

                                            {(user && user.walletAddress === work.creator.walletAddress) &&
                                                <EpisodeOrderContext.Provider value={{
                                                    'moveUp': moveChapterUp,
                                                    'moveDown': moveChapterDown,
                                                    'deleteDraftChapter': deleteDraftChapter
                                                }}>
                                                    <Typography level="h2" sx={{color: "#9E9FEB"}}>Draft Chapters</Typography>
                                                    {episodes.map((episode) => {
                                                        if (!episode['published']) {
                                                            return (
                                                                <EpisodeTile isCreator={user && user.walletAddress === work.creator.walletAddress} episode={episode}/>
                                                            )
                                                        }
                                                    })}
                                                </EpisodeOrderContext.Provider>
                                            }
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
                                                 {creators && creators.size > 0 &&
                                                     <div>
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
                                                                                     onClick={() => goToSameTab('/profile/' + creator['userName'])}
                                                                                     style={{cursor: 'pointer'}}
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
                                                 }
                                                 {creators && creators.size === 0 &&
                                                     <div>

                                                         <div className="creator">
                                                             { work && work['creator'] &&
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
                                                                         src = {work['creator'] && 'https://'+PROFILE_IMGS_BUCKET+'.s3.amazonaws.com/'+work['creator'].profileImg}
                                                                         alt = ""
                                                                         width = "128"
                                                                         height = "128"
                                                                         onError={e => {
                                                                             e.currentTarget.src = 'https://'+PROFILE_IMGS_BUCKET+'.s3.amazonaws.com/default.jpeg'
                                                                         }}
                                                                         className='profile-pic'
                                                                         onClick={() => goToSameTab('/profile/' + work['creator']['userName'])}
                                                                         style={{cursor: 'pointer'}}
                                                                     />
                                                                     <Typography level="h4"
                                                                                 sx={{color: "#E4E5FF", margin: "0px", fontFamily: 'Twine', fontStyle: 'normal', fontWeight:'400'}}>{work['creator']['userName']} </Typography>


                                                                     <Stack direction="row" spacing = {1} alignItems= "center"  >
                                                                         {work['creator'].website && <IconButton sx = {{margin: "0px"}} color='darkpurple' icon='/icons/socials/website.svg' action={() => goTo(work['creator'].website as string)} />}
                                                                         {work['creator'].twitter && <IconButton sx = {{margin: "0px"}} color='darkpurple' icon='/icons/socials/twitter.svg' action={() => goTo(work['creator'].twitter as string)} />}
                                                                         {work['creator'].instagram && <IconButton sx = {{margin: "0px"}} color='darkpurple' icon='/icons/socials/instagram.svg' action={() => goTo(work['creator'].instagram as string)} />}
                                                                         {work['creator'].reddit && <IconButton sx = {{margin: "0px"}} color='darkpurple' icon='/icons/socials/reddit.svg' action={() => goTo(work['creator'].reddit as string)} />}
                                                                         {work['creator'].discord && <IconButton sx = {{margin: "0px"}} color='darkpurple' icon='/icons/socials/discord.svg' action={() => goTo(work['creator'].discord as string)} />}
                                                                     </Stack>
                                                                 </Box>

                                                             }

                                                         </div>
                                                     </div>

                                                 }
                                             </div>
                                         </div>
                                     }
                    />
                </Grid>
            </Grid>
        </div>
    );
}

export default Story;