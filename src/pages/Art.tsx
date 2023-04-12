import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { NFTCollection } from '../utils/types.ts';
import { collectionGetAll } from '../utils/api.ts';
import { env } from '../config.ts';
import { Typography, Grid } from "@mui/joy";

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
            <Grid container direction='column' alignItems='center' justifyContent='space-around' height='80vh'>
                {env === 'dev' ? collListings : 
                    <Typography level='h2' color='purple'>Digital Art Marketplace Coming Soon!</Typography>
                }
            </Grid>
        </div>
    );
}

export default Art;