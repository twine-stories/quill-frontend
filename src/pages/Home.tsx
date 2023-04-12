import React, { useContext, useState, useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import HomeSlot from '../components/HomeSlot.tsx';
import { genericGet } from '../utils/api.ts';
import { Work } from '../utils/types.ts';
import { Grid } from '@mui/joy';

function Home() {

    const [homeWorks, setHomeWorks] = useState<Work[]>([]);

    useEffect(() => {
        genericGet('/api/work/random/3').then((response: Work[]) => {
            setHomeWorks(response);
        });
    }, []);

    // change titles to Featured, Hot, and, Discover once real algos are implemented
    return (
        <div>
            <Navbar />
            <Grid container alignItems='flex-start' justifyContent='space-around'>
                <HomeSlot work={homeWorks.length > 0 ? homeWorks[0] : null} title='' />
                <HomeSlot work={homeWorks.length > 1 ? homeWorks[1] : null} title='' />
                <HomeSlot work={homeWorks.length > 2 ? homeWorks[2] : null} title='' />
            </Grid>
        </div>
    );
}

export default Home;