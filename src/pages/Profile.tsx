import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.tsx'
import { UserContext } from '../App.tsx'
import { User } from '../utils/types.ts'
import ProfileWork from '../components/ProfileWork.tsx'
import './Profile.css'
import '../components/ProfileSidebar.tsx'
import ProfileSidebar from '../components/ProfileSidebar.tsx'
import { Stack, Typography, Grid } from '@mui/joy'
import { PROFILE_IMGS_BUCKET } from '../config.ts'
import IconButton from '../components/IconButton.tsx'
import TwineButton from '../components/TwineButton.tsx'
import RegisterCreator from '../components/RegisterCreator.tsx'
import GalleryTile from '../components/GalleryTile.tsx'
import { proxy } from '../utils/api.ts'

const axios = require('axios').default

function Profile() {
    const [works, setWorks] = useState<Array<ProfileWork>>()
    const context: object = useContext(UserContext)
    const user: User = context['user']
    const [openCreator, setOpenCreator] = useState<boolean>(false)

    useEffect(() => {
        if (user && user.creator && user.walletAddress) {
            axios
                .get(proxy + '/api/work/creator/' + user.walletAddress)
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
    }, [context['user']])

    let navigate = useNavigate()

    const createNav = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        console.log('clicked')
        if (context['user']['creator']) {
            navToCreate()
        } else {
            setOpenCreator(true)
        }
    }

    const navToCreate = () => {
        setOpenCreator(false)
        navigate('/gallery/story/draft')
    }

    const closeCreator = (): void => {
        setOpenCreator(false)
    }

    const editProfile = () => {
        navigate('/edit-profile')
    }

    const goTo = async (link: string): Promise<void> => {
        window.open(link, '_blank')
    }

    return (
        <div className="profile">
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
                                className="edit-profile-class"
                                icon="/icons/Setting.svg"
                                action={editProfile}
                                color="purple"
                                name="Edit Profile"
                                sx={{ width: '85%', marginLeft: '0px' }}
                            />
                            <TwineButton
                                className="bell-class"
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
                                            goTo("https://" + (user.website as String))
                                        }
                                    />
                                )}
                                {user && user.twitter && (
                                    <IconButton
                                        color="darkpurple"
                                        icon="/icons/socials/twitter.svg"
                                        action={() =>
                                            goTo("https://twitter.com/" + (user.twitter as String))
                                        }
                                    />
                                )}
                                {user && user.instagram && (
                                    <IconButton
                                        color="darkpurple"
                                        icon="/icons/socials/instagram.svg"
                                        action={() =>
                                            goTo("https://instagram.com/" + (user.instagram as String))
                                        }
                                    />
                                )}
                                {user && user.reddit && (
                                    <IconButton
                                        color="darkpurple"
                                        icon="/icons/socials/reddit.svg"
                                        action={() =>
                                            goTo("https://reddit.com/u/" + (user.reddit as string))
                                        }
                                    />
                                )}
                                {user && user.discord && (
                                    <IconButton
                                        color="darkpurple"
                                        icon="/icons/socials/discord.svg"
                                        action={() =>
                                            goTo("https://discord.gg/" + (user.discord as string))
                                        }
                                    />
                                )}
                            </Stack>
                        </div>
                    </div>
                    <ProfileSidebar goToDrafts={createNav} />
                    <RegisterCreator
                        open={openCreator}
                        close={closeCreator}
                        updateUser={context['updateUser']}
                        navigate={navToCreate}
                    />
                </div>
                <div className="works">
                    {works && (
                        <div>
                            <div className="works-header">
                                <Typography color="purple" level="h2">
                                    {works.length +
                                        ' ' +
                                        (works.length === 1
                                            ? 'Story'
                                            : 'Stories')}
                                </Typography>
                            </div>
                            <Grid
                                container
                                spacing={{ xs: 2 }}
                                columns={{ xs: 1, sm: 6, md: 3, lg: 4, xl: 8 }}
                                className="works-list"
                            >
                                {works &&
                                    works.map((work, index) => {
                                        return (
                                            <Grid
                                                md={1}
                                                xl={1}
                                                lg={1}
                                                sm={2}
                                                key={index}
                                            >
                                                <GalleryTile
                                                    work={work.props.work}
                                                    story={true}
                                                />
                                            </Grid>
                                        )
                                    })}
                            </Grid>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// some changes

export default Profile
