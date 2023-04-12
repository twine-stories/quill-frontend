import React, { useState, useContext, useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { UserContext } from "../App.tsx";
import { User } from '../utils/types.ts';
import ProfileWork from '../components/ProfileWork.tsx';
import './EditProfile.css';
import "../components/EditSidebar.tsx"
import EditSidebar from '../components/EditSidebar.tsx';
import {Button, FormControl, Textarea} from "@mui/joy";
import { useNavigate } from 'react-router-dom';
import { genericPost } from '../utils/api.ts'; 
import { TwoColoumnLayout } from '../components/TwoColoumnLayout.tsx';
import { PROFILE_IMGS_BUCKET } from "../config.ts";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY } from "../utils/secrets.ts";
import AWS from "aws-sdk";

const axios = require('axios').default;

function EditProfile() {
    const [works, setWorks] = useState<Array<ProfileWork>>();
    const context: object = useContext(UserContext);
    const user: User = context['user'];
    const originalImage: string = user.profileImg;

    useEffect(() => {
        if (user && user.creator && user.walletAddress) {
            axios.get('/api/work/creator/' + user.walletAddress)
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

    const handleSave = () => {
        let firstname: string = document.getElementsByClassName("firstname")[0].getElementsByTagName("textarea")[0].value;
        let lastname: string = document.getElementsByClassName("lastname")[0].getElementsByTagName("textarea")[0].value;
        let username: string = document.getElementsByClassName("username")[0].getElementsByTagName("textarea")[0].value;
        let description: string = document.getElementsByClassName("desc")[0].getElementsByTagName("textarea")[0].value;
        let walletAddress: string = document.getElementsByClassName("wallet")[0].getElementsByTagName("textarea")[0].value;
        let website: string = document.getElementsByClassName("website")[0].getElementsByTagName("textarea")[0].value;
        let twitter: string = document.getElementsByClassName("twitter")[0].getElementsByTagName("textarea")[0].value;
        let instagram: string = document.getElementsByClassName("instagram")[0].getElementsByTagName("textarea")[0].value;
        let reddit: string = document.getElementsByClassName("reddit")[0].getElementsByTagName("textarea")[0].value;
        let discord: string = document.getElementsByClassName("discord")[0].getElementsByTagName("textarea")[0].value;

        
        if ("@" == username[0]) {
            username = username.substring(1);
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


        genericPost('/api/user/update', user);


        try {

            if (originalImage != user.profileImg && originalImage != "default.jpeg") {
                const s3 = new AWS.S3({
                    accessKeyId: ACCESS_KEY_ID as string,
                    secretAccessKey: SECRET_ACCESS_KEY as string,
                    region: "us-east-1",
                    signatureVersion: 'v4',
                });
                
                const params = {
                    Bucket: PROFILE_IMGS_BUCKET as string,
                    Key: originalImage,
                }
    
                s3.deleteObject(params, function(err, data) {
                    if (err) console.log(err, err.stack);  // error
                });
            }
            
        } catch (error) {
            console.error("Error deleting file:", error);
        }


        navigate('/profile/')


    }

    const handleCancel = () => {
        user.profileImg = originalImage;
        navigate('/profile/');
    }

    const handleKeyPress = () => {
        let username: string = document.getElementsByClassName("username")[0].getElementsByTagName("textarea")[0].value;
        if (username.length == 0) {
            document.getElementsByClassName("username")[0].getElementsByTagName("textarea")[0].value = "@";
        } else if ("@" != username[0]) {

            let atIdx = username.indexOf("@");
            let afterAt = username.substring(atIdx+1, username.length);
            document.getElementsByClassName("username")[0].getElementsByTagName("textarea")[0].value = "@" + afterAt;
        }
    }



    return (
        <div>
            <Navbar />
            <div className="entire-page">
                <div className="edit-profile-page">
                    <h1>Edit Profile</h1>
                    <div className="about-profile">
                        <h2>About Profile</h2>
                        <div className="name-info">
                            <Textarea className="firstname" defaultValue={user && user.firstName} maxRows={1} />
                            <Textarea className="lastname" defaultValue={user && user.lastName} maxRows={1} />
                            <Textarea className="username" defaultValue={(user && ("@" + user.userName))} maxRows={1} onChange={handleKeyPress} />
                        </div>
                        <div className="description-info">
                            <Textarea className = "desc" defaultValue={user && user.description} placeholder="Add a description..." minRows={4} maxRows={4}/>
                        </div>
                    </div>
                    <div className="your-wallet">
                        <h2>Your Wallet</h2>
                        <div className="wallet-info">
                            <Textarea className = "wallet" defaultValue={user && user.walletAddress} maxRows={1} disabled />
                        </div>
                    </div>
                    <div className="social-media">
                        <h2>Your Social Media</h2>
                        <div className="social-info">
                            <Textarea className = "website" defaultValue={user && user.website} placeholder="Add personal website..." />
                            <Textarea className = "twitter" defaultValue={user && user.twitter} placeholder="Add twitter..."/>
                            <Textarea className = "instagram" defaultValue={user && user.instagram} placeholder="Add instagram..."/>
                            <Textarea className = "reddit" defaultValue={user && user.reddit} placeholder="Add reddit..."/>
                            <Textarea className = "discord" defaultValue={user && user.discord} placeholder="Add discord..."/>
                        </div>
                    </div>
                </div>
                <EditSidebar handleCancel={handleCancel} handleSave={handleSave} />
            </div>
            

            
        </div>
      );

}

export default EditProfile;