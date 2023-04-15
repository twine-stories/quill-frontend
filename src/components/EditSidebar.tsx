import { Typography, Grid } from "@mui/joy";
import './EditSidebar.css';
import React, {useContext, useEffect, useState} from 'react';
import { UserContext } from "../App.tsx";
import UploadImage from "./UploadImage.tsx";
import TwineButton from "./TwineButton.tsx";
import { PROFILE_IMGS_BUCKET } from "../config.ts";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY } from "../utils/secrets.ts";
import {AWS_S3_REGION} from '../utils/constants.ts';
import {User} from '../utils/types.ts';
import AWS from "aws-sdk";
import {v4 as uuidv4} from 'uuid';


const EditSidebar = ({handleSave, handleCancel}) => {

    const [uploadImageOpen, setUploadImageOpen] = useState<boolean>(false);
    const [uploadLoading, setUploadLoading] = useState<boolean>(false);

    const context: object = useContext(UserContext);
    let user: User = context['user'];

    const bucketName: string = PROFILE_IMGS_BUCKET;
    const accessKeyId: string = ACCESS_KEY_ID;
    const secretAccessKey: string = SECRET_ACCESS_KEY;
    const region: string = AWS_S3_REGION;

    const saveEdit = async () => {
        handleSave();
    }
    
    
    const cancelEdit = async () => {
        handleCancel();
    }

    const handleUpload = async (selectedFile: File) => {
        try {
            const s3 = new AWS.S3({
                accessKeyId,
                secretAccessKey,
                region,
                signatureVersion: 'v4',
            });

            let imgName = uuidv4() + "." + selectedFile.name.split('.').pop();

            const params = {
                Bucket: bucketName,
                Key: imgName,
                Body: selectedFile,
            };

            setUploadLoading(true);
            await s3.upload(params).promise();
            user.profileImg = imgName;
            setUploadLoading(false);
            setUploadImageOpen(false);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file. Please try again later.");
            setUploadLoading(false);
            setUploadImageOpen(false);
        }
    }

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
                uploadLoading = {uploadLoading}
                open = {uploadImageOpen}
                close = {() => {setUploadImageOpen(false)}}
                handleUpload = {handleUpload}
                circle={true}
                width='200px'
                height='200px'
            />
            
        </Grid>
    )
}

export default EditSidebar;