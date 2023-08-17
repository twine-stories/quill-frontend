import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.tsx'
import { UserContext } from '../App.tsx'
import { User, Follow } from '../utils/types.ts'
import ProfileWork from '../components/ProfileWork.tsx'
import '../components/ProfileSidebar.tsx'
import ProfileSidebar from '../components/ProfileSidebar.tsx'
import { Button, Typography, Stack, Grid } from '@mui/joy'
import { genericGet, genericPost } from '../utils/api.ts'
import { PROFILE_IMGS_BUCKET } from '../config.ts'
import IconButton from '../components/IconButton.tsx'
import TwineButton from '../components/TwineButton.tsx'
import RegisterCreator from '../components/RegisterCreator.tsx'
import './GenericProfile.css'
import GalleryTile from '../components/GalleryTile.tsx'
import { proxy } from '../utils/api.ts'

const axios = require('axios').default

function GenericProfile() {
    const [works, setWorks] = useState<Array<ProfileWork>>([])
    const context: object = useContext(UserContext)
    const { username } = useParams()
    // Get user from params
    const [user, setUser] = useState<User>()
    const [isFollowing, setIsFollowing] = useState<boolean>(false)

    const viewingUser: User = context['user']

    let navigate = useNavigate()

    const goTo = async (link: string): Promise<void> => {
        window.open(link, '_blank')
    }

    useEffect(() => {
        genericGet('/api/user/name/' + username).then((response: User) => {
            setUser(response)
        })
    }, [])

    useEffect(() => {
        if (user && user.creator && user.walletAddress) {
            axios
                .get(
                    proxy + '/api/work/creator/published/' + user.walletAddress
                )
                .then((response) => {
                    if (response.data) {
                        var profileWorks: JSX.Element[] = []
                        var i = 0
                        response.data.forEach((element) => {
                            profileWorks.push(
                                <ProfileWork work={element} key={i} />
                            )
                            i += 1
                        })
                        setWorks(profileWorks)
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
        }

        if (viewingUser && user) {
            genericGet(
                '/api/follow/isFollowing/' +
                    viewingUser.userName +
                    '/' +
                    user.userName
            ).then((response: any) => {
                if (response) {
                    setIsFollowing(true)
                } else {
                    setIsFollowing(false)
                }
            })
        }
    }, [user])

    const follow = () => {
        if (user && viewingUser) {
            const follow: Follow = {
                follower: viewingUser,
                followee: user,
            }

            if (isFollowing) {
                genericPost('/api/follow/unfollow/', follow).then(
                    (response: any) => {
                        setIsFollowing(false)
                    }
                )
            } else {
                genericPost('/api/follow/follow/', follow).then(
                    (response: any) => {
                        setIsFollowing(true)
                    }
                )
            }
        }
    }

    return (
        <div>
            <Navbar />
            <div className="profile-page">
                <div className="profile-info">
                    <img
                        src={
                            user &&
                            'https://' +
                                PROFILE_IMGS_BUCKET +
                                '.s3.amazonaws.com/' +
                                user.profileImg
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
                    />
                    <div className="name-username">
                        <Typography color="white" level="h4">
                            @{user && user.userName}
                        </Typography>
                        <Typography color="purple" level="h1">
                            {user && user.firstName} {user && user.lastName}
                        </Typography>
                        <div className="edit-notif">
                            <TwineButton
                                icon="/icons/Union.svg"
                                action={follow}
                                color="purple"
                                name={isFollowing ? 'Unfollow' : 'Follow'}
                                sx={{ width: '85%', marginLeft: '0px' }}
                            />
                            <TwineButton
                                icon="/icons/bell.svg"
                                color="darkpurple"
                                name=""
                                sx={{ width: '15%' }}
                                name="0"
                            />
                        </div>
                        <Typography color="white" level="h6">
                            {user && user.description}
                        </Typography>
                        <div className="socials">
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                sx={{ marginTop: '15px' }}
                            >
                                {user && user.website && (
                                    <IconButton
                                        color="darkpurple"
                                        icon="/icons/socials/website.svg"
                                        action={() =>
                                            goTo(user.website as string)
                                        }
                                    />
                                )}
                                {user && user.twitter && (
                                    <IconButton
                                        color="darkpurple"
                                        icon="/icons/socials/twitter.svg"
                                        action={() =>
                                            goTo(user.twitter as string)
                                        }
                                    />
                                )}
                                {user && user.instagram && (
                                    <IconButton
                                        color="darkpurple"
                                        icon="/icons/socials/instagram.svg"
                                        action={() =>
                                            goTo(user.instagram as string)
                                        }
                                    />
                                )}
                                {user && user.reddit && (
                                    <IconButton
                                        color="darkpurple"
                                        icon="/icons/socials/reddit.svg"
                                        action={() =>
                                            goTo(user.reddit as string)
                                        }
                                    />
                                )}
                                {user && user.discord && (
                                    <IconButton
                                        color="darkpurple"
                                        icon="/icons/socials/discord.svg"
                                        action={() =>
                                            goTo(user.discord as string)
                                        }
                                    />
                                )}
                            </Stack>
                        </div>
                    </div>
                </div>
                <div className="works">
                    <div className="works-header">
                        <Typography color="purple" level="h2">
                            {works.length +
                                ' ' +
                                (works.length === 1 ? 'Story' : 'Stories')}
                        </Typography>
                    </div>
                    <Grid
                        container
                        spacing={{ xs: 3 }}
                        columns={{ xs: 12 }}
                        sx={{ flexGrow: 1, padding: '20px' }}
                        className="works-list"
                    >
                        {works &&
                            works.map((work, index) => {
                                return (
                                    <Grid xs={4} key={index}>
                                        <GalleryTile
                                            work={work.props.work}
                                            story={true}
                                        />
                                    </Grid>
                                )
                            })}
                    </Grid>
                </div>
            </div>
        </div>
    )
}

export default GenericProfile
