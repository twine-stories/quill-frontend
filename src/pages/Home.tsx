import React, { useContext, useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar.tsx'
import HomeSlot from '../components/HomeSlot.tsx'
import IconButton from '../components/IconButton.tsx'
import TwineButton from '../components/TwineButton.tsx'
import { genericGet } from '../utils/api.ts'
import { Work } from '../utils/types.ts'
import { Grid } from '@mui/joy'
import Footer from '../components/layout/Footer.tsx'

function Home() {
    const [homeWorks, setHomeWorks] = useState<Work[]>([])
    const [toggle, setToggle] = useState<boolean>(false)

    useEffect(() => {
        genericGet('/api/work/random/3').then((response: Work[]) => {
            setHomeWorks(shuffle(response))
        })
    }, [toggle])

    const shuffle = (array: Work[]) => {
        let currentIndex: number = array.length,
            randomIndex: number

        // While there remain elements to shuffle.
        while (currentIndex != 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--

            // And swap it with the current element.
            ;[array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ]
        }

        return array
    }

    // change titles to Featured, Hot, and, Discover once real algos are implemented
    return (
        <div>
            <Navbar />
            <Grid
                container
                alignItems="flex-end"
                justifyContent="space-between"
            >
                <HomeSlot
                    work={homeWorks.length > 0 ? homeWorks[0] : null}
                    title=""
                />
                <HomeSlot
                    work={homeWorks.length > 1 ? homeWorks[1] : null}
                    title=""
                />
                <HomeSlot
                    work={homeWorks.length > 2 ? homeWorks[2] : null}
                    title=""
                />
            </Grid>
            <Grid
                sx={{ marginTop: '20px' }}
                container
                alignItems="center"
                justifyContent="space-between"
            >
                <TwineButton
                    icon="/icons/filter.svg"
                    enabled={false}
                    name="Filter"
                />
                <IconButton
                    sx={{ borderRadius: '50%', height: '45px', width: '45px' }}
                    icon="/icons/shuffle.svg"
                    customSize='26px'
                    action={() => {
                        setToggle(!toggle)
                    }}
                />
            </Grid>
            <Footer/>
        </div>
    )
}

export default Home
