import React, { useContext, useEffect } from 'react'
import useState from 'react-usestateref'
import Navbar from '../components/Navbar.tsx'
import { UserContext } from '../App.tsx'
import { User } from '../utils/types.ts'
import {
    Box,
    Grid,
    Typography,
} from '@mui/joy'
import TwineButton from '../components/TwineButton.tsx'
import GalleryTile from '../components/GalleryTile.tsx'
import { genericGet } from '../utils/api.ts'
import { NFTCollection, Work } from '../utils/types.ts'
import TwoColumnLayout from '../components/TwoColumnLayout.tsx'
import './Gallery.css'

interface WorkGalleryProps {
    art: boolean
    draft: boolean
}

function Gallery(props: WorkGalleryProps) {
    const context: object = useContext(UserContext)
    const user: User = context['user']

    const [view, setView] = useState(false)

    const [galleryItems, setGalleryItems] = useState<Array<JSX.Element>>([])

    useEffect(() => {
        if (user && user.creator && user.walletAddress) {
            let profileWorks: JSX.Element[] = []
            let i = 0
            const fetchAndSet = async () => {
                if (props.art) {
                    if (props.draft) {
                        const response: NFTCollection[] = await genericGet('/api/collection/drafts/creator/' + user.walletAddress)
                        console.log(response)
                        response.forEach((elem: NFTCollection) => {
                            profileWorks.push(
                                <GalleryTile story={false} coll={elem} key={i} />
                            )
                            i += 1
                        })
                    } else {
                        const response: NFTCollection[] = await genericGet(
                            '/api/collection/active/creator/' + user.walletAddress
                        )
                        response.forEach((elem: NFTCollection) => {
                            profileWorks.push(
                                <GalleryTile story={false} coll={elem} key={i} />
                            )
                            i += 1
                        })
                    }
                } else {
                    const response: Work[] = await genericGet(
                        '/api/work/creator/' + user.walletAddress
                    )
                    response.forEach((element: Work) => {
                        if (
                            (element.publishStamp && !props.draft) ||
                            (!element.publishStamp && props.draft)
                        ) {
                            profileWorks.push(
                                <GalleryTile
                                    story={true}
                                    work={element}
                                    key={i}
                                />
                            )
                        }
                        i += 1
                    })
                }
            }

            fetchAndSet().then(() => {
                setGalleryItems(profileWorks)
            })
        }
    }, [context['user']])

    return (
        <div className="gallery" style={{ margin: '0px 3px' }}>
            <Navbar />
            <TwoColumnLayout
                className="gallery-columns"
                leftWidth="80%"
                rightWidth="20%"
                leftComponent={
                    <>
                        <Typography
                            level="h2"
                            sx={{ color: '#9E9FEB', fontSize: '50px' }}
                        >
                            {props.episodeName
                                ? props.episodeName
                                : (props.draft ? 'Draft' : 'Published').concat(
                                      props.art ? ' Collections' : ' Stories'
                                  )}
                        </Typography>
                        <Box
                            sx={{
                                backgroundColor: '#14100E',
                                padding: '10px',
                                marginBottom: '30px',
                                borderRadius: '20px',
                            }}
                        >
                            <Typography
                                level="h5"
                                sx={{
                                    marginBottom: '0px',
                                    color: '#9E9FEB',
                                    fontSize: '24px',
                                    fontFamily: 'Twine',
                                    lineHeight: '100%',
                                    letterSpacing: '-0.48px',
                                    marginLeft: '23px',
                                    marginTop: '27px',
                                }}
                            >
                                {galleryItems.length}{' '}
                                {galleryItems.length === 1
                                    ? props.art
                                        ? 'Collection'
                                        : 'Story'
                                    : props.art
                                    ? 'Collections'
                                    : 'Stories'}
                            </Typography>

                            <Grid
                                container
                                spacing={{ xs: 2 }}
                                columns={{ xs: 1, sm: 2, md: 2, lg: 3 }}
                                sx={{ padding: '12px' }}
                            >
                                {galleryItems.map((galleryTile, index) => (
                                    <Grid
                                        sx={{ width: '225px !important' }}
                                        md={1}
                                        xl={1}
                                        lg={1}
                                        sm={2}
                                        xs={1}
                                        key={index}
                                    >
                                        {galleryTile}
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </>
                }
                rightComponent={
                    props.art ? (
                        <div className="create-published-button">
                            <TwineButton
                                sx={{
                                    width: '100%',
                                    borderRadius: '13px',
                                    height: '45px',
                                }}
                                color="green"
                                icon="/icons/green_plus.svg"
                                name="Create Digital Art"
                                action={() => {
                                    window.location.href = '/create/art'
                                }}
                            />
                            <TwineButton
                                sx={{
                                    width: '100%',
                                    borderRadius: '13px',
                                    height: '45px',
                                }}
                                color="green"
                                icon="/icons/green_plus.svg"
                                name="Create New Collections"
                                action={() => {
                                    window.location.href = '/create/collection'
                                }}
                            />
                            {/* <TwineButton
                                sx={{
                                    width: '100%',
                                    borderRadius: '13px',
                                    height: '45px',
                                }}
                                icon="/icons/purple_paper.svg"
                                name={
                                    'Open ' + props.draft
                                        ? 'Published'
                                        : 'Draft'
                                }
                            /> */}
                        </div>
                    ) : (
                        <div className="create-published-button">
                            <TwineButton
                                sx={{
                                    width: '100%',
                                    borderRadius: '13px',
                                    height: '45px',
                                }}
                                color="green"
                                icon="/icons/green_plus.svg"
                                name="Create New Stories"
                                action={() => {
                                    window.location.href = '/create/story'
                                }}
                            />
                            <TwineButton
                                sx={{
                                    width: '100%',
                                    borderRadius: '13px',
                                    height: '45px',
                                }}
                                icon="/icons/purple_paper.svg"
                                name={
                                    'Open ' +
                                    (props.draft ? 'Published' : 'Drafts')
                                }
                                action={() => {
                                    window.location.href = props.draft
                                        ? '/gallery/story/published'
                                        : '/gallery/story/draft'
                                }}
                            />
                        </div>
                    )
                }
            />
        </div>
    )
}

export default Gallery
