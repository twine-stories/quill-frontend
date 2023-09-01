import React, { useContext, useEffect, createContext } from 'react'
import useState from 'react-usestateref'
import Navbar from '../components/Navbar.tsx'
import { UserContext } from '../App.tsx'
import { Episode, User, Work } from '../utils/types.ts'
import {
    episodesGetByWorkId,
    genericGet,
    genericPost,
    workGetByUrl,
} from '../utils/api.ts'
import TwoColumnLayout from '../components/TwoColumnLayout.tsx'
import { Box, Stack, Grid, Typography } from '@mui/joy'
import TwineButton from '../components/TwineButton.tsx'
import EpisodeTile from '../components/EpisodeTile.tsx'
import {
    CHAPTER_IMGS_BUCKET,
    PROFILE_IMGS_BUCKET,
    STORY_IMGS_BUCKET,
} from '../config.ts'
import IconButton from '../components/IconButton.tsx'
import { useNavigate } from 'react-router-dom'
import { STORY_BANNER_PATH } from '../utils/aws.ts'

export const EpisodeOrderContext = createContext(null as any)

function Story() {
    const [work, setWork] = useState<Work>()
    const [episodes, setEpisodes] = useState<Array<Episode>>([])
    const [publishedEpisodes, setPublishedEpisodes] = useState<Array<Episode>>(
        []
    )
    const context: object = useContext(UserContext)
    const user: User = context['user']
    const [creators, setCreators, creatorsRef] = useState<Map<number, string>>(
        new Map()
    )

    useEffect(() => {
        workGetByUrl(window.location.href.split('/')[4], setWork, () => {
            console.log('fail')
        })
    }, [])

    useEffect(() => {
        if (work && work.id) {
            episodesGetByWorkId(work.id, () => {
                console.log('fail')
            }).then((response) => {
                setEpisodes(response)
            })
        }
    }, [work])

    useEffect(() => {
        var tempPublishedEpisodes: Episode[] = []

        // loop over all episodes
        for (let i = 0; i < episodes.length; i++) {
            const currEp = episodes[i]
            if (currEp['published']) {
                tempPublishedEpisodes.push(currEp)
            }

            genericGet('/api/profitSplit/episode/' + currEp['id']).then(
                (response) => {
                    let newCreators: Map<number, string> = new Map()
                    for (let j = 0; j < response.length; j++) {
                        const currSplit = response[j]
                        const tuple = [
                            currSplit['creator'],
                            currSplit['percentage'],
                        ]

                        newCreators.set(tuple[0].id, JSON.stringify(tuple))
                    }

                    setCreators(
                        new Map<number, string>([
                            ...creatorsRef.current,
                            ...newCreators,
                        ])
                    )
                }
            )
        }
        setPublishedEpisodes(tempPublishedEpisodes)
    }, [episodes])

    const goTo = async (link: string): Promise<void> => {
        window.open(link, '_blank')
    }

    let navigate = useNavigate()

    const goToSameTab = async (link: string): Promise<void> => {
        navigate(link)
    }

    const moveChapterUp = async (chapterNumber: number): Promise<void> => {
        const lowerChapterNumberToSwap = chapterNumber - 1
        let newPublishedEpisodes: Episode[] = []
        for (let i = 0; i < publishedEpisodes.length; i++) {
            var currPubEp = publishedEpisodes[i]

            let newPubEp = currPubEp
            if (currPubEp.episodeNumber === chapterNumber) {
                newPubEp.episodeNumber = currPubEp.episodeNumber - 1
            } else if (currPubEp.episodeNumber === lowerChapterNumberToSwap) {
                newPubEp.episodeNumber = currPubEp.episodeNumber + 1
            }

            genericPost('/api/episode/update', newPubEp)

            newPublishedEpisodes.push(newPubEp)
        }

        setPublishedEpisodes(newPublishedEpisodes)
    }

    const moveChapterDown = async (chapterNumber: number): Promise<void> => {
        const higherChapterNumberToSwap = chapterNumber + 1
        let newPublishedEpisodes: Episode[] = []
        for (let i = 0; i < publishedEpisodes.length; i++) {
            var currPubEp = publishedEpisodes[i]

            let newPubEp = currPubEp
            if (currPubEp.episodeNumber === chapterNumber) {
                newPubEp.episodeNumber = currPubEp.episodeNumber + 1
            } else if (currPubEp.episodeNumber === higherChapterNumberToSwap) {
                newPubEp.episodeNumber = currPubEp.episodeNumber - 1
            }

            genericPost('/api/episode/update', newPubEp)

            newPublishedEpisodes.push(newPubEp)
        }

        setPublishedEpisodes(newPublishedEpisodes)
    }

    const deleteDraftChapter = async (chapterId: number): Promise<void> => {
        let newEpisodes: Episode[] = []
        for (let i = 0; i < episodes.length; i++) {
            var currEp = episodes[i]
            if (currEp.id === chapterId) {
                genericPost('/api/episode/delete/' + chapterId.toString(), {})
            } else {
                newEpisodes.push(currEp)
            }
        }

        setEpisodes(newEpisodes)
    }

    return (
        <div>
            <Navbar />
            {work && work['banner'] && (
                <img
                    className="episode-tile-img"
                    id="img-episode"
                    src={
                        'https://' +
                        STORY_IMGS_BUCKET +
                        '.s3.amazonaws.com/' +
                        STORY_BANNER_PATH +
                        work['banner']
                    }
                    onError={(e) => {
                        e.target.src =
                            'https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286'
                    }}
                    loading="lazy"
                    alt=""
                    style={{
                        aspectRatio: '4.4/1',
                        width: '100%',
                        objectFit: 'cover',
                        borderRadius: '20px',
                    }}
                />
            )}
            <Grid container direction="column" alignItems="center">
                <Grid sx={{ width: '80vw' }}>
                    <TwoColumnLayout
                        className="left-components"
                        id="left-cpmponents-id"
                        leftComponent={
                            <div className="create-story-container">
                                {work && work.creator && (
                                    <Box
                                        className="parent-container"
                                        sx={{
                                            py: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1,
                                            alignItems: 'left',
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <Typography
                                            className="title-styling"
                                            level="h1"
                                            sx={{
                                                color: '#9E9FEB',
                                                margin: '0px',
                                                fontSize: '50px',
                                            }}
                                        >
                                            {work.title}
                                        </Typography>
                                        <Typography
                                            className="description-styling"
                                            level="h6"
                                            sx={{
                                                margin: '0px',
                                                textAlign: 'initial',
                                                width: '90%',
                                                marginBottom: '20px',
                                                fontSize: '17px',
                                            }}
                                        >
                                            {work.description}
                                        </Typography>

                                        {user &&
                                            user.walletAddress ===
                                                work.creator.walletAddress && (
                                                <div
                                                    className="view-story-button"
                                                    style={{ gap: '10px' }}
                                                >
                                                    <TwineButton
                                                        className="wrap-button"
                                                        sx={{
                                                            width: '45%',
                                                            padding:
                                                                '12px 24px 12px 24px',
                                                            borderRadius:
                                                                '15px',
                                                            gap: '16px',
                                                        }}
                                                        whiteSpace="nowrap"
                                                        overflow="hidden"
                                                        textOverflow="ellipsis"
                                                        icon="/icons/purple_settings.svg"
                                                        color="blackpurple"
                                                        name="Edit Story"
                                                        action={() => {
                                                            window.location.href =
                                                                '/edit/story/' +
                                                                work.url
                                                        }}
                                                    />
                                                    {/* FYI: publishedEpisodes.length is the new chapter's number */}
                                                    <TwineButton
                                                        className="wrap-button"
                                                        sx={{
                                                            width: '45%',
                                                            padding:
                                                                '12px 24px 12px 24px',
                                                            borderRadius:
                                                                '15px',
                                                            gap: '16px',
                                                        }}
                                                        whiteSpace="nowrap"
                                                        overflow="hidden"
                                                        textOverflow="ellipsis"
                                                        icon="/icons/purple_plus.svg"
                                                        color="purple"
                                                        name="Create New Chapter"
                                                        action={() => {
                                                            window.location.href =
                                                                '/create/chapter/' +
                                                                work.url +
                                                                '/' +
                                                                publishedEpisodes.length
                                                        }}
                                                    />
                                                </div>
                                            )}

                                        {episodes && (
                                            <>
                                                <Typography
                                                    className="published-chapter"
                                                    level="h3"
                                                    sx={{ color: '#9E9FEB' }}
                                                >
                                                    Chapters
                                                </Typography>

                                                {
                                                    <EpisodeOrderContext.Provider
                                                        value={{
                                                            moveUp: moveChapterUp,
                                                            moveDown:
                                                                moveChapterDown,
                                                            deleteDraftChapter:
                                                                deleteDraftChapter,
                                                        }}
                                                    >
                                                        {publishedEpisodes
                                                            .toSorted(
                                                                (
                                                                    e1,
                                                                    e2,
                                                                    idx
                                                                ) => {
                                                                    return (
                                                                        e1.episodeNumber -
                                                                        e2.episodeNumber
                                                                    )
                                                                }
                                                            )
                                                            .map(
                                                                (
                                                                    episode,
                                                                    idx
                                                                ) => {
                                                                    return (
                                                                        <EpisodeTile
                                                                            isCreator={
                                                                                user &&
                                                                                user.walletAddress ===
                                                                                    work
                                                                                        .creator
                                                                                        .walletAddress
                                                                            }
                                                                            episode={
                                                                                episode
                                                                            }
                                                                            idx={
                                                                                idx
                                                                            }
                                                                            publishedEpisodes={
                                                                                publishedEpisodes
                                                                            }
                                                                            totalEpisodes={
                                                                                publishedEpisodes.length
                                                                            }
                                                                        />
                                                                    )
                                                                }
                                                            )}
                                                    </EpisodeOrderContext.Provider>
                                                }

                                                {user &&
                                                    user.walletAddress ===
                                                        work.creator
                                                            .walletAddress && (
                                                        <EpisodeOrderContext.Provider
                                                            value={{
                                                                moveUp: moveChapterUp,
                                                                moveDown:
                                                                    moveChapterDown,
                                                                deleteDraftChapter:
                                                                    deleteDraftChapter,
                                                            }}
                                                        >
                                                            <Typography
                                                                className="draft-chapter"
                                                                level="h3"
                                                                sx={{
                                                                    color: '#9E9FEB',
                                                                }}
                                                            >
                                                                Draft Chapters
                                                            </Typography>
                                                            {episodes.map(
                                                                (episode) => {
                                                                    if (
                                                                        !episode[
                                                                            'published'
                                                                        ]
                                                                    ) {
                                                                        return (
                                                                            <EpisodeTile
                                                                                isCreator={
                                                                                    user &&
                                                                                    user.walletAddress ===
                                                                                        work
                                                                                            .creator
                                                                                            .walletAddress
                                                                                }
                                                                                episode={
                                                                                    episode
                                                                                }
                                                                            />
                                                                        )
                                                                    }
                                                                }
                                                            )}
                                                        </EpisodeOrderContext.Provider>
                                                    )}
                                            </>
                                        )}
                                    </Box>
                                )}
                            </div>
                        }
                        rightComponent={
                            <div
                                className="right-components"
                                style={{
                                    backgroundColor: '#14100E',
                                    borderRadius: '32px',
                                }}
                            >
                                <Typography
                                    level="h4"
                                    sx={{
                                        color: '#9E9FEB',
                                        padding: '20px 0px 0px 30px',
                                        fontFamily: 'Twine',
                                        fontStyle: 'normal',
                                        fontWeight: '400',
                                    }}
                                >
                                    Creators
                                </Typography>
                                <div className="creator-list">
                                    {creators && creators.size > 0 && (
                                        <div className="creater-container">
                                            {Array.from(creators.values())
                                                .map((str_json) => {
                                                    const [
                                                        creator,
                                                        percentage,
                                                    ] = JSON.parse(str_json)
                                                    return [creator, percentage]
                                                })
                                                .sort((a, b) => {
                                                    return b[1] - a[1]
                                                })
                                                .map(
                                                    ([creator, percentage]) => {
                                                        return (
                                                            <div
                                                                className="creators"
                                                                style={{
                                                                    marginBottom:
                                                                        '22px',
                                                                }}
                                                            >
                                                                {creator && (
                                                                    <Box
                                                                        className="creater-box"
                                                                        sx={{
                                                                            py: 2,
                                                                            display:
                                                                                'flex',
                                                                            flexDirection:
                                                                                'column',
                                                                            gap: 1,
                                                                            alignItems:
                                                                                'center',
                                                                            flexWrap:
                                                                                'wrap',
                                                                            padding:
                                                                                '0px',
                                                                            minWidth:
                                                                                '256px',
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={
                                                                                creator &&
                                                                                'https://' +
                                                                                    PROFILE_IMGS_BUCKET +
                                                                                    '.s3.amazonaws.com/' +
                                                                                    creator.profileImg
                                                                            }
                                                                            alt=""
                                                                            width="128"
                                                                            height="128"
                                                                            onError={(
                                                                                e
                                                                            ) => {
                                                                                e.currentTarget.src =
                                                                                    'https://' +
                                                                                    PROFILE_IMGS_BUCKET +
                                                                                    '.s3.amazonaws.com/default.jpeg'
                                                                            }}
                                                                            className="profile-pic"
                                                                            onClick={() =>
                                                                                goToSameTab(
                                                                                    '/profile/' +
                                                                                        creator[
                                                                                            'userName'
                                                                                        ]
                                                                                )
                                                                            }
                                                                            style={{
                                                                                cursor: 'pointer',
                                                                            }}
                                                                        />
                                                                        <Typography
                                                                            level="h4"
                                                                            sx={{
                                                                                color: '#E4E5FF',
                                                                                fontFamily:
                                                                                    'Twine',
                                                                                fontStyle:
                                                                                    'normal',
                                                                                fontWeight:
                                                                                    '400',
                                                                                marginTop:
                                                                                    '12px',
                                                                            }}
                                                                        >
                                                                            {
                                                                                creator[
                                                                                    'userName'
                                                                                ]
                                                                            }
                                                                        </Typography>

                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={
                                                                                1
                                                                            }
                                                                            alignItems="center"
                                                                            sx={{
                                                                                marginBottom:
                                                                                    '15px',
                                                                            }}
                                                                        >
                                                                            {creator.website && (
                                                                                <IconButton
                                                                                    sx={{
                                                                                        margin: '0px',
                                                                                    }}
                                                                                    color="darkpurple"
                                                                                    icon="/icons/socials/website.svg"
                                                                                    action={() =>
                                                                                        goTo(
                                                                                            creator.website as string
                                                                                        )
                                                                                    }
                                                                                />
                                                                            )}
                                                                            {creator.twitter && (
                                                                                <IconButton
                                                                                    sx={{
                                                                                        margin: '0px',
                                                                                    }}
                                                                                    color="darkpurple"
                                                                                    icon="/icons/socials/twitter.svg"
                                                                                    action={() =>
                                                                                        goTo(
                                                                                            creator.twitter as string
                                                                                        )
                                                                                    }
                                                                                />
                                                                            )}
                                                                            {creator.instagram && (
                                                                                <IconButton
                                                                                    sx={{
                                                                                        margin: '0px',
                                                                                    }}
                                                                                    color="darkpurple"
                                                                                    icon="/icons/socials/instagram.svg"
                                                                                    action={() =>
                                                                                        goTo(
                                                                                            creator.instagram as string
                                                                                        )
                                                                                    }
                                                                                />
                                                                            )}
                                                                            {creator.reddit && (
                                                                                <IconButton
                                                                                    sx={{
                                                                                        margin: '0px',
                                                                                    }}
                                                                                    color="darkpurple"
                                                                                    icon="/icons/socials/reddit.svg"
                                                                                    action={() =>
                                                                                        goTo(
                                                                                            creator.reddit as string
                                                                                        )
                                                                                    }
                                                                                />
                                                                            )}
                                                                            {creator.discord && (
                                                                                <IconButton
                                                                                    sx={{
                                                                                        margin: '0px',
                                                                                    }}
                                                                                    color="darkpurple"
                                                                                    icon="/icons/socials/discord.svg"
                                                                                    action={() =>
                                                                                        goTo(
                                                                                            creator.discord as string
                                                                                        )
                                                                                    }
                                                                                />
                                                                            )}
                                                                        </Stack>
                                                                    </Box>
                                                                )}
                                                            </div>
                                                        )
                                                    }
                                                )}
                                        </div>
                                    )}
                                    {creators && creators.size === 0 && (
                                        <div>
                                            <div>
                                                {work && work['creator'] && (
                                                    <Box
                                                        sx={{
                                                            py: 2,
                                                            display: 'flex',
                                                            flexDirection:
                                                                'column',
                                                            gap: 1,
                                                            alignItems:
                                                                'center',
                                                            flexWrap: 'wrap',
                                                            padding: '0px',
                                                            minWidth: '256px',
                                                        }}
                                                    >
                                                        <img
                                                            src={
                                                                work[
                                                                    'creator'
                                                                ] &&
                                                                'https://' +
                                                                    PROFILE_IMGS_BUCKET +
                                                                    '.s3.amazonaws.com/' +
                                                                    work[
                                                                        'creator'
                                                                    ].profileImg
                                                            }
                                                            alt=""
                                                            width="128"
                                                            height="128"
                                                            onError={(e) => {
                                                                e.currentTarget.src =
                                                                    'https://' +
                                                                    PROFILE_IMGS_BUCKET +
                                                                    '.s3.amazonaws.com/default.jpeg'
                                                            }}
                                                            className="profile-pic"
                                                            onClick={() =>
                                                                goToSameTab(
                                                                    '/profile/' +
                                                                        work[
                                                                            'creator'
                                                                        ][
                                                                            'userName'
                                                                        ]
                                                                )
                                                            }
                                                            style={{
                                                                cursor: 'pointer',
                                                            }}
                                                        />
                                                        <Typography
                                                            level="h4"
                                                            sx={{
                                                                color: '#E4E5FF',
                                                                margin: '0px',
                                                                fontFamily:
                                                                    'Twine',
                                                                fontStyle:
                                                                    'normal',
                                                                fontWeight:
                                                                    '400',
                                                            }}
                                                        >
                                                            {
                                                                work['creator'][
                                                                    'userName'
                                                                ]
                                                            }{' '}
                                                        </Typography>

                                                        <Stack
                                                            direction="row"
                                                            spacing={1}
                                                            alignItems="center"
                                                        >
                                                            {work['creator']
                                                                .website && (
                                                                <IconButton
                                                                    sx={{
                                                                        margin: '0px',
                                                                    }}
                                                                    color="darkpurple"
                                                                    icon="/icons/socials/website.svg"
                                                                    action={() =>
                                                                        goTo(
                                                                            work[
                                                                                'creator'
                                                                            ]
                                                                                .website as string
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                            {work['creator']
                                                                .twitter && (
                                                                <IconButton
                                                                    sx={{
                                                                        margin: '0px',
                                                                    }}
                                                                    color="darkpurple"
                                                                    icon="/icons/socials/twitter.svg"
                                                                    action={() =>
                                                                        goTo(
                                                                            work[
                                                                                'creator'
                                                                            ]
                                                                                .twitter as string
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                            {work['creator']
                                                                .instagram && (
                                                                <IconButton
                                                                    sx={{
                                                                        margin: '0px',
                                                                    }}
                                                                    color="darkpurple"
                                                                    icon="/icons/socials/instagram.svg"
                                                                    action={() =>
                                                                        goTo(
                                                                            work[
                                                                                'creator'
                                                                            ]
                                                                                .instagram as string
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                            {work['creator']
                                                                .reddit && (
                                                                <IconButton
                                                                    sx={{
                                                                        margin: '0px',
                                                                    }}
                                                                    color="darkpurple"
                                                                    icon="/icons/socials/reddit.svg"
                                                                    action={() =>
                                                                        goTo(
                                                                            work[
                                                                                'creator'
                                                                            ]
                                                                                .reddit as string
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                            {work['creator']
                                                                .discord && (
                                                                <IconButton
                                                                    sx={{
                                                                        margin: '0px',
                                                                    }}
                                                                    color="darkpurple"
                                                                    icon="/icons/socials/discord.svg"
                                                                    action={() =>
                                                                        goTo(
                                                                            work[
                                                                                'creator'
                                                                            ]
                                                                                .discord as string
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                        </Stack>
                                                    </Box>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        }
                    />
                </Grid>
            </Grid>
        </div>
    )
}

export default Story
