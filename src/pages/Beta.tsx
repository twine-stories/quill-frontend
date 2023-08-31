import React, { BaseSyntheticEvent, useContext, useState } from 'react'
import { Grid, Typography, Stack, Box } from '@mui/joy'
import TwineButton from '../components/TwineButton.tsx'
import { UserContext } from '../App.tsx'
import TwineInput from '../components/TwineInput.tsx'
import IconButton from '../components/IconButton.tsx'
import { genericPost } from '../utils/api.ts'
import SuccessPopup from '../components/SuccessPopup.tsx'
import ClickProfile from '../components/ClickProfile.tsx'
import './Beta.css'

function Beta() {
    const [openPopup, setOpenPopup] = useState<Boolean>(false)

    const context: object = useContext(UserContext)

    const submitMailingListInput = () => {
        genericPost(
            '/api/mailingList/add/' +
                (document.getElementById('mailing-list') as HTMLInputElement)
                    .value,
            {}
        )
        ;(document.getElementById('mailing-list') as HTMLInputElement).value =
            ''
        setOpenPopup(true)
    }

    return (
        <Grid
            container
            alignItems="center"
            justifyContent="space-around"
            sx={{ minWidth: '360px', width: '100%' }}
        >
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="space-around"
                xs={10}
                columns={1}
                sx={{ margin: '0px 0px 60px', width: '100%' }}
            >
                <img
                    className="logo-twine"
                    src="/icons/TwineLogo.png"
                    width="45%"
                    style={{ margin: '75px' }}
                />
                <Typography
                    color="green"
                    level="h1"
                    sx={{ marginBottom: '20px' }}
                >
                    We Create Worlds
                </Typography>
                <Grid sx={{ position: 'relative' }} id="early-access">
                    <ClickProfile
                        isLoggedIn={false}
                        logOutFunc={() => {}}
                        connectAlgoFunc={
                            context['connectToMyAlgo']
                        }
                        connectPeraFunc={
                            context['connectToPera']
                        }
                        displayText="enter site with early access pass"
                        checkForPass={true}
                    />
                </Grid>

                <Grid
                    container
                    rowSpacing={3}
                    direction="column"
                    sx={{
                        maxWidth: '450px',
                        minWidth: '350px',
                        width: '30vw',
                        justifyContent: 'center',
                    }}
                    className="beta-field-container"
                >
                    <Grid
                        container
                        alignItems="center"
                        justifyContent="center"
                        sx={{ marginTop: '20px' }}
                    >
                        <Typography level="h4" color="white">
                            Sign Up for Early Access
                        </Typography>
                    </Grid>
                    <Grid sx={{ position: 'relative' }} className="beta-field">
                        <TwineInput
                            sx={{ position: 'relative', fontFamily: 'Oxanium' }}
                            placeholder="Enter email..."
                            inputAttrs={{
                                onKeyDown: (e: BaseSyntheticEvent) => {
                                    if (e.nativeEvent['keyCode'] === 13) {
                                        submitMailingListInput()
                                    }
                                },
                                id: 'mailing-list',
                            }}
                        ></TwineInput>
                    </Grid>
                    <Grid>
                        <TwineButton
                            sx={{
                                width: '140px',
                                height: '45px',
                                borderRadius: '20px',
                                padding: '24px',
                                fontSize: '14px',
                                marginBottom: '40px',
                            }}
                            color="green"
                            size="lg"
                            name="Sign Up"
                            action={submitMailingListInput}
                        />
                    </Grid>
                </Grid>

                <iframe
                    style={{
                        borderRadius: '5px',
                        border: 'none',
                        height: '30vw',
                        width: '50vw',
                        maxWidth: '900px',
                        maxHeight: '540px',
                        minWidth: '350px',
                        minHeight: '210px',
                        padding: '15px',
                        margin: '30px 0px',
                        borderRadius: '15px',
                        border: '1px solid #241D19',
                        justifyContent: 'center',
                    }}
                    src="https://www.youtube.com/embed/tHqrUH23_dU"
                    className="i-frame"
                ></iframe>

                <Stack
                    className="stack-icon-button"
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ alignSelf: 'left', marginTop: '50px' }}
                >
                    <IconButton
                        color="darkpurple"
                        icon="/icons/socials/twitter.svg"
                        action={() =>
                            window.open(
                                'https://twitter.com/TwineStories',
                                '_blank'
                            )
                        }
                    />
                    <IconButton
                        color="darkpurple"
                        icon="/icons/socials/instagram.svg"
                        action={() =>
                            window.open(
                                'https://www.instagram.com/twine_stories/',
                                '_blank'
                            )
                        }
                    />
                    <IconButton
                        color="darkpurple"
                        icon="/icons/socials/discord.svg"
                        action={() =>
                            window.open(
                                'https://discord.com/invite/HKrvJrRUwJ',
                                '_blank'
                            )
                        }
                    />
                </Stack>
            </Grid>

            <SuccessPopup
                isOpen={openPopup}
                onClose={() => setOpenPopup(false)}
            />
        </Grid>
    )
}

export default Beta
