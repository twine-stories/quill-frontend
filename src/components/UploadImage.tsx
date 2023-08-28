import React, { useState } from 'react'
import './UploadImage.css'
import TwineButton from './TwineButton.tsx'
import TwineInput from './TwineInput.tsx'
import { Modal, Sheet, Typography, Grid } from '@mui/joy'

interface UploaderProps {
    open: boolean
    close: () => Promise<void> | void
    handleUpload: (file: File) => Promise<void> | void
    circle: boolean
    width: string
    height: string
    contain?: boolean
}
function UploadImage({
    open,
    close,
    handleUpload,
    circle,
    width,
    height,
    contain,
}: UploaderProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [imgsrc, setImgSrc] = useState<string | ArrayBuffer | null>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null
        setSelectedFile(file)
        if (!file) {
            setImgSrc(null)
            return
        }
        previewFile(file)
    }

    const previewFile = (file: File) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setImgSrc(reader.result)
        }
    }

    return (
        <Modal open={open} onClose={close}>
            <Sheet
                className="upload-image-popup"
                variant="outlined"
                sx={{
                    maxWidth: '600px',
                    width: '50vw',
                    borderRadius: '20',
                    p: 3,
                    boxShadow: 'lg',
                    border: '1px #241d19 solid',
                }}
            >
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="space-around"
                    id="profile-file-upload-wrapper"
                >
                    <Typography level="h2" color="purple">
                        Upload Image
                    </Typography>
                    <TwineInput
                        onChange={handleFileChange}
                        inputAttrs={{
                            type: 'file',
                            accept: '.jpg, .jpeg, .png',
                            id: 'profile-file-upload',
                        }}
                        sx={{
                            border: 'none',
                            background: 'transparent',
                            padding: '0px',
                        }}
                    />
                    <Grid id="profile-upload-preview">
                        <Typography level="h3" color="purple">
                            Preview Image
                        </Typography>
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="center"
                            id="profile-preview-wrapper"
                            style={{
                                width:
                                    parseInt(
                                        width.substring(0, width.length - 2)
                                    ) +
                                    30 +
                                    'px',
                                height:
                                    parseInt(
                                        height.substring(0, height.length - 2)
                                    ) +
                                    30 +
                                    'px',
                            }}
                        >
                            {imgsrc != null && (
                                <img
                                    src={imgsrc as string}
                                    style={{
                                        borderRadius: circle ? '50%' : '15px',
                                        width: width,
                                        height: height,
                                        objectFit: contain
                                            ? 'contain'
                                            : 'cover',
                                    }}
                                />
                            )}
                        </Grid>
                    </Grid>
                    <Grid>
                        <TwineButton
                            className="upload-button"
                            sx={{ width: '130px' }}
                            name="Upload"
                            action={() => {
                                if (!selectedFile) {
                                    return
                                }
                                handleUpload(selectedFile)
                            }}
                            enabled={selectedFile !== null}
                        />
                    </Grid>
                </Grid>
            </Sheet>
        </Modal>
    )
}

export default UploadImage
