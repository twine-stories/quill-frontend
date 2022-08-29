import { Accounts } from '@randlabs/myalgo-connect';
import React, { useContext, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import { TestContext } from "../App.tsx";

function Home() {
    return (
        <div>
            <Navbar />
            Home
        </div>
    );
}

export default Home;