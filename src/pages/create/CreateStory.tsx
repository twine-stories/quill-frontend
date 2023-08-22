import React, { useContext, useEffect } from 'react'
import './CreateStory.css'
import useState from 'react-usestateref'
import Navbar from '../../components/Navbar.tsx'
import { UserContext } from '../../App.tsx'
import { User, Work, ImageUpload } from '../../utils/types.ts'
import {
    Box,
    Option,
    Typography,
    Grid,
    CircularProgress,
} from '@mui/joy'
import { useImmer } from 'use-immer'
import { enableMapSet } from 'immer'
import TwoColumnLayout from '../../components/TwoColumnLayout.tsx'
import TwineButton from '../../components/TwineButton.tsx'
import { genericPost, workGetByUrl } from '../../utils/api.ts'
import { Genre } from '../../utils/enums.ts'
import TwineInput from '../../components/TwineInput.tsx'
import TwineSelect from '../../components/TwineSelect.tsx'
import { useNavigate } from 'react-router-dom'
import UploadImage from '../../components/UploadImage.tsx'
import { STORY_IMGS_BUCKET } from '../../config.ts'
import { COVER_PATH, STORY_BANNER_PATH, sendToS3 } from '../../utils/aws.ts'
import { v4 as uuidv4 } from 'uuid'
import ErrorPopup from '../../components/ErrorPopup.tsx'

enableMapSet()

interface CreateStoryProps {
    edit?: boolean
}

