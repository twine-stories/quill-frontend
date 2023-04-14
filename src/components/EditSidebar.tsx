import { Typography, Grid } from "@mui/joy";
import './EditSidebar.css';
import React, {useContext, useEffect, useState} from 'react';
import { UserContext } from "../App.tsx";
import UploadImage from "./UploadImage.tsx";
import TwineButton from "./TwineButton.tsx";
import { PROFILE_IMGS_BUCKET } from "../config.ts";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY } from "../utils/secrets.ts";
import {User} from '../utils/types.ts';


const EditSidebar = ({handleSave, handleCancel}) => {

    const [uploadImageOpen, setUploadImageOpen] = useState<boolean>(false);

    // const showUploadImage = async () => {
    //     setUploadImageVisible(true);
    // }

    // const hideUploadImage = async () => {
    //     setUploadImageVisible(false);
    // }

    const saveEdit = async () => {
        handleSave();
    }
    
    
    const cancelEdit = async () => {
        handleCancel();
    }

    const context: object = useContext(UserContext);
    let user: User = context['user'];


    return (
        <Grid container direction='column' alignItems='center' rowSpacing={2} xs={3} id="sidebar">
            <Grid container direction='column' alignItems='flex-start' justifyContent='space-around' xs={12} id="avatar">
                <Typography level="h3" color='purple'>Avatar</Typography>
                <Grid container alignItems='center' justifyContent='center' xs={12}>
                    <img
                        src = {user && 'https://'+PROFILE_IMGS_BUCKET+'.s3.amazonaws.com/'+user.profileImg}
                        alt = ""
                        width = "128"
                        height = "128"
                        style = {{cursor: "pointer", borderRadius: "50%", objectFit: "cover"}}
                        onClick = {() => setUploadImageOpen(true)}
                        onError={e => {
                            e.currentTarget.src = 'https://'+PROFILE_IMGS_BUCKET+'.s3.amazonaws.com/default.jpeg';
                        }}
                    />
                </Grid>
            </Grid>
            <Grid xs={12}><TwineButton icon='/icons/purple_check.svg' sx={{width: '100%'}} name={"Save Edit"} action={saveEdit}/></Grid>
            <Grid xs={12}><TwineButton icon='/icons/dark_green_x.svg' color='green' sx={{width: '100%'}} name={"Cancel Edit"} action={cancelEdit}/></Grid>
            <UploadImage 
                bucketName = {PROFILE_IMGS_BUCKET}
                accessKeyId = {ACCESS_KEY_ID}
                secretAccessKey = {SECRET_ACCESS_KEY}
                region = "us-east-1"
                open = {uploadImageOpen}
                close = {() => {setUploadImageOpen(false)}}
            />
            
        </Grid>
    )
}

export default EditSidebar;