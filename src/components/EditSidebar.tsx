import {Button} from "@mui/joy";
import './EditSidebar.css';
import React, {useContext} from 'react';
import { UserContext } from "../App.tsx";





const EditSidebar = () => {

    const saveEdit = () => {
        console.log("Save Edit");
    }
    
    const cancelEdit = () => {
        console.log("Cancel Edit");
    }

    const context: object = useContext(UserContext);
    const user: User = context['user'];

    const buttonStyle = {maxWidth: '150px', maxHeight: '40px', minWidth: '150px', minHeight: '40px', margin: '5px'}


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
            <Button style = {buttonStyle} onClick={function () {
                saveEdit();
            }}>Save Edit</Button>
            <Button style = {buttonStyle} onClick={function () {
                cancelEdit();
            }}>Cancel Edit</Button>
        </div>
    )
}

export default EditSidebar;