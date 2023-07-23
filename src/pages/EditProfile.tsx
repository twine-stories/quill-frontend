import React, { useState, useContext, useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { UserContext } from "../App.tsx";
import { User } from '../utils/types.ts';
import ProfileWork from '../components/ProfileWork.tsx';
import './EditProfile.css';
import "../components/EditSidebar.tsx"
import EditSidebar from '../components/EditSidebar.tsx';
import {Grid, Textarea, Typography} from "@mui/joy";
import { useNavigate } from 'react-router-dom';
import { genericPost, genericGet } from '../utils/api.ts'; 
import ErrorPopup from '../components/ErrorPopup.tsx';
import { proxy } from '../utils/api.ts';

const axios = require('axios').default;

function EditProfile() {
    const [works, setWorks] = useState<Array<ProfileWork>>();
    const [isFailure, setIsFailure] = useState<boolean>(false);
    const [failureMessage, setFailureMessage] = useState<string>("");
    const context: object = useContext(UserContext);
    const user: User = context['user'];
    const originalImage: string = user.profileImg;
    const updateUser: (user: User) => void = context['updateUser'];

    useEffect(() => {
        if (user && user.creator && user.walletAddress) {
            axios.get(proxy + '/api/work/creator/' + user.walletAddress)
                .then(response => {
                    if (response.data) {
                        var profileWorks: JSX.Element[] = [];
                        var i = 0;
                        response.data.forEach(element => {
                            profileWorks.push(<ProfileWork work={element} key={i} />);
                            i += 1;
                        });
                        setWorks(profileWorks);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [context['user']]);

    let navigate = useNavigate();

    const handleSave = async () => {
        let firstname: string = document.getElementsByClassName("firstname")[0].getElementsByTagName("textarea")[0].value;
        let lastname: string = document.getElementsByClassName("lastname")[0].getElementsByTagName("textarea")[0].value;
        let username: string = document.getElementsByClassName("username")[0].getElementsByTagName("textarea")[0].value;
        let description: string = document.getElementsByClassName("desc")[0].getElementsByTagName("textarea")[0].value;
        let website: string = document.getElementsByClassName("website")[0].getElementsByTagName("textarea")[0].value;
        let twitter: string = document.getElementsByClassName("twitter")[0].getElementsByTagName("textarea")[0].value;
        let instagram: string = document.getElementsByClassName("instagram")[0].getElementsByTagName("textarea")[0].value;
        let reddit: string = document.getElementsByClassName("reddit")[0].getElementsByTagName("textarea")[0].value;
        let discord: string = document.getElementsByClassName("discord")[0].getElementsByTagName("textarea")[0].value;
        
        if ("@" === username[0]) {
            username = username.substring(1);
        }
        
        const response = await genericGet('/api/user/taken/' + username);

        if (response && username !== user.userName) {
            setIsFailure(true);
            setFailureMessage("Username is already taken");
            return;
        }

        user.firstName = firstname;
        user.lastName = lastname;
        user.userName = username;
        user.description = description;
        user.website = website;
        user.twitter = twitter;
        user.instagram = instagram;
        user.reddit = reddit;
        user.discord = discord;


        genericPost('/api/user/update', user).then((response: User) => {
            updateUser(response);
        });

        navigate('/profile');


    }

    const handleCancel = () => {
        user.profileImg = originalImage;
        navigate('/profile');
    }

    const handleKeyPress = () => {
        let username: string = document.getElementsByClassName("username")[0].getElementsByTagName("textarea")[0].value;
        if (username.length === 0) {
            document.getElementsByClassName("username")[0].getElementsByTagName("textarea")[0].value = "@";
        } else if ("@" !== username[0]) {

            let atIdx = username.indexOf("@");
            let afterAt = username.substring(atIdx+1, username.length);
            document.getElementsByClassName("username")[0].getElementsByTagName("textarea")[0].value = "@" + afterAt;
        }
    }

    return (
        <div>
            <Navbar />
            <Typography color='purple' level='h2'>Edit Profile</Typography>
            <Grid container alignItems='flex-start' justifyContent='space-between' className="edit-profile">
                <Grid xs={8} className="container-grid">
                    <Typography color='purple' level='h3'>About Profile</Typography>
                    <Grid container direction='column' rowSpacing={3} className="edit-inner">
                        <Grid container columnSpacing={1} alignItems='center' justifyContent='space-between'>
                            <Grid xs={4}><Textarea className="lastname" defaultValue={user && user.lastName} maxRows={1} /></Grid>
                            <Grid xs={4}><Textarea className="firstname" defaultValue={user && user.firstName} maxRows={1}  /></Grid>
                            <Grid xs={4}><Textarea className="username" defaultValue={(user && ("@" + user.userName))} maxRows={1} onChange={handleKeyPress} /></Grid>
                        </Grid>
                        <Grid>
                            <Textarea className = "desc" defaultValue={user && user.description} placeholder="Add a description..." minRows={4} maxRows={4}/>
                        </Grid>
                    </Grid>
                    <Grid>
                        <Typography color='green' level='h3'>Your Wallet</Typography>
                        <Grid className="edit-inner">
                            <Textarea className = "wallet" defaultValue={user && user.walletAddress} maxRows={1} disabled slotProps={{
                                textarea: {
                                    'style': {
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap'
                                    }
                                }
                            }} />
                        </Grid>
                    </Grid>
                    <Grid>
                        <Typography color='purple' level='h3'>Your Social Media</Typography>
                        <Grid container direction='column' rowSpacing={3} className="edit-inner">
                            <Grid><Textarea className = "website" defaultValue={user && user.website} placeholder="Add personal website..." /></Grid>
                            <Grid><Textarea className = "twitter" defaultValue={user && user.twitter} placeholder="Add twitter..."/></Grid>
                            <Grid><Textarea className = "instagram" defaultValue={user && user.instagram} placeholder="Add instagram..."/></Grid>
                            <Grid><Textarea className = "reddit" defaultValue={user && user.reddit} placeholder="Add reddit..."/></Grid>
                            <Grid><Textarea className = "discord" defaultValue={user && user.discord} placeholder="Add discord..."/></Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <EditSidebar handleCancel={handleCancel} handleSave={handleSave} />
            </Grid>
            <ErrorPopup isOpen={isFailure} onClose={() => setIsFailure(false)} message={"that username is already taken, please choose another!"}/>
        </div>
      );

}

export default EditProfile;