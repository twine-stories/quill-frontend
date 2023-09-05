import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.tsx'
import { NFTCollection } from '../utils/types.ts'
import { collectionGetAll } from '../utils/api.ts'
import {env, STORY_IMGS_BUCKET} from '../config.ts'
import { Typography, Grid } from '@mui/joy'
import './Art.css'
import {STORY_BANNER_PATH} from "../utils/aws";
import GalleryTile from "../components/GalleryTile.tsx";

function Art() {
    const [colls, setColls] = useState<NFTCollection[]>()

    useEffect(() => {
        collectionGetAll().then((response: NFTCollection[]) => {
            let filteredResponse: NFTCollection[] = response.filter(
                (elem: NFTCollection) => (elem.active = true)
            )
            setColls(filteredResponse)
        })
    }, [])

    let collListings: JSX.Element[] = []
    colls?.forEach((elem: NFTCollection) => {
        collListings.push(
            <div key={elem.id}>
                <a href={'/collection/' + elem.url}>{elem.name}</a>
            </div>
        )
    })

    return (
        <div>
            <Navbar />
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="space-around"
            >
                <Typography className="h2-art-text" level="h2" color="purple">
                    NFT Marketplace Launch
                </Typography>

                <Typography level="h4" color="green">
                    Coming Soon!
                </Typography>

                <img
                    src='/icons/otris/otris_logo.png'
                    loading="lazy"
                    alt=""
                    style={{
                        // aspectRatio: '4.4/1',
                        width: '25%',
                        objectFit: 'contain',
                        borderRadius: '20px',
                    }}
                />

                <Typography className="h2-art-text" level="h1" color="purple">
                    Early Access Drop Lineup
                </Typography>

                <img
                    src='/icons/otris/banner.png'
                    loading="lazy"
                    alt=""
                    style={{
                        width: '100%',
                        objectFit: 'cover',
                        borderRadius: '20px',
                    }}
                />

                <Grid
                    container
                    spacing={2}
                    columns={{ xs: 2, sm: 4, md: 6, lg: 10 }}
                    sx={{ padding: '12px' }}
                >
                    <GalleryTile img={'/icons/otris/1.png'} otris={"The Discovery"} />
                    <GalleryTile img={'/icons/otris/2.png'} otris={"Welcome To Otris"} />
                    <GalleryTile img={'/icons/otris/3.png'} otris={"A Walk In The Night"} />
                    <GalleryTile img={'/icons/otris/4.png'} otris={"View From The Water Fruits"} />
                    <GalleryTile img={'/icons/otris/5.png'} otris={"Crown Of Fakra"} />
                    <GalleryTile img={'/icons/otris/6.png'} otris={"Chop It Up Chak!"} />
                    <GalleryTile img={'/icons/otris/7.png'} otris={"Across The Paddies"} />
                    <GalleryTile img={'/icons/otris/8.png'} otris={"A Clean Whack"} />
                    <GalleryTile img={'/icons/otris/9.png'} otris={"Boulder Eats"} />
                    <GalleryTile img={'/icons/otris/10.png'} otris={"Hammer Time"} />
                    <GalleryTile img={'/icons/otris/11.png'} otris={"Into The Open Forest"} />
                    <GalleryTile img={'/icons/otris/12.png'} otris={"If I Tell Kanko"} />
                    <GalleryTile img={'/icons/otris/13.png'} otris={"My Friend The Butterfly"} />
                    <GalleryTile img={'/icons/otris/14.png'} otris={"Hi Bordrax"} />
                    <GalleryTile img={'/icons/otris/15.png'} otris={"Contact With Bacteria Arms"} />
                    <GalleryTile img={'/icons/otris/16.png'} otris={"Stop Squealing While I Smack"} />
                    <GalleryTile img={'/icons/otris/17.png'} otris={"Feeding My Friends"} />
                    <GalleryTile img={'/icons/otris/18.png'} otris={"Bring It"} />
                    <GalleryTile img={'/icons/otris/19.png'} otris={"Jump The Leaf"} />
                    <GalleryTile img={'/icons/otris/20.png'} otris={"Olives"} />
                    <GalleryTile img={'/icons/otris/21.png'} otris={"The DNA Ravager"} />
                    <GalleryTile img={'/icons/otris/22.png'} otris={"Don't Play, Asar"} />
                    <GalleryTile img={'/icons/otris/23.png'} otris={"Oh My, It Moved!"} />
                    <GalleryTile img={'/icons/otris/24.png'} otris={"Buoy Bombs In Brackish Pond"} />
                    <GalleryTile img={'/icons/otris/25.png'} otris={"Ah Hagbag, I Popped It"} />
                    <GalleryTile img={'/icons/otris/26.png'} otris={"A Decisive Evening"} />
                    <GalleryTile img={'/icons/otris/27.png'} otris={"You Are Domesticated"} />
                    <GalleryTile img={'/icons/otris/28.png'} otris={"Get Back"} />
                    <GalleryTile img={'/icons/otris/29.png'} otris={"I See You"} />
                    <GalleryTile img={'/icons/otris/30.png'} otris={"Algae Torpedo In Biggle Forest"} />
                </Grid>

                {env === 'dev' && collListings}
            </Grid>
        </div>
    )
}

export default Art
