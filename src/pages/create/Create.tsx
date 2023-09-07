import React, { useContext, useState, createContext } from 'react'
import { UserContext } from '../../App.tsx'
import Navbar from '../../components/Navbar.tsx'
import TwineButton from '../../components/TwineButton.tsx'
import { Typography, Sheet, Stack, Grid } from '@mui/joy'
import './Create.css'

export const CollaboratorContext = createContext(null as any)

function Create() {
    const context: object = useContext(UserContext)

    const [hover, setOnHover] = useState<boolean>(false)

    if (!context['userLoaded']) {
        return <div></div>
    }

    if (!context['user'] || !context['user']['creator']) {
        window.location.href = '/'
    }

    return (
        <div className="create">
            <Navbar />
            <Typography
                level="h2"
                color="green"
                sx={{ paddingLeft: '16px', marginTop: '74px' }}
            >
                Create Stories
            </Typography>
            <Grid
                container
                direction="column"
                alignItems="flex-start"
                justifyContent="space-around"
            >
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    flexWrap="wrap"
                    width="100%"
                >
                    <Sheet color="green-dashed" variant="rounded">
                        <span
                            onMouseEnter={() => setOnHover(true)}
                            onMouseLeave={() => setOnHover(false)}
                        >
                            <TwineButton
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    paddingBlock: '2rem',
                                    paddingInline: '2.4rem',
                                    borderRadius: '15px',
                                    transition: 'background-color 0.3s ease',
                                    ':hover': {
                                        backgroundColor: '#5C720D',
                                        color: '#A3B832',
                                    },
                                }}
                                icon={
                                    hover
                                        ? '/icons/green_plus_hover.svg'
                                        : '/icons/green_plus.svg'
                                }
                                color="green"
                                name="Create Story"
                                action={() => {
                                    window.location.href = '/create/story/'
                                }}
                                paddingTop="10px"
                                className="custom-start-decorator"
                            />
                        </span>
                    </Sheet>
                    <Sheet color="green-dashed" variant="rounded">
                        <TwineButton
                            sx={{
                                margin: '0px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                paddingBlock: '2rem',
                                paddingInline: '2.4rem',
                                borderRadius: '15px',
                                transition: 'background-color 0.3s ease',
                                ':hover': {
                                    backgroundColor: '#5C720D',
                                    color: '#A3B832',
                                },
                            }}
                            icon="/icons/green_paper.svg"
                            color="blackgreen"
                            name="Published Stories"
                            action={() => {
                                window.location.href =
                                    '/gallery/story/published'
                            }}
                            paddingTop="10px"
                            className="custom-start-decorator"
                        />
                    </Sheet>
                    <Sheet color="green-dashed" variant="rounded">
                        <TwineButton
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                paddingBlock: '2rem',
                                paddingInline: '2.4rem',
                                borderRadius: '15px',
                                transition: 'background-color 0.3s ease',
                                ':hover': {
                                    backgroundColor: '#5C720D',
                                    color: '#A3B832',
                                },
                            }}
                            icon="/icons/green_paper.svg"
                            color="blackgreen"
                            name="Story Drafts"
                            action={() => {
                                window.location.href = '/gallery/story/draft'
                            }}
                            paddingTop="10px"
                            className="custom-start-decorator"
                        />
                    </Sheet>
                </Stack>
            </Grid>

            <Typography
                level="h2"
                color="green"
                sx={{
                    paddingLeft: '16px',
                    marginTop: '74px',
                    color: '#9E9FEB',
                }}
            >
                Create Art
            </Typography>
            <Grid
                container
                direction="column"
                alignItems="flex-start"
                justifyContent="space-around"
            >
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    flexWrap="wrap"
                    width="100%"
                >
                    <Sheet color="purple-dashed" variant="rounded">
                        <span
                            onMouseEnter={() => setOnHover(true)}
                            onMouseLeave={() => setOnHover(false)}
                        >
                            <TwineButton
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    paddingBlock: '2rem',
                                    paddingInline: '2.4rem',
                                    borderRadius: '15px',
                                }}
                                icon="/icons/purple_plus.svg"
                                name="Create Artwork"
                                action={() => {
                                    window.location.href = '/create/art'
                                }}
                                paddingTop="10px"
                                className="custom-start-decorator"
                            />
                        </span>
                    </Sheet>
                    <Sheet color="purple-dashed" variant="rounded">
                        <span
                            onMouseEnter={() => setOnHover(true)}
                            onMouseLeave={() => setOnHover(false)}
                        >
                            <TwineButton
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    paddingBlock: '2rem',
                                    paddingInline: '2.4rem',
                                    borderRadius: '15px',
                                }}
                                icon="/icons/purple_plus.svg"
                                name="Publish Art Collection"
                                action={() => {
                                    window.location.href = '/create/collection'
                                }}
                                paddingTop="10px"
                                className="custom-start-decorator"
                            />
                        </span>
                    </Sheet>
                    <Sheet color="purple-dashed" variant="rounded">
                        <span
                            onMouseEnter={() => setOnHover(true)}
                            onMouseLeave={() => setOnHover(false)}
                        >
                            <TwineButton
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    paddingBlock: '2rem',
                                    paddingInline: '2.4rem',
                                    borderRadius: '15px',
                                }}
                                icon="/icons/purple-img.svg"
                                name="Art Collection Drafts"
                                action={() => {
                                    window.location.href = '/gallery/collection/draft'
                                }}
                                color='blackpurple'
                                paddingTop="10px"
                                className="custom-start-decorator"
                            />
                        </span>
                    </Sheet>
                </Stack>
            </Grid>
        </div>
    )
}

export default Create
