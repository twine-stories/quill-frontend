import React, { useState, useContext, useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { UserContext } from "../App.tsx";
import { User, Work } from '../utils/types.ts';
import { workGetByUrl } from '../utils/api.ts';

function Story() {

    const [work, setWork] = useState<Work>();
    const context: object = useContext(UserContext);
    const user: User = context['user'];

    useEffect(() => {
        if (user) {
            workGetByUrl(window.location.href.split('/')[4], setWork, () => {
                console.log('fail');
            });
        }
    }, [user]);

    return (
        <div>
            <Navbar />
            {work &&
                <div>
                    <p>{work['title']}</p>
                    <p>by {work['creator']['displayName']}</p>
                </div>
            }
        </div>
    );
}

export default Story;