import React, { useState, useContext, useEffect } from 'react'
import './ArtPiece.css'
import Navbar from '../components/Navbar.tsx'
import { UserContext } from '../App.tsx'
import { User, NFTCollection, Artwork, AdminApp, ProfitSplit } from '../utils/types.ts'
import { collectionGetByUrl } from '../utils/api.ts'
import { genericGet, genericPost } from '../utils/api.ts'
import TwineButton from '../components/TwineButton.tsx'
import { buy } from '../utils/blockchain/transactionRepository.ts'
import { Grid, Typography } from '@mui/joy'
import SuccessPopup from '../components/SuccessPopup.tsx'

function ArtPiece() {

    const [coll, setColl] = useState<NFTCollection>()
    const [artwork, setArtwork] = useState<Artwork>()
    const [artUrl, setArtUrl] = useState<string>()
    const [artName, setArtName] = useState<string>()
    const [artDesc, setArtDesc] = useState<string>()
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [purchased, setPurchased] = useState<boolean>(false);

    const [profitSplits, setProfitSplits] = useState<ProfitSplit[]>([]);

    const [appCall, setAppCall] = useState<string>()
    const [adminAddr, setAdminAddr] = useState<string>()

    const context: object = useContext(UserContext)
    const user: User = context['user']

    useEffect(() => {
        const urlSplit: string[] = window.location.href.split('/')
        collectionGetByUrl(urlSplit[4]).then(
            (response: NFTCollection) => {
                setColl(response)
                genericGet('/api/profitSplit/collection/' + response.id).then((splits: ProfitSplit[]) => {
                    setProfitSplits(splits)
                })
            }
        )

        genericGet('/api/artwork/' + urlSplit[5]).then((response: Artwork) => {
            setArtwork(response)
            setPurchased(!response.currColl)
            if (user) {
                genericPost('/api/algo/app-call-txn/buy', {
                    assetId: response.id,
                    buyer: user.walletAddress
                }).then((appCallStr: string) => {
                    setAppCall(appCallStr)
                })
            }

            genericGet('/api/algo/asset-img/' + response.id).then((url: string) => {
                setArtUrl(url)
            })

            genericGet('/api/algo/asset-desc/' + response.id).then((desc: string) => {
                setArtDesc(desc)
            })

            genericGet('/api/algo/asset-name/' + response.id).then((name: string) => {
                setArtName(name)
            })
        })

        genericGet('/api/algo/admin-app/get-latest').then((response: AdminApp) => {
            setAdminAddr(response.address)
        })
    }, [user])

    return (
        <div>
            <Navbar />
            <Grid container alignItems="center" justifyContent="center">
                <Grid sx={{width: '60vw'}}>
                    <Grid container flexDirection="column" alignItems="flex-start" justifyContent="center">
                        <Typography level='h2' color='purple' sx={{marginBottom: '0px', cursor: 'pointer'}} onClick={() => {window.location.href = '/collection/' + coll?.url}}>{artName}</Typography>
                        <Grid container alignItems='center'>
                            <Typography level='h6' color='white' sx={{fontSize: '15px', fontWeight: 'bold'}}>Author: @{coll?.work.creator.userName}</Typography>
                            <img
                                src="/icons/dot.svg"
                                width="2px"
                                height="2px"
                                style={{marginLeft: '10px', marginRight: '10px'}}
                            />
                            <Typography level='h6' color='white' sx={{fontSize: '15px', fontWeight: 'bold'}}>Story: {coll?.work.title}</Typography>
                        </Grid>
                        <Grid container alignItems="flex-start" justifyContent="space-between" xs={12}>
                            <img id="art-piece-img" src={artUrl} />
                            <Grid xs={5}>
                                <Typography level='h4' color='white' sx={{fontSize: '18px', marginBottom: '30px'}}>{artDesc}</Typography>
                                <Grid container flexDirection='column' xs={12} id='buy-art-panel'>
                                    <Typography level='h3' color='purple'>Buy Art</Typography>
                                    <Grid container flexDirection='row' alignItems='center'>
                                        <Typography level='h5' color='purple'>Price: {coll?.price}</Typography>
                                        <img src='/icons/algo.svg' />
                                    </Grid>
                                    {purchased ?
                                        <TwineButton color='green' name='Purchased' enabled={false} action={() => {}} />
                                        :
                                        <TwineButton color='green' name='Purchase' enabled={user && coll && user.walletAddress !== coll.work.creator.walletAddress} action={async () => {
                                            if (user && adminAddr && artwork && appCall && coll) {
                                                const txns: string[] = await buy(adminAddr, user.walletAddress, profitSplits, BigInt(coll.price * 1000000), artwork.id, appCall, user.connectType)
                                                const response: string = await genericPost('/api/algo/buy-art', {
                                                    assetId: artwork.id,
                                                    signedOptIn: txns[0],
                                                    signedPays: txns.slice(2),
                                                    unsignedCall: txns[1],
                                                })

                                                if (response === 'Success') {
                                                    setPurchased(true);
                                                    setShowSuccess(true);
                                                }
                                            }
                                        }} />
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <SuccessPopup isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
        </div>
    )
}

export default ArtPiece
