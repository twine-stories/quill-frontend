import React, { useState, useContext } from 'react';
import Navbar from "../components/Navbar.tsx";
import { UserContext } from "../App.tsx";

function Profile() {

    const account: object = useContext(UserContext);

    return (
        <div>
            <Navbar />
            {account['walletAddr']}
        </div>
    );
}

export default Profile;