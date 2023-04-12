import {Button} from "@mui/joy";
import './EditSidebar.css';
import React, {useContext, useEffect, useState} from 'react';
import { UserContext } from "../App.tsx";
import UploadImage from "./UploadImage.tsx";
import TwineButton from "./TwineButton.tsx";
import { PROFILE_IMGS_BUCKET } from "../config.ts";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY } from "../utils/secrets.ts";





const EditSidebar = ({handleSave, handleCancel}) => {

    

    const [uploadImageVisible, setUploadImageVisible] = useState(false);

    const showUploadImage = async () => {
        setUploadImageVisible(true);
    }

    const hideUploadImage = async () => {
        setUploadImageVisible(false);
    }

    const saveEdit = async () => {
        handleSave();
    }
    
    
    const cancelEdit = async () => {
        handleCancel();
    }

    const context: object = useContext(UserContext);
    let user: User = context['user'];


    return (
        <div className="sidebar">
            <div className="avatar">
                <h3 align="left">Avatar</h3>
                <img
                    src = {user && 'https://'+PROFILE_IMGS_BUCKET+'.s3.amazonaws.com/'+user.profileImg}
                    alt = ""
                    width = "128"
                    height = "128"
                    style = {{cursor: "pointer", borderRadius: "50%", objectFit: "cover"}}
                    onClick = {showUploadImage}
                    onError={e => {
                        e.currentTarget.src = 'https://'+PROFILE_IMGS_BUCKET+'.s3.amazonaws.com/default.jpeg';
                    }}
                />
            </div>
            <TwineButton name={"Save Edit"} action={saveEdit}/>
            <TwineButton name={"Cancel Edit"} action={cancelEdit}/>
            {uploadImageVisible && <UploadImage 
                bucketName = {PROFILE_IMGS_BUCKET}
                accessKeyId = {ACCESS_KEY_ID}
                secretAccessKey = {SECRET_ACCESS_KEY}
                region = "us-east-1"
                hideComponent = {hideUploadImage}
            /> }
            
        </div>
    )
}

export default EditSidebar;