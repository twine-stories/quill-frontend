import React, { useState, useContext, useEffect } from 'react'
import './Chapter.css'
import Navbar from '../components/Navbar.tsx'
import { UserContext } from '../App.tsx'
import { Episode, User, Like, ProfitSplit, Tip, Work } from '../utils/types.ts'
import { episodeGetByUrl, genericGet, genericPost } from '../utils/api.ts'
import {
    AspectRatio,
    Box,
    Typography,
    Grid,
    Link,
    CircularProgress,
} from '@mui/joy'
import IconButton from '../components/IconButton.tsx'
import { CHAPTER_DELIMETER, CHAPTER_IMG_DELIMETER } from '../utils/constants.ts'
import { CHAPTER_IMGS_BUCKET } from '../config.ts'
import CommentSection from '../components/CommentSection.tsx'
import ErrorPopup from '../components/ErrorPopup.tsx'
import SuccessPopup from '../components/SuccessPopup.tsx'
import TwineButton from '../components/TwineButton.tsx'
import { marked } from 'marked'
import TwineInput from '../components/TwineInput.tsx'
import { tip } from '../utils/blockchain/tipping.ts'
import { ConnectType } from '../utils/enums.ts'
import TwoColumnLayout from '../components/TwoColumnLayout.tsx'
import {
    microToAlgo,
    algoToMicro,
    TWINE_CUT,
} from '../utils/blockchain/constants.ts'

