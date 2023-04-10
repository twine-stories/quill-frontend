import {Button} from "@mui/joy";
import './EditSidebar.css';
import React, {useContext, useState} from 'react';
import { UserContext } from "../App.tsx";
import UploadImage from "./UploadImage.tsx";
import TwineButton from "./TwineButton.tsx";





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
    const user: User = context['user'];


    return (
        <div className="sidebar">
            <div className="avatar">
                <h3 align="left">Avatar</h3>
                <img
                    src = {user && user.profileImg}
                    alt = ""
                    onError={e => {
                        e.currentTarget.src = "https://placehold.co/100x100"
                    }}
                />
            </div>
            <TwineButton name={"Save Edit"} action={saveEdit}/>
            <TwineButton name={"Cancel Edit"} action={cancelEdit}/>
            <TwineButton name={"Upload Image"} action={showUploadImage}/>
            {uploadImageVisible && <UploadImage 
                bucketName = "test"
                accessKeyId = "test"
                secretAccessKey = "test"
                region = "test"
                hideComponent = {hideUploadImage}
            /> }
            
        </div>
    )
}

export default EditSidebar;