import React, { useState, useContext } from 'react'
import './Feedback.css'
import Navbar from '../../components/Navbar.tsx'
import TwineInput from '../../components/TwineInput.tsx'
import TwineButton from '../../components/TwineButton.tsx'
import { Typography, Grid, Textarea, FormControl, FormLabel } from '@mui/joy'
import { genericPost } from '../../utils/api.ts'
import { UserContext } from '../../App.tsx'
import { sendToS3 } from '../../utils/aws.ts'
import { FEEDBACK_IMGS_BUCKET } from '../../config.ts'
import UploadImage from '../../components/UploadImage.tsx'
import { User, Feedback, ImageUpload } from '../../utils/types.ts'
import { v4 as uuidv4 } from 'uuid'
import SuccessPopup from '../../components/SuccessPopup.tsx'
import ErrorPopup from '../../components/ErrorPopup.tsx'

function FeedbackPage() {
    const [feedbackImg, setFeedbackImg] = useState<ImageUpload>({
        name: '',
        file: null,
        preview: '',
        openUpload: false,
    })
    const [openSuccess, setOpenSuccess] = useState<boolean>(false)
    const [openFail, setOpenFail] = useState<boolean>(false)

    const context: object = useContext(UserContext)
    const user: User = context['user']

    const handleUpload = async (selectedFile: File) => {
        let imgName = uuidv4() + '.' + selectedFile.name.split('.').pop()
        setFeedbackImg({
            name: imgName,
            file: selectedFile,
            preview: URL.createObjectURL(selectedFile),
            openUpload: false,
        })
    }

    return (
        <div>
            <Navbar />
            {user ? (
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="space-around"
                >
                    <Grid xs={11}>
                        <Typography color="purple" level="h2">
                            Send Us Your Feedback
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justifyContent="space-around"
                        xs={11}
                        rowSpacing={3}
                    >
                        <Grid xs={11}>
                            <TwineInput
                                label="Subject"
                                placeholder="Enter a title for the issue..."
                                inputAttrs={{ id: 'feedbackSubj' }}
                            />
                        </Grid>
                        <Grid xs={11}>
                            <FormControl>
                                <FormLabel>Description</FormLabel>
                                <Textarea
                                    placeholder="Enter a description for the issue..."
                                    minRows={5}
                                    slotProps={{
                                        textarea: {
                                            id: 'feedbackDesc',
                                        },
                                    }}
                                ></Textarea>
                            </FormControl>
                        </Grid>
                        <Grid
                            container
                            direction="column"
                            alignItems="center"
                            justifyContent="space-around"
                            xs={11}
                            id="feedback-upload-wrapper"
                        >
                            <Grid xs={12}>
                                <Typography level="h3" color="purple">
                                    Image of Issue (Optional)
                                </Typography>
                            </Grid>
                            <Grid
                                container
                                alignItems="center"
                                justifyContent="center"
                                id="feedback-image-upload"
                            >
                                {feedbackImg.preview ? (
                                    <img
                                        src={feedbackImg.preview}
                                        alt=""
                                        onClick={() =>
                                            setFeedbackImg({
                                                ...feedbackImg,
                                                openUpload: true,
                                            })
                                        }
                                        id="feedback-upload"
                                    />
                                ) : (
                                    <TwineButton
                                    className="upload-button"
                                        icon="/icons/purple_plus_light.svg"
                                        name="Upload"
                                        color="darkpurple"
                                        action={() =>
                                            setFeedbackImg({
                                                ...feedbackImg,
                                                openUpload: true,
                                            })
                                        }
                                    />
                                )}
                            </Grid>
                        </Grid>
                        <UploadImage
                            open={feedbackImg.openUpload}
                            close={() =>
                                setFeedbackImg({
                                    ...feedbackImg,
                                    openUpload: false,
                                })
                            }
                            handleUpload={handleUpload}
                            circle={false}
                            width="200px"
                            height="200px"
                            contain={true}
                        />
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="space-around"
                            xs={11}
                        >
                            <TwineButton
                                name="Submit"
                                className="submit-button"
                                color="darkpurple"
                                action={() => {
                                    const desc: string = (
                                        document.getElementById(
                                            'feedbackDesc'
                                        ) as HTMLInputElement
                                    ).value
                                    const subj: string = (
                                        document.getElementById(
                                            'feedbackSubj'
                                        ) as HTMLInputElement
                                    ).value
                                    if (!desc || !subj) {
                                        setOpenFail(true)
                                        return
                                    }

                                    const feedback: Feedback = {
                                        beta: true,
                                        submitter: user,
                                        subject: subj,
                                        description: desc,
                                        images: feedbackImg.name
                                            ? feedbackImg.name
                                            : null,
                                    }
                                    genericPost(
                                        '/api/feedback/submit',
                                        feedback
                                    ).then((response) => {
                                        if (feedbackImg.file) {
                                            sendToS3(
                                                FEEDBACK_IMGS_BUCKET,
                                                feedbackImg.name,
                                                feedbackImg.file
                                            ).then(() => {
                                                setOpenSuccess(true)
                                            })
                                        } else {
                                            setOpenSuccess(true)
                                        }
                                    })
                                }}
                            />
                        </Grid>
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="space-around"
                            xs={11}
                        >
                            <Typography level="h6" sx={{ fontFamily: 'Twine' }}>
                                thank you!
                            </Typography>
                        </Grid>
                        <SuccessPopup
                            isOpen={openSuccess}
                            onClose={() => setOpenSuccess(false)}
                        />
                        <ErrorPopup
                            isOpen={openFail}
                            onClose={() => setOpenFail(false)}
                            message="Error submitting feedback. Please ensure you have entered a subject and description."
                        />
                    </Grid>
                </Grid>
            ) : (
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="space-around"
                >
                    <Grid xs={11}>
                        <Typography color="purple" level="h2">
                            Send Us Your Feedback
                        </Typography>
                    </Grid>
                    <Grid xs={11}>
                        <Typography color="purple" level="h6">
                            Please login to share your feedback!
                        </Typography>
                    </Grid>
                </Grid>
            )}
        </div>
    )
}

export default FeedbackPage
