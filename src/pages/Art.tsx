import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.tsx'
import { NFTCollection } from '../utils/types.ts'
import { collectionGetAll } from '../utils/api.ts'
import { env } from '../config.ts'
import { Typography, Grid } from '@mui/joy'
import './Art.css'
import GalleryTile from '../components/GalleryTile.tsx'

function Art() {
    const [colls, setColls] = useState<NFTCollection[]>()
    const [collListings, setCollListings] = useState<JSX.Element[]>()

    useEffect(() => {
        collectionGetAll().then((response: NFTCollection[]) => {
            let filteredResponse: NFTCollection[] = response.filter(
                (elem: NFTCollection) => (elem.active === true)
            )
            setColls(filteredResponse)

            let listings: JSX.Element[] = []
            filteredResponse.forEach((elem: NFTCollection) => {
                listings.push(
                    <GalleryTile coll={elem} />
                )
            })

            setCollListings(listings)
        })
    }, [])

    return (
        <div id="art-page">
            <Navbar />
            <Grid>
                <Typography className="h2-art-text" level="h2" color="purple">
                    All Collections
                </Typography>

                <Grid
                    container
                    justifyContent="flex-start"
                    sx={{ padding: '32px' }}
                >
                    {collListings}
                </Grid>
            </Grid>
        </div>
    )
}

export default Art
