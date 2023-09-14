import React, { useState, useContext, useEffect } from 'react'
import Navbar from '../components/Navbar.tsx'
import { UserContext } from '../App.tsx'
import { User, NFTCollection, Artwork, AdminApp } from '../utils/types.ts'
import { collectionGetByUrl } from '../utils/api.ts'
import { genericGet, genericPost } from '../utils/api.ts'
import TwineButton from '../components/TwineButton.tsx'
import { buy } from '../utils/blockchain/transactionRepository.ts'

function ArtPiece() {

    const [coll, setColl] = useState<NFTCollection>()
    const [artwork, setArtwork] = useState<Artwork>()
    const [artTiles, setArtTiles] = useState<JSX.Element[]>([])

    const [appCall, setAppCall] = useState<string>()
    const [adminAddr, setAdminAddr] = useState<string>()

    const context: object = useContext(UserContext)
    const user: User = context['user']

    useEffect(() => {
        const urlSplit: string[] = window.location.href.split('/')
        collectionGetByUrl(urlSplit[4]).then(
            (response: NFTCollection) => {
                setColl(response)
            }
        )

        genericGet('/api/artwork/' + urlSplit[5]).then((response: Artwork) => {
            setArtwork(response)
            if (user) {
                genericGet('/api/algo/app-call-txn/' + response.id + '/' + user.walletAddress).then((appCallStr: string) => {
                    setAppCall(appCallStr)
                })
            }
        })

        genericGet('/api/algo/admin-app/get-latest').then((response: AdminApp) => {
            setAdminAddr(response.address)
        })
    }, [user])

    return (
        <div>
            <Navbar />
            <TwineButton color='purple' name='Buy' enabled={user && coll && user.walletAddress !== coll.work.creator.walletAddress} action={async () => {
                if (user && adminAddr && artwork && appCall && coll) {
                    const txns: string[] = await buy(adminAddr, user.walletAddress, coll.work.creator.walletAddress, BigInt(coll.price * 1000000), artwork.id, appCall, user.connectType)
                    const response: string = await genericPost('/api/algo/buy-art', {
                        assetId: artwork.id,
                        signedOptIn: txns[0],
                        signedPay: txns[1],
                        unsignedCall: txns[2],
                    })

                    if (response === 'Success') {
                        console.log("we in this bitch fr fr")
                    }
                }
            }} />
        </div>
    )
}

export default ArtPiece
