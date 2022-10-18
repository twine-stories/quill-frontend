import React, { useContext, useState } from 'react';
import { UserContext } from '../App.tsx';
import Navbar from "../components/Navbar.tsx";

function Create() {
    const context: object = useContext(UserContext);
    if (context['userLoaded'] === true && !context['user']) {
        window.location.href = '/';
    }

    return (
        <div>
            <Navbar />
            Create
        </div>
    );
}

export default Create;