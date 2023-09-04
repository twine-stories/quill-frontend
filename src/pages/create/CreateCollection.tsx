import './CreateCollection.css'
import React, { useEffect, useContext, createContext } from 'react'
import useState from 'react-usestateref'
import './CreateArtwork.css'
import { UserContext } from '../../App.tsx'
import Navbar from '../../components/Navbar.tsx'
import { Typography, Grid } from '@mui/joy'
import { CollaboratorContext } from './Create.tsx'
import { v4 as uuidv4 } from 'uuid'
import { MAX_COLLABORATORS_SMART_CONTRACTS } from '../../utils/constants.ts'
import Collaborator from '../../components/Collaborator.tsx'
import TwineButton from '../../components/TwineButton.tsx'
import { User, ProfitSplit, NFTCollection } from '../../utils/types.ts'
import { genericGet } from '../../utils/api.ts'
import GalleryTile from '../../components/GalleryTile.tsx'
import TwineInput from '../../components/TwineInput.tsx'

interface CreateCollectionProps {
    edit?: boolean
}

type AlgorandAsset = {
    id: number
    url: string
}

export const ArtworkContext = createContext(null as any)

function CreateCollection(props: CreateCollectionProps) {

    const context: object = useContext(UserContext)
    const user: User = context['user'];

    const [collection, setCollection] = useState<NFTCollection>();
    const [collaborators, setCollaborators] = useState<JSX.Element[]>([])
    const [populatedForEdit, setPopulatedForEdit] = useState<boolean>(false)

    const [nfts, setNfts, nftsRef] = useState<Map<number, AlgorandAsset>>(new Map());

    const [sellableNfts, setSellableNfts] = useState<JSX.Element[]>([])
    const [selectedNfts, setSelectedNfts] = useState<Set<number>>(new Set())

    useEffect(() => {
        if (user && !props.edit && collaborators.length === 0) {
            setCollaborators([
                <Collaborator
                    profitSplit={true}
                    defaultCreator={user.userName}
                    defaultWallet={user.walletAddress}
                    defaultProfit={100}
                    principle={true}
                    id={uuidv4()}
                    key={uuidv4()}
                />,
            ])
        }

        if (user) {
            genericGet('/api/algo/assets/' + user.walletAddress).then((response: AlgorandAsset[]) => {
                if (response) {
                    let assets: Map<number, AlgorandAsset> = new Map()
                    response.forEach((asset) => {
                        assets.set(asset.id, asset)
                    })
                    setNfts(new Map([...assets, ...nftsRef.current]))
                }
            })
        }
    }, [user])

    useEffect(() => {
        if (user && props.edit) {
            genericGet('/api/collection/url/' + window.location.href.split('/'[5])).then((response: NFTCollection) => {
                setCollection(response);
            })
        }
    }, [props.edit, user])

    useEffect(() => {
        if (user && props.edit && collection && !populatedForEdit) {
            setPopulatedForEdit(true)

            genericGet('/api/profitSplit/collection/' + collection.id).then(
                (response: ProfitSplit[]) => {
                    let collabs: JSX.Element[] = [<div></div>]
                    response.forEach((item: ProfitSplit) => {
                        if (
                            item.creator.userName !==
                            collection.work.creator.userName
                        ) {
                            collabs.push(
                                <Collaborator
                                    profitSplit={true}
                                    defaultCreator={item.creator.userName}
                                    defaultWallet={item.creator.walletAddress}
                                    defaultProfit={item.percentage}
                                    principle={false}
                                    id={uuidv4()}
                                    key={uuidv4()}
                                />
                            )
                        } else {
                            collabs[0] = (
                                <Collaborator
                                    profitSplit={true}
                                    defaultCreator={item.creator.userName}
                                    defaultWallet={item.creator.walletAddress}
                                    defaultProfit={item.percentage}
                                    principle={true}
                                    id={uuidv4()}
                                    key={uuidv4()}
                                />
                            )
                        }
                    })
                    setCollaborators(collabs)
                }
            )
        }
    }, [props.edit, user, collection]);

    useEffect(() => {
        let nftImgs: JSX.Element[] = []
        let count: number = 0
        nfts.forEach((nft) => {
            nftImgs.push(
                <GalleryTile key={count} img={nft.url} artId={nft.id} />
            )
            count++
        })

        setSellableNfts(nftImgs);
    }, [nfts])

    const removeCollaborator = (id: number): void => {
        let newCollaborators: JSX.Element[] = []
        collaborators.forEach((collaborator: JSX.Element) => {
            if (collaborator.props.id !== id) {
                newCollaborators.push(collaborator)
            }
        })

        setCollaborators(newCollaborators)
    }

    const selectArtwork = (id: number): void => {
        let found: boolean = false
        let newSelectedNfts: Set<number> = new Set()
        selectedNfts.forEach((nft: number) => {
            if (nft === id) {
                found = true
            } else {
                newSelectedNfts.add(nft)
            }
        })

        if (!found) {
            newSelectedNfts.add(id)
        }

        setSelectedNfts(newSelectedNfts)
    }

    return (
        <div>
            <Navbar />
            <Grid>
                <Typography
                    level="h2"
                    color="purple"
                    sx={{ paddingLeft: '16px' }}
                >
                    Publish Art Collection
                </Typography>
                <Grid sx={{ marginLeft: '32px' }}>
                    <Typography level='h3' color='green' sx={{fontSize: "22px"}}>Profit Split</Typography>
                    <CollaboratorContext.Provider
                        value={{
                            remove: removeCollaborator,
                        }}
                    >
                        <Grid
                            container
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            xs={12}
                        >
                            {collaborators}
                            <TwineButton
                                name="Add Collaborator"
                                enabled={
                                    collaborators.length <
                                    MAX_COLLABORATORS_SMART_CONTRACTS
                                }
                                sx={{ marginTop: '20px' }}
                                action={() => {
                                    if (
                                        collaborators.length <
                                        MAX_COLLABORATORS_SMART_CONTRACTS
                                    ) {
                                        const id: number = uuidv4()
                                        setCollaborators([
                                            ...collaborators,
                                            <Collaborator
                                                profitSplit={true}
                                                principle={false}
                                                id={id}
                                                key={id}
                                            />,
                                        ])
                                    }
                                }}
                            />
                        </Grid>
                    </CollaboratorContext.Provider>
                </Grid>
                <Grid sx={{ marginTop: '40px' }}>
                    <Typography level='h3' color='green' sx={{ fontSize: "22px", paddingLeft: '32px' }}>
                        Select Artwork
                    </Typography>
                    <ArtworkContext.Provider
                        value={{
                            select: selectArtwork,
                        }}
                    >
                        <Grid container direction='row' alignItems='center' justifyContent='flex-start' flexWrap='wrap'>
                            {sellableNfts}
                        </Grid>
                    </ArtworkContext.Provider>
                </Grid>

                <Grid sx={{ marginTop: '40px', paddingLeft: '32px' }}>
                    <Typography level='h3' color='green' sx={{ fontSize: "22px" }}>
                        Fixed Price
                    </Typography>
                    <Grid id="create-coll-fields">
                        <TwineInput label='Collection name' placeholder='name'
                            inputAttrs={{
                                id: 'collection-name-field',
                            }} />
                        <TwineInput label='Description' multiline rows={3} placeholder='description'
                            inputAttrs={{
                                id: 'collection-desc-field',
                            }} />
                        <TwineInput label='Price per artwork' type="number" placeholder='price'
                            inputAttrs={{
                                id: 'collection-price-field',
                            }}
                            endDecorator="/icons/algo.svg" />
                    </Grid>
                </Grid>

                <Grid sx={{ marginTop: '40px', paddingLeft: '32px' }}>
                    <TwineButton color='green' name='Save Draft' enabled={false} action={() => {}} />
                </Grid>
            </Grid>
        </div>
    )
}

export default CreateCollection
