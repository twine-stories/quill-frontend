import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.tsx";
import { UserContext } from "../App.tsx";
import { User } from '../utils/types.ts';
import ProfileWork from '../components/ProfileWork.tsx';
import './Profile.css';
import "../components/ProfileSidebar.tsx"
import ProfileSidebar from '../components/ProfileSidebar.tsx';
import {Button} from "@mui/joy";
import { PROFILE_IMGS_BUCKET } from '../config.ts';

const axios = require('axios').default;

function Profile() {
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

    let navigate = useNavigate();

    const editProfile = () => {
        navigate('/edit-profile');
    }


    return (
        <div>
            <Navbar />
            <div className="profile-page">
                <div className="profile-info">
                    <img
                        src = {user && 'https://'+PROFILE_IMGS_BUCKET+'.s3.amazonaws.com/'+user.profileImg}
                        alt = ""
                        width = "128"
                        height = "128"
                        onError={e => {
                            e.currentTarget.src = 'https://'+PROFILE_IMGS_BUCKET+'.s3.amazonaws.com/default.jpeg'
                        }}
                    />
                    <div className="name-username">
                        <h2 >@{user && user.userName}</h2>
                        <h1 >{user && user.firstName} {user && user.lastName}</h1>
                        <div className="edit-notif">
                            <Button href="/edit-profile" className="edit-profile-btn" onClick={editProfile}>Edit Profile</Button>
                            <Button className="notif-btn">Bell</Button>
                        </div>
                        <p > {user && user.description}</p>
                    </div>
                    <ProfileSidebar />
                </div>
            </div>

            
        </div>
      );
}

export default Profile;