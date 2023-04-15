import React, { useState, useContext } from "react";
import { UserContext } from "../App.tsx";
import "./UploadImage.css"
import TwineButton from "./TwineButton.tsx";
import TwineInput from "./TwineInput.tsx";
import { Modal, Sheet, Typography, Grid, CircularProgress } from "@mui/joy";

interface UploaderProps {
    loading: boolean;
    open: boolean;
    close: () => Promise<void>;
    handleUpload: (file: FIle) => Promise<void>;
}
function UploadImage({
    loading,
    open,
    close,
    handleUpload
}: UploaderProps) {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imgsrc, setImgSrc] = useState<string | ArrayBuffer | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
        if (!file) {
            setImgSrc(null);
            return;
        }
        previewFile(file);
    };

    const previewFile = (file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImgSrc(reader.result);
        };
    };

    return (
        <Modal open={open} onClose={close}>
            <Sheet
            variant="outlined"
            sx={{
                maxWidth: '600px',
                width: '50vw',
                borderRadius: 'md',
                p: 3,
                boxShadow: 'lg',
            }}>
                <Grid container direction='column' alignItems='center' justifyContent='space-around' id='profile-file-upload-wrapper'>
                    <Typography level='h2' color='purple'>Upload Image</Typography>
                    <TwineInput onChange={handleFileChange} inputAttrs={{
                        type: 'file',
                        accept: '.jpg, .jpeg, .png',
                        id: 'profile-file-upload'
                    }} sx={{
                        border: 'none',
                        background: 'transparent',
                        padding: '0px'
                    }}/>
                    <Grid id='profile-upload-preview'>
                        <Typography level='h3' color='purple'>Preview Image</Typography>
                        <Grid container alignItems='center' justifyContent='center' id='profile-preview-wrapper'>
                            {imgsrc != null && <img src={imgsrc as string} width="200" height="200"/>}
                        </Grid>
                    </Grid>
                    <Grid>
                        <TwineButton sx={{width: '130px'}} name={loading ? <CircularProgress color='darkpurple' variant='plain' /> : 'Upload'} action={() => {
                            if (!selectedFile) {
                                return;
                            }
                            handleUpload(selectedFile);
                        }} enabled={selectedFile !== null} />
                    </Grid>
                </Grid>
            
            </Sheet>
        
        </Modal>
      
  );
}

export default UploadImage;
