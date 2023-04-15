import { Typography, Grid } from "@mui/joy";
import './EditSidebar.css';
import React, {useContext, useEffect, useState} from 'react';
import { UserContext } from "../App.tsx";
import UploadImage from "./UploadImage.tsx";
import TwineButton from "./TwineButton.tsx";
import { PROFILE_IMGS_BUCKET } from "../config.ts";
import {sendToS3} from '../utils/aws.ts';
import {User, ImageUpload} from '../utils/types.ts';
import {v4 as uuidv4} from 'uuid';


const EditSidebar = ({handleSave, handleCancel}) => {

    const [profileImg, setProfileImg] = useState<ImageUpload>({
        name: '',
        preview: '',
        file: null,
        openUpload: false
    });

    const context: object = useContext(UserContext);
    let user: User = context['user'];

    const bucketName: string = PROFILE_IMGS_BUCKET;

    const saveEdit = async () => {
        if (!profileImg.name || !profileImg.file) {
            return;
        }
        sendToS3(bucketName, profileImg.name, profileImg.file).then(() => {
            handleSave();
        });
    }
    
    
    const cancelEdit = async () => {
        handleCancel();
    }

    const handleUpload = async (selectedFile: File) => {
        let imgName = uuidv4() + "." + selectedFile.name.split('.').pop();
        user.profileImg = imgName;
        setProfileImg({
            name: imgName,
            file: selectedFile,
            preview: URL.createObjectURL(selectedFile),
            openUpload: false
        });
    }

    return (
        <Grid container direction='column' alignItems='center' rowSpacing={2} xs={3} id="sidebar">
            <Grid container direction='column' alignItems='flex-start' justifyContent='space-around' xs={12} id="avatar">
                <Typography level="h3" color='purple'>Avatar</Typography>
                <Grid container alignItems='center' justifyContent='center' xs={12}>
                    <img
                        src = {profileImg.preview ? profileImg.preview : 'https://' + PROFILE_IMGS_BUCKET + '.s3.amazonaws.com/' + (user ? user.profileImg : profileImg.name)}
                        alt = ""
                        width = "128"
                        height = "128"
                        style = {{cursor: "pointer", borderRadius: "50%", objectFit: "cover"}}
                        onClick = {() => setProfileImg({
                            ...profileImg,
                            openUpload: true
                        })}
                        onError={e => {
                            e.currentTarget.src = 'https://'+PROFILE_IMGS_BUCKET+'.s3.amazonaws.com/default.jpeg';
                        }}
                    />
                </Grid>
            </Grid>
            <Grid xs={12}><TwineButton icon='/icons/purple_check.svg' sx={{width: '100%'}} name={"Save Edit"} action={saveEdit}/></Grid>
            <Grid xs={12}><TwineButton icon='/icons/dark_green_x.svg' color='green' sx={{width: '100%'}} name={"Cancel Edit"} action={cancelEdit}/></Grid>
            <UploadImage 
                open = {profileImg.openUpload}
                close = {() => setProfileImg({
                    ...profileImg,
                    openUpload: false
                })}
                handleUpload = {handleUpload}
                circle={true}
                width='200px'
                height='200px'
            />
            
        </Grid>
    )
}

export default EditSidebar;