import {Button} from "@mui/joy";
import './ProfileSidebar.css';
import TwineButton from "./TwineButton.tsx";
import { useNavigate } from 'react-router-dom';
    




// const buttonStyle = {width: "100%"}

const ProfileSidebar = ({goToDrafts}) => {

    let navigate = useNavigate();



    return (
        <div className = "sidebar">
            <TwineButton icon='/icons/Paper.svg' name = "Drafts" action = {goToDrafts} color='green' />
        </div>
    )
}

export default ProfileSidebar;