function CreateStory(props: CreateStoryProps) {
    const navigate = useNavigate()
    const goBack = () => {
        navigate(-1)
    }
    const [work, setWork] = useState<Work>(null)

    const [cover, setCover] = useState<ImageUpload>({
        name: '',
        preview: '',
        file: null,
        openUpload: false,
    })
    const [banner, setBanner] = useState<ImageUpload>({
        name: '',
        preview: '',
        file: null,
        openUpload: false,
    })

    const [uploading, setUploading] = useState<boolean>(false)
    const [createClicked, setCreateClicked] = useState<boolean>(false)
    const [draftClicked, setDraftClicked] = useState<boolean>(false)

    const [errorMessage, setErrorMessage] = useState<string>(
        'Error creating story.'
    )
    const [openError, setOpenError] = useState<boolean>(false)

    const context: object = useContext(UserContext)
    const user: User = context['user']

    const bucketName: string = STORY_IMGS_BUCKET

    useEffect(() => {
        if (user && props.edit) {
            workGetByUrl(window.location.href.split('/')[5], setWork, () => {
                console.log('fail')
            })
        }
    }, [props.edit, user])

    const genreOptions: JSX.Element[] = []
    const genres: object = Object.keys(Genre)
    for (let i in Object.values(Genre)) {
        let val: string = genres[i]
        genreOptions.push(
            <Option
                className="dropdown-option"
                key={val.toLowerCase()}
                value={val.toLowerCase()}
            >
                {val.toLowerCase()}
            </Option>
        )
    }

    const prepareAndUpload = async (uploadType: string) => {
        if (uploadType !== 'cover' && uploadType !== 'banner') {
            return
        }

        if (uploadType === 'cover' && !cover.file) {
            return
        }
        if (uploadType === 'banner' && !banner.file) {
            return
        }

        let selectedFile: File = cover.file
        let imgName: string = cover.name
        if (uploadType === 'banner' && banner.name) {
            selectedFile = banner.file
            imgName = banner.name
        }

        await sendToS3(
            bucketName,
            (uploadType === 'cover' ? COVER_PATH : STORY_BANNER_PATH) + imgName,
            selectedFile
        )
    }

    const handleUpload = (selectedFile: File, uploadType: string) => {
        if (uploadType !== 'cover' && uploadType !== 'banner') {
            return
        }

        let imgName = uuidv4() + '.' + selectedFile.name.split('.').pop()

        let uploadObj: ImageUpload = {
            name: imgName,
            preview: URL.createObjectURL(selectedFile),
            file: selectedFile,
            openUpload: false,
        }

        if (uploadType === 'cover') {
            if (work) {
                setWork({
                    ...work,
                    cover: imgName,
                })
            }
            setCover(uploadObj)
        } else {
            if (work) {
                setWork({
                    ...work,
                    banner: imgName,
                })
            }
            setBanner(uploadObj)
        }
    }

    return (
        <div style={{ marginRight: '97px' }} className="margin-remove">
            <Navbar />
            <Typography level="h2" color="purple">
                {props.edit ? 'Edit Story' : 'Create Story'}
            </Typography>
            <TwoColumnLayout
                className="two-column-layout margin-remove"
                leftComponent={
                    <Box
                        className="create-story"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                        }}
                    >
                        {(!props.edit || work) && (
                            <TwineInput
                                defaultValue={props.edit ? work['title'] : ''}
                                id="title"
                                label="Title"
                                placeholder="Enter Title..."
                            />
                        )}
                        {(!props.edit || work) && (
                            <TwineInput
                                defaultValue={
                                    work && props.edit
                                        ? work['description']
                                        : ''
                                }
                                id="description"
                                label="Description"
                                placeholder="Enter Description..."
                                multiline={true}
                            />
                        )}
                        {(!props.edit || work) && (
                            <TwineInput
                                defaultValue={
                                    work && props.edit ? work['hook'] : ''
                                }
                                id="hook"
                                label="Hook"
                                placeholder="Enter Hook..."
                                multiline={true}
                            />
                        )}

                        {(!props.edit || work) && (
                            <TwineSelect
                                id="genre1"
                                label="Genre"
                                options={genreOptions}
                                defaultValue={
                                    props.edit
                                        ? work['genre1'].toLowerCase()
                                        : ''
                                }
                            />
                        )}
                        {(!props.edit || work) && (
                            <TwineSelect
                                id="genre2"
                                label="Genre 2 (optional)"
                                options={genreOptions}
                                defaultValue={
                                    props.edit
                                        ? work['genre2'].toLowerCase()
                                        : 'none'
                                }
                            />
                        )}
                        {(!props.edit || work) && (
                            <TwineSelect
                                id="genre3"
                                label="Genre 3 (optional)"
                                options={genreOptions}
                                defaultValue={
                                    props.edit
                                        ? work['genre3'].toLowerCase()
                                        : 'none'
                                }
                            />
                        )}

                        <Grid
                            container
                            direction="column"
                            alignItems="flex-start"
                            justifyContent="space-around"
                            className="create-image-upload"
                        >
                            <Typography level="h3" color="purple">
                                Banner (Optional)
                            </Typography>
                            <Grid
                                container
                                alignItems="center"
                                justifyContent="center"
                                xs={12}
                            >
                                <Grid
                                    container
                                    alignItems="center"
                                    justifyContent="center"
                                    id="create-banner-wrapper"
                                >
                                    {(work && work.banner) || banner.preview ? (
                                        <img
                                            src={
                                                banner.preview
                                                    ? banner.preview
                                                    : 'https://' +
                                                      STORY_IMGS_BUCKET +
                                                      '.s3.amazonaws.com/' +
                                                      STORY_BANNER_PATH +
                                                      (work
                                                          ? work.banner
                                                          : banner.name)
                                            }
                                            alt=""
                                            onClick={() =>
                                                setBanner({
                                                    ...banner,
                                                    openUpload: true,
                                                })
                                            }
                                            id="create-banner"
                                        />
                                    ) : (
                                        <TwineButton
                                            icon="/icons/purple_plus_light.svg"
                                            name="Upload"
                                            color="darkpurple"
                                            action={async () =>
                                                setBanner({
                                                    ...banner,
                                                    openUpload: true,
                                                })
                                            }
                                        />
                                    )}
                                </Grid>
                            </Grid>
                            <UploadImage
                                open={banner.openUpload}
                                close={async () =>
                                    setBanner({
                                        ...banner,
                                        openUpload: false,
                                    })
                                }
                                handleUpload={(file: File) =>
                                    handleUpload(file, 'banner')
                                }
                                circle={false}
                                width="440px"
                                height="100px"
                            />
                        </Grid>
                    </Box>
                }
                rightComponent={
                    <Box
                        sx={{
                            py: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            alignItems: 'center',
                            flexWrap: 'wrap',
                        }}
                        id="create-story-right"
                    >
                        <Grid
                            container
                            direction="column"
                            alignItems="flex-start"
                            justifyContent="space-around"
                            className="create-image-upload"
                        >
                            <Typography level="h3" color="purple">
                                Cover Art
                            </Typography>
                            <Grid
                                container
                                alignItems="center"
                                justifyContent="center"
                                id="create-cover-wrapper"
                            >
                                {(work && work.cover) || cover.preview ? (
                                    <img
                                        src={
                                            cover.preview
                                                ? cover.preview
                                                : 'https://' +
                                                  STORY_IMGS_BUCKET +
                                                  '.s3.amazonaws.com/' +
                                                  COVER_PATH +
                                                  (work
                                                      ? work.cover
                                                      : cover.name)
                                        }
                                        alt=""
                                        onClick={() =>
                                            setCover({
                                                ...cover,
                                                openUpload: true,
                                            })
                                        }
                                        id="create-cover"
                                    />
                                ) : (
                                    <TwineButton
                                        icon="/icons/purple_plus_light.svg"
                                        name="Upload"
                                        color="darkpurple"
                                        action={async () =>
                                            setCover({
                                                ...cover,
                                                openUpload: true,
                                            })
                                        }
                                    />
                                )}
                            </Grid>
                            <UploadImage
                                open={cover.openUpload}
                                close={async () =>
                                    setCover({
                                        ...cover,
                                        openUpload: false,
                                    })
                                }
                                handleUpload={(file: File) =>
                                    handleUpload(file, 'cover')
                                }
                                circle={false}
                                width="160px"
                                height="240px"
                            />
                        </Grid>
                        <Grid
                            container
                            direction="column"
                            rowGap={2}
                            id="create-story-right-buttons"
                        >
                            {!props.edit && (
                                <>
                                    <TwineButton
                                        name={
                                            uploading && draftClicked ? (
                                                <CircularProgress
                                                    color="darkpurple"
                                                    variant="plain"
                                                />
                                            ) : (
                                                'Save Draft'
                                            )
                                        }
                                        icon="/icons/purple_checkmark.svg"
                                        action={() => {
                                            setDraftClicked(true)
                                            postStory(getStory(false)).then(
                                                () => {
                                                    setDraftClicked(false)
                                                }
                                            )
                                        }}
                                    />
                                    <TwineButton
                                        name={
                                            uploading && createClicked ? (
                                                <CircularProgress
                                                    color="darkpurple"
                                                    variant="plain"
                                                />
                                            ) : (
                                                'Create Story'
                                            )
                                        }
                                        color="green"
                                        icon="/icons/green_plus.svg"
                                        action={() => {
                                            setCreateClicked(true)
                                            postStory(getStory(true)).then(
                                                () => {
                                                    setCreateClicked(false)
                                                }
                                            )
                                        }}
                                    />
                                </>
                            )}
                            {props.edit && (
                                <>
                                    {returnSaveButton()}
                                    <TwineButton
                                        name="Cancel Edit Story"
                                        color="blackgreen"
                                        icon="/icons/green_x.svg"
                                        action={() => goBack()}
                                    />
                                </>
                            )}
                        </Grid>
                        <ErrorPopup
                            isOpen={openError}
                            onClose={() => setOpenError(false)}
                            message={errorMessage}
                        />
                    </Box>
                }
            />
        </div>
    )

    function returnSaveButton() {
        if (work && work['publishStamp']) {
            return (
                <>
                    <TwineButton
                        name={
                            uploading && createClicked ? (
                                <CircularProgress
                                    color="darkpurple"
                                    variant="plain"
                                />
                            ) : (
                                'Save Story'
                            )
                        }
                        color="green"
                        icon="/icons/green_checkmark.svg"
                        action={() => {
                            setCreateClicked(true)
                            postStory(getStory(true, work)).then(() => {
                                setCreateClicked(false)
                            })
                        }}
                    />
                    <TwineButton
                        name={
                            uploading && draftClicked ? (
                                <CircularProgress
                                    color="darkpurple"
                                    variant="plain"
                                />
                            ) : (
                                'Transfer to Draft'
                            )
                        }
                        icon="/icons/purple_paper.svg"
                        action={() => {
                            setDraftClicked(true)
                            postStory(getStory(false, work)).then(() => {
                                setDraftClicked(false)
                            })
                        }}
                    />
                </>
            )
        } else {
            return (
                <>
                    <TwineButton
                        name={
                            uploading && draftClicked ? (
                                <CircularProgress
                                    color="darkpurple"
                                    variant="plain"
                                />
                            ) : (
                                'Save Story'
                            )
                        }
                        color="green"
                        icon="/icons/green_checkmark.svg"
                        action={() => {
                            setDraftClicked(true)
                            postStory(getStory(false, work)).then(() => {
                                setDraftClicked(false)
                            })
                        }}
                    />
                    <TwineButton
                        name={
                            uploading && createClicked ? (
                                <CircularProgress
                                    color="darkpurple"
                                    variant="plain"
                                />
                            ) : (
                                'Transfer to Published'
                            )
                        }
                        icon="/icons/purple_paper.svg"
                        action={() => {
                            setCreateClicked(true)
                            postStory(getStory(true, work)).then(() => {
                                setCreateClicked(false)
                            })
                        }}
                    />
                </>
            )
        }
    }

    function getStory(published: boolean, currentWork?: Work): Work | undefined {
        const title: HTMLInputElement = document.getElementById(
            'title'
        ) as HTMLInputElement
        if (!title.value) {
            setErrorMessage('Please enter a title for your story!')
            setOpenError(true)
            return
        }
        if (title.value.includes('/')) {
            setErrorMessage(
                'Sorry, there cannot be any backslashes in the story title.'
            )
            setOpenError(true)
            return
        }

        if (!(cover.name || (work && work.cover))) {
            setErrorMessage('Please upload a cover for your story.')
            setOpenError(true)
            return
        }

        const description: HTMLInputElement = document.getElementById(
            'description'
        ) as HTMLInputElement
        if (!description.value) {
            setErrorMessage('Please enter a description.')
            setOpenError(true)
            return
        }
        const hook: HTMLInputElement = document.getElementById(
            'hook'
        ) as HTMLInputElement
        if (!hook.value) {
            setErrorMessage('Please enter a hook.')
            setOpenError(true)
            return
        }
        const genre1: HTMLInputElement = document.getElementById(
            'genre1'
        ) as HTMLInputElement
        if (!genre1.textContent) {
            setErrorMessage('Please enter a genre.')
            setOpenError(true)
            return
        }
        const genre2: HTMLInputElement = document.getElementById(
            'genre2'
        ) as HTMLInputElement
        const genre3: HTMLInputElement = document.getElementById(
            'genre3'
        ) as HTMLInputElement
        const publishStamp = published ? new Date() : null
        const id = currentWork ? currentWork['id'] : null

        if (
            title.value &&
            !title.value.includes('/') &&
            description.value &&
            hook.value &&
            genre1.textContent &&
            (cover.name || (work && work.cover))
        ) {
            let newWork: Work = {
                id: id,
                creator: user,
                title: title.value,
                description: description.value,
                cover: cover.name ? cover.name : work.cover,
                banner: banner.name ? banner.name : work ? work.banner : null,
                genre1: genre1.textContent.toUpperCase(),
                genre2: genre2.textContent.toUpperCase(),
                genre3: genre3.textContent.toUpperCase(),
                medium: 'WRITTEN',
                url:
                    user.userName +
                    '_' +
                    title.value.replace(/\s/g, '-').toLowerCase(),
                hook: hook.value,
                publishStamp: publishStamp,
                published: published,
            }

            return newWork
        }
        setErrorMessage(
            'Please make sure you have filled out all the fields before submitting.'
        )
        setOpenError(true)
    }

    async function postStory(workToPost: Work | undefined) {
        if (workToPost) {
            let urlModifier = props.edit ? 'update' : 'add'

            setUploading(true)
            try {
                const response = await genericPost(
                    '/api/work/' + urlModifier,
                    workToPost
                )
                if (response) {
                    if (cover.file) {
                        await prepareAndUpload('cover')
                    }
                    if (banner.file) {
                        await prepareAndUpload('banner')
                    }
                    setUploading(false)
                    navigate('/story/' + workToPost.url)
                }
            } catch (error) {
                setErrorMessage(
                    'Your title is the same as one of your existing titles. Please choose a different title.'
                )
                setUploading(false)
                setOpenError(true)
            }
        }
    }
}

export default CreateStory
