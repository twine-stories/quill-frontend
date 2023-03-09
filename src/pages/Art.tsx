import React, { useState, useContext, useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { NFTCollection } from '../utils/types.ts';
import { collectionGetAll } from '../utils/api.ts';


function Art() {
    const [colls, setColls] = useState<NFTCollection[]>();

    useEffect(() => {
        collectionGetAll().then((response: NFTCollection[]) => {
            let filteredResponse: NFTCollection[] = response.filter((elem: NFTCollection) => elem.active = true);
            setColls(filteredResponse);
        });
    }, []);

    let collListings: JSX.Element[] = [];
    colls?.forEach((elem: NFTCollection) => {
        collListings.push(<div key={elem.id}>
            <a href={"/collection/" + elem.url}>{elem.name}</a>
        </div>)
    });

    return (
        <div>
            <Navbar />
            {collListings}
        </div>
    );
}

export default Art;