import React, { useState, useContext, useEffect } from 'react'
import Navbar from '../components/Navbar.tsx'
import { UserContext } from '../App.tsx'
import { User, NFTCollection, Artwork } from '../utils/types.ts'
import { collectionGetByUrl } from '../utils/api.ts'
import { Asset } from '../utils/blockchain/types.ts'
import { genericGet } from '../utils/api.ts'
import Footer from '../components/Footer.tsx'

function Collection() {
    const [coll, setColl] = useState<NFTCollection>()
    const [artwork, setArtwork] = useState<Artwork[]>()
    const [assets, setAssets] = useState<Record<number, Asset>>()
    const [initLoad, setInitLoad] = useState<boolean>(false)
    const [listings, setListings] = useState<JSX.Element[]>([])

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
        }
    }, [coll])

    useEffect(() => {
        if (assets) {
            setInitLoad(true)
        }
    }, [assets])

    return (
        <div>
            <Navbar />
            {coll && (
                <div>
                    <p>{coll.name}</p>
                    {listings}
                </div>
            )}
            <Footer />
        </div>
    )
}

export default Collection
