import React, { useState, useContext, useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { UserContext } from "../App.tsx";
import { User } from '../utils/types.ts';
import ProfileWork from '../components/ProfileWork.tsx';
import './EditProfile.css';
import "../components/EditSidebar.tsx"
import EditSidebar from '../components/EditSidebar.tsx';
import {Button, FormControl, Textarea} from "@mui/joy";

const axios = require('axios').default;

function EditProfile() {
    const [works, setWorks] = useState<Array<ProfileWork>>();
    const context: object = useContext(UserContext);
    const user: User = context['user'];

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



    return (
        <div>
            <Navbar />
            <div className="entire-page">
                <div className="edit-profile-page">
                    <h1 align="left">Edit Profile</h1>
                    <FormControl>
                        <div className="about-profile">
                            <h2 align="left">About Profile</h2>
                            <div className="name-info">
                                <Textarea className="name" defaultValue={user && user.firstName + " " + user.lastName} maxRows={1} />
                                <Textarea className="username" defaultValue={"@" + (user && user.displayName)} maxRows={1} />
                            </div>
                            <div className="description-info">
                                <Textarea defaultValue={user && user.description} placeholder="Add a description..." minRows={4} maxRows={4}/>
                            </div>
                        </div>
                        <div className="your-wallet">
                            <h2 align="left">Your Wallet</h2>
                            <div className="wallet-info">
                                <Textarea defaultValue={user && user.walletAddress} maxRows={1} />
                            </div>
                        </div>
                        <div className="social-media">
                            <h2 align="left">Your Social Media</h2>
                            <div className="social-info">
                                <Textarea defaultValue={user && user.website} placeholder="Add personal website..." />
                                <Textarea defaultValue={user && user.twitter} placeholder="Add twitter..."/>
                                <Textarea defaultValue={user && user.instagram} placeholder="Add instagram..."/>
                                <Textarea defaultValue={user && user.reddit} placeholder="Add reddit..."/>
                                <Textarea defaultValue={user && user.discord} placeholder="Add discord..."/>
                            </div>
                        </div>
                    </FormControl>
                </div>
                <EditSidebar />
            </div>
            

            
        </div>
      );

}

export default EditProfile;