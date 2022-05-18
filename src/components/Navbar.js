import React, { useState } from 'react';
import styled from "styled-components";

const NavDiv = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
`;

function Navbar() {

    return (
        <NavDiv>
            <a href="/">Home</a>
            <a href="/written">Written</a>
            <a href="/illustrated">Illustrated</a>
            <a href="/create">Create</a>
            <a href="/profile">Profile</a>
        </NavDiv>
    );
}

export default Navbar;