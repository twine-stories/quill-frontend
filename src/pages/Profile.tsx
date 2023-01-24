import React, { useState, useContext, useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { UserContext } from "../App.tsx";
import { User } from '../utils/types.ts';
import ProfileWork from '../components/ProfileWork.tsx';

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

    return (
        <div>
            <Navbar />
            {user && <p>{user.firstName}</p>}
            {user && user.creator &&
                works
            }
        </div>
    );
}

export default Profile;