function Chapter() {
    const [episode, setEpisode] = useState<Episode>([])
    const [work, setWork] = useState<Work>(null)
    const [episodes, setEpisodes] = useState<Array<Episode>>([])
    const context: object = useContext(UserContext)
    const user: User = context['user']
    const [liked, setLiked] = useState<boolean>(false)
    const [numLikes, setNumLikes] = useState<number>(0)

    const [openError, setOpenError] = useState<boolean>(false)
    const [openTipError, setOpenTipError] = useState<boolean>(false)
    const [showAnimation, setShowAnimation] = useState<boolean>(false)
    const [openTipSuccess, setOpenTipSuccess] = useState<boolean>(false)

    const [processingTip, setProcessingTip] = useState<boolean>(false)

    const [collaborators, setCollaborators] = useState<JSX.Element[]>([])
    const [creators, setCreators] = useState<string[]>([])
    const [percentages, setPercentages] = useState<number[]>([])

    const [showTip, setShowTip] = useState<boolean>(false)

    useEffect(() => {
        episodeGetByUrl(window.location.href.split('/')[4], setEpisode, () => {
            console.log('fail')
        })
    }, [])

    useEffect(() => {
        if (episode && episode.id) {
            if (user) {
                const episode_str: string = String(episode.id)
                genericGet(
                    '/api/like/isLikedByUser/' +
                        user.userName +
                        '/' +
                        episode_str
                ).then((response: any) => {
                    setLiked(response)
                })
            }
            genericGet('/api/profitSplit/episode/' + episode.id).then(
                (response: ProfitSplit[]) => {
                    const sortedResp: ProfitSplit[] = response.sort(
                        (a, b) => b.percentage - a.percentage
                    )
                    let collabs: JSX.Element[] = []
                    let creators: string[] = []
                    let percentages: number[] = []
                    let index: number = 0
                    sortedResp.forEach((item: ProfitSplit) => {
                        collabs.push(
                            <Typography
                                key={index}
                                level="h3"
                                color="white"
                                onClick={() =>
                                    (window.location.href =
                                        '/profile/' + item.creator.userName)
                                }
                                sx={{ cursor: 'pointer', fontSize: '20px' }}
                            >
                                {item.creator.firstName +
                                    ' ' +
                                    item.creator.lastName}
                            </Typography>
                        )
                        creators.push(item.creator.walletAddress)
                        percentages.push(item.percentage)
                        index++
                    })
                    setCollaborators(collabs)
                    setCreators(creators)
                    setPercentages(percentages)
                }
            )
            setWork(episode.work)
        }
    }, [episode, user])

    useEffect(() => {
        if (episode && episode.id) {
            const episode_str: string = String(episode.id)
            genericGet('/api/like/numLikes/' + episode_str).then(
                (response: any) => {
                    setNumLikes(response)
                }
            )
        }
    }, [episode])

    useEffect(() => {
        if (work) {
            genericGet('/api/episode/published/work/url/' + work.url).then(
                (response: Episode[]) => {
                    let sorted = response.sort(
                        (a, b) => a.episodeNumber - b.episodeNumber
                    )
                    setEpisodes(sorted)
                }
            )
        }
    }, [work])

    const likeAction = () => {
        if (user) {
            const likeObj: Like = {
                liker: user,
                episode: episode,
            }
            if (liked) {
                setLiked(false)
                genericPost('/api/like/unlike', likeObj).then(
                    (response: any) => {
                        const episode_str: string = String(episode.id)
                        genericGet('/api/like/numLikes/' + episode_str).then(
                            (response: any) => {
                                setNumLikes(response)
                            }
                        )
                    }
                )
            } else {
                setLiked(true)
                genericPost('/api/like/like', likeObj).then((response: any) => {
                    const episode_str: string = String(episode.id)
                    genericGet('/api/like/numLikes/' + episode_str).then(
                        (response: any) => {
                            setNumLikes(response)
                        }
                    )
                })
            }
        } else {
            setOpenError(true)
        }
    }

    const moveToNextChapter = () => {
        if (episodes && episodes.length > 0) {
            const index: number = episodes.findIndex(
                (ep: Episode) => ep.id === episode.id
            )
            if (index !== -1 && index < episodes.length - 1) {
                window.location.href = episodes[index + 1].url
            }
        }
    }

    const moveToPreviousChapter = () => {
        if (episodes && episodes.length > 0) {
            const index: number = episodes.findIndex(
                (ep: Episode) => ep.id === episode.id
            )
            if (index !== -1 && index > 0) {
                window.location.href = episodes[index - 1].url
            }
        }
    }

    const prepareSuccessAnimation = () => {
        setTimeout(() => {
            setOpenTipSuccess(true)
            setShowAnimation(false)
        }, 4700)
    }

    return (
        <div>
            <Navbar />
            {episode && episode['content'] && (
                <Grid xs={12} container justifyContent="center">
                    <Grid
                        xs={12}
                        container
                        alignItems="center"
                        justifyContent="space-between"
                        className="chapter-view-container"
                    >
                        <IconButton
                            buttonClassName="left-arrow-icon"
                            icon="/icons/arrow_left.svg"
                            color="green"
                            action={moveToPreviousChapter}
                        />
                        <div className="title-block">
                            <Link
                                sx={{
                                    '&:hover': {
                                        textDecoration: 'none',
                                    },
                                }}
                                href={'/story/' + episode.work.url}
                            >
                                <Typography
                                    level="h1"
                                    color="purple"
                                    className="view-chapter-title"
                                >
                                    {episode.work.title}
                                </Typography>
                            </Link>
                            <Grid
                                container
                                alignItems="center"
                                justifyContent="flex-start"
                            >
                                <Typography
                                    className="episode-title"
                                    // sx={{ marginRight: '20px',fontSize:'15px' }}
                                    level="h3"
                                    color="white"
                                >
                                    {episode.title}
                                </Typography>
                            </Grid>
                        </div>
                        <IconButton
                            buttonClassName="right-arrow-icon"
                            icon="/icons/arrow_right.svg"
                            color="green"
                            action={moveToNextChapter}
                        />

                        <Grid
                            container
                            direction="row"
                            className="like-heart-container"
                        >
                            <IconButton
                                buttonClassName="like-heart-icon"
                                action={likeAction}
                                icon={
                                    liked
                                        ? '/icons/heart-red.svg'
                                        : '/icons/heart.svg'
                                }
                                color="purple"
                            />
                            <Typography
                                level="h6"
                                className="num-like"
                                sx={{ marginLeft: '10px' }}
                            >
                                {String(numLikes) +
                                    ' like' +
                                    (numLikes === 1 ? '' : 's')}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid xs={12} id="chapter-content">
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
                            <TwoColumnLayout
                                rightWidth="25%"
                                className="chapter-left-component"
                                leftComponent={
                                    <div>
                                        {user &&
                                            user.userName ===
                                                episode.work.creator
                                                    .userName && (
                                                <TwineButton
                                                    sx={{ width: '100%' }}
                                                    icon="/icons/green_setting.svg"
                                                    color="blackgreen"
                                                    name="Edit Chapter"
                                                    action={() => {
                                                        window.location.href =
                                                            '/edit/chapter/' +
                                                            episode.url
                                                    }}
                                                />
                                            )}
                                        <Grid xs={12}>
                                            {loadEpisodeContent(
                                                episode['content']
                                            )}
                                        </Grid>
                                    </div>
                                }
                                rightComponent={
                                    <Grid container direction="column">
                                        <TwineButton
                                            className="tip-button"
                                            icon="/icons/tip_jar.svg"
                                            color="green"
                                            name="Tip"
                                            action={() => {
                                                setShowTip(!showTip)
                                            }}
                                        />
                                        <Grid
                                            container
                                            alignItems="center"
                                            direction="column"
                                            sx={
                                                showTip
                                                    ? {
                                                          marginTop: '20px',
                                                          background: '#202020',
                                                          padding: '10px 0',
                                                          borderRadius: '15px',
                                                      }
                                                    : {
                                                          visibility: 'hidden',
                                                      }
                                            }
                                        >
                                            <img
                                                src={
                                                    showAnimation
                                                        ? '/icons/tipping-animation.gif'
                                                        : '/icons/tipping-animation-first.png'
                                                }
                                                style={{ width: '100%' }}
                                            />
                                            <Grid
                                                container
                                                alignItems="center"
                                                direction="column"
                                                sx={
                                                    showTip
                                                        ? {
                                                              marginTop: '20px',
                                                              background:
                                                                  '#202020',
                                                              padding:
                                                                  '0px 20px',
                                                              borderRadius:
                                                                  '15px',
                                                          }
                                                        : {
                                                              visibility:
                                                                  'hidden',
                                                              padding: '20px',
                                                          }
                                                }
                                            >
                                                <TwineInput
                                                    type="number"
                                                    label={
                                                        'Send tip to @' +
                                                        episode.work.creator
                                                            .userName
                                                    }
                                                    placeholder="tip amount"
                                                    inputAttrs={{
                                                        id: 'tipInput',
                                                    }}
                                                    endDecorator="/icons/algo.svg"
                                                />
                                                <TwineButton
                                                    icon="/icons/green_checkmark.svg"
                                                    sx={{ marginTop: '20px' }}
                                                    color="green"
                                                    name={
                                                        processingTip ? (
                                                            <CircularProgress
                                                                color="darkgreen"
                                                                variant="plain"
                                                            />
                                                        ) : (
                                                            'Confirm'
                                                        )
                                                    }
                                                    action={() => {
                                                        if (user) {
                                                            const tipVal =
                                                                document.getElementById(
                                                                    'tipInput'
                                                                ) as HTMLInputElement
                                                            if (
                                                                tipVal &&
                                                                tipVal.value &&
                                                                parseFloat(
                                                                    tipVal.value
                                                                ) >= 0.1
                                                            ) {
                                                                const adjustedVal: bigint =
                                                                    algoToMicro(
                                                                        parseFloat(
                                                                            tipVal.value
                                                                        )
                                                                    )
                                                                // BigInt(Math.floor(parseFloat(tipVal.value) * 1000000));
                                                                tip(
                                                                    user.walletAddress,
                                                                    creators,
                                                                    percentages,
                                                                    adjustedVal,
                                                                    user.connectType ===
                                                                        ConnectType.PERA,
                                                                    setProcessingTip
                                                                ).then(() => {
                                                                    setShowAnimation(
                                                                        true
                                                                    )
                                                                    prepareSuccessAnimation()
                                                                    tipVal.value =
                                                                        ''
                                                                    const tipObj: Tip =
                                                                        {
                                                                            tipper: user,
                                                                            episode:
                                                                                episode,
                                                                            amount:
                                                                                microToAlgo(
                                                                                    adjustedVal
                                                                                ) *
                                                                                (1.0 -
                                                                                    TWINE_CUT),
                                                                        }
                                                                    genericPost(
                                                                        '/api/tip/tip',
                                                                        tipObj
                                                                    )
                                                                })
                                                            } else {
                                                                setOpenTipError(
                                                                    true
                                                                )
                                                            }
                                                        } else {
                                                            setOpenError(true)
                                                        }
                                                        // make sure loading goes away
                                                        setProcessingTip(false)
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                }
                            />
                        </Box>
                        <Grid sx={{ marginBottom: '50px' }}>
                            <Typography level="h3" color="purple">
                                {'Creator' +
                                    (collaborators.length === 1 ? '' : 's') +
                                    ':'}
                            </Typography>
                            {collaborators}
                        </Grid>
                        <CommentSection episode={episode} />
                        <ErrorPopup
                            isOpen={openError}
                            onClose={() => setOpenError(false)}
                            message="Please log in to like, follow, or tip."
                        />
                        <ErrorPopup
                            isOpen={openTipError}
                            onClose={() => setOpenTipError(false)}
                            message="Please enter a valid tip amount."
                        />
                        <SuccessPopup
                            isOpen={openTipSuccess}
                            onClose={() => setOpenTipSuccess(false)}
                        />
                    </Grid>
                </Grid>
            )}
        </div>
    )

    function loadEpisodeContent(content: string) {
        let rawContentArray = content.split(CHAPTER_DELIMETER)
        let compoundedElements: JSX.Element[] = []
        for (let i = 0; i < rawContentArray.length; i++) {
            if (rawContentArray[i].includes(CHAPTER_IMG_DELIMETER)) {
                let imgSrc: string = rawContentArray[i].split(
                    CHAPTER_IMG_DELIMETER
                )[1]

                if (imgSrc) {
                    compoundedElements.push(
                        <Grid
                            key={i}
                            xs={12}
                            sx={{ marginBottom: '10px', marginTop: '10px' }}
                        >
                            <img
                                src={
                                    'https://' +
                                    CHAPTER_IMGS_BUCKET +
                                    '.s3.amazonaws.com/' +
                                    imgSrc
                                }
                                loading="lazy"
                                alt=""
                                className="chapter-img"
                            />
                        </Grid>
                    )
                }
            } else {
                compoundedElements.push(
                    <div key={i} className='chapter-text' dangerouslySetInnerHTML={{__html: marked.parse(rawContentArray[i])}}></div>
                )
            }
        }
        return compoundedElements
    }
}

export default Chapter
