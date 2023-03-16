import {Button} from "@mui/joy";
import './ProfileSidebar.css';

const settingStory = () => {
    console.log("Setting Story");
}

const storyDrafts = () => {
    console.log("Story Drafts");
}

const settingArt = () => {
    console.log("Setting Art");
}

const artDrafts = () => {
    console.log("Art Drafts");
}

const buttonStyle = {maxWidth: '150px', maxHeight: '40px', minWidth: '150px', minHeight: '40px', margin: '5px'}

const ProfileSidebar = () => {
    return (
        <div className = "sidebar">
            <Button style = {buttonStyle} onClick={function () {
                settingStory();
            }}>Setting Story</Button>
            <Button style = {buttonStyle} onClick={function () {
                storyDrafts();
            }}>Story Drafts</Button>
            <Button style = {buttonStyle} onClick={function () {
                settingArt();
            }}>Setting Art</Button>
            <Button style = {buttonStyle} onClick={function () {
                artDrafts();
            }}>Art Drafts</Button>
        </div>
    )
}

export default ProfileSidebar;