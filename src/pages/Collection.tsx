import React, { useState, useContext, useEffect } from 'react'
import Navbar from '../components/Navbar.tsx'
import { UserContext } from '../App.tsx'
import { User, NFTCollection, Artwork } from '../utils/types.ts'
import { collectionGetByUrl } from '../utils/api.ts'
import { Asset } from '../utils/blockchain/types.ts'
import { genericGet } from '../utils/api.ts'
import { Grid, Typography } from '@mui/joy'
import GalleryTile from '../components/GalleryTile.tsx'
import TwineButton from '../components/TwineButton.tsx'

function Collection() {
    const [coll, setColl] = useState<NFTCollection>()
    const [artwork, setArtwork] = useState<Artwork[]>()
    const [nftTiles, setNftTiles] = useState<JSX.Element[]>([])

    const context: object = useContext(UserContext)
    const user: User = context['user']

    useEffect(() => {
        if (user) {
            collectionGetByUrl(window.location.href.split('/')[4]).then(
                (response: NFTCollection) => {
                    setColl(response)
                }
            )
        }
    }, [user])

    useEffect(() => {
        if (coll) {
            genericGet('/api/artwork/collection/' + coll.id).then(
                (response: Artwork[]) => {
                    setArtwork(response)
                }
            )

            genericGet('/api/algo/asset-imgs/' + coll.id).then((response) => {
                let nftImgs: JSX.Element[] = []
                let count: number = 0
                for (const id in response) {
                    nftImgs.push(
                        <GalleryTile
                            key={count}
                            img={response[id]}
                            artId={parseInt(id)}
                        />
                    )
                    count++
                }

                setNftTiles(nftImgs)
            })
        }
    }, [coll])

    return (
        <div>
            <Navbar />
            {coll && (
                <div>
                    <Typography level="h2" color="purple">
                        {coll.name}
                    </Typography>
                    {user.walletAddress === coll.work.creator.walletAddress && (
                        <TwineButton
                            name="Edit Collection"
                            color="blackpurple"
                            icon="/icons/purple_settings.svg"
                            sx={{ width: '90%' }}
                            action={() => {
                                window.location.href =
                                    '/edit/collection/' + coll.url
                            }}
                        />
                    )}
                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        flexWrap="wrap"
                    >
                        {nftTiles}
                    </Grid>
                </div>
            )}
        </div>
    )
}

export default Collection
