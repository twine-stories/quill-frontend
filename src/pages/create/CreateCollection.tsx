import './CreateCollection.css'
import React, { useEffect, useContext, createContext } from 'react'
import useState from 'react-usestateref'
import './CreateArtwork.css'
import { UserContext } from '../../App.tsx'
import Navbar from '../../components/Navbar.tsx'
import { Typography, Grid, Option } from '@mui/joy'
import { CollaboratorContext } from './Create.tsx'
import { v4 as uuidv4 } from 'uuid'
import { MAX_COLLABORATORS_SMART_CONTRACTS } from '../../utils/constants.ts'
import Collaborator from '../../components/Collaborator.tsx'
import TwineButton from '../../components/TwineButton.tsx'
import {
    User,
    ProfitSplit,
    NFTCollection,
    Work,
    Artwork,
} from '../../utils/types.ts'
import { genericGet, genericPost } from '../../utils/api.ts'
import GalleryTile from '../../components/GalleryTile.tsx'
import TwineInput from '../../components/TwineInput.tsx'
import TwineSelect from '../../components/TwineSelect.tsx'
import { CollectionType } from '../../utils/enums.ts'

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
    const user: User = context['user']

    const [collection, setCollection] = useState<NFTCollection>()
    const [collaborators, setCollaborators] = useState<JSX.Element[]>([])
    const [populatedForEdit, setPopulatedForEdit] = useState<boolean>(false)

    const [nfts, setNfts, nftsRef] = useState<Map<number, AlgorandAsset>>(
        new Map()
    )

    const [sellableNfts, setSellableNfts] = useState<JSX.Element[]>([])
    const [selectedNfts, setSelectedNfts] = useState<Set<number>>(new Set())

    const [works, setWorks] = useState<Map<number, Work>>(new Map())

    const [selectedWork, setSelectedWork] = useState<number>()

    const [showNfts, setShowNfts] = useState<boolean>(props.edit ? false : true)

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
            genericGet('/api/algo/assets/' + user.walletAddress).then(
                (response: AlgorandAsset[]) => {
                    if (response) {
                        let assets: Map<number, AlgorandAsset> = new Map()
                        response.forEach((asset) => {
                            assets.set(asset.id, asset)
                        })
                        setNfts(new Map([...assets, ...nftsRef.current]))
                    }
                }
            )

            genericGet(
                '/api/work/creator/published/' + user.walletAddress
            ).then((response: Work[]) => {
                if (response) {
                    let worksMap: Map<number, Work> = new Map()
                    response.forEach((item: Work) => {
                        worksMap.set(item.id, item)
                    })
                    setWorks(worksMap)
                }
            })
        }
    }, [user])

    useEffect(() => {
        if (user && props.edit) {
            genericGet(
                '/api/collection/url/' + window.location.href.split('/')[5]
            ).then((response: NFTCollection) => {
                setCollection(response)
                setSelectedWork(response.work.id)

                genericGet('/api/artwork/collection/' + response.id).then(
                    (response: Artwork[]) => {
                        if (response) {
                            setSelectedNfts(
                                new Set(response.map((art) => art.id))
                            )
                            setShowNfts(true)
                        }
                    }
                )

                genericGet('/api/profitSplit/collection/' + response.id).then(
                    (splits: ProfitSplit[]) => {
                        if (splits) {
                            let collabs: JSX.Element[] = [<div></div>]
                            splits.forEach((item: ProfitSplit) => {
                                if (
                                    item.creator.userName !==
                                    response.work.creator.userName
                                ) {
                                    collabs.push(
                                        <Collaborator
                                            profitSplit={true}
                                            defaultCreator={
                                                item.creator.userName
                                            }
                                            defaultWallet={
                                                item.creator.walletAddress
                                            }
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
                                            defaultCreator={
                                                item.creator.userName
                                            }
                                            defaultWallet={
                                                item.creator.walletAddress
                                            }
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
                    }
                )
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
    }, [props.edit, user, collection])

    useEffect(() => {
        if (showNfts) {
            let nftImgs: JSX.Element[] = []
            let count: number = 0
            nfts.forEach((nft) => {
                nftImgs.push(
                    <GalleryTile
                        key={count}
                        img={nft.url}
                        artId={nft.id}
                        noBorder={!selectedNfts.has(nft.id)}
                    />
                )
                count++
            })

            setSellableNfts(nftImgs)
        }
    }, [showNfts, nfts])

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

    const saveCollection = async (publish: boolean): Promise<void> => {
        if (selectedNfts.size == 0) {
            return
        }

        const name = (
            document.getElementById('collection-name-field') as HTMLInputElement
        ).value
        const price = (
            document.getElementById(
                'collection-price-field'
            ) as HTMLInputElement
        ).value


        if (
            !(
                name &&
                selectedWork !== undefined &&
                price &&
                parseFloat(price) >= 0.1
            )
        ) {
            return
        }

        const collabCreators: HTMLCollectionOf<Element> =
            document.getElementsByClassName('usernameTopLeftCollab')
        const collabPercents: HTMLCollectionOf<Element> =
            document.getElementsByClassName('profitPercentTopRightCollab')

        let usernames: string[] = []
        let percents: number[] = []

        Array.from(collabCreators).forEach((elem: Element) => {
            usernames.push((elem as HTMLInputElement).value)
        })

        Array.from(collabPercents).forEach((elem: Element) => {
            percents.push(parseInt((elem as HTMLInputElement).value))
        })

        const sum: number = percents.reduce(
            (partial, curr) => partial + curr,
            0
        )
        if (sum !== 100) {
            return
        }

        let profitSplitMap: Map<User, number> = new Map()
        let users: User[] = []
        for (let i = 0; i < usernames.length; i++) {
            users.push(await genericGet('/api/user/name/' + usernames[i]))
        }

        for (let i = 0; i < users.length; i++) {
            profitSplitMap.set(users[i], percents[i])
        }

        const artworks: Artwork[] = Array.from(selectedNfts).map(
            (nft: number) => {
                return { id: nft }
            }
        )
        const coll: NFTCollection = {
            work: works.get(selectedWork),
            name: name,
            collType: CollectionType.SALE,
            url:
                works
                    .get(selectedWork)
                    ?.creator.userName.replace(' ', '-')
                    .toLowerCase() +
                '-' +
                name.replace(' ', '-').toLowerCase(),
            active: false,
            published: false,
            price: parseFloat(price),
        }

        if (publish) {
            coll.published = true;
        }

        if (!props.edit) {
            const response: NFTCollection = await genericPost('/api/collection/createWithArt', {
                collection: coll,
                artworks: artworks,
            })

            let profitSplitsWithAddrs: object[] = []
            for (let i = 0; i < usernames.length; i++) {
                profitSplitsWithAddrs.push({
                    creatorUsername: usernames[i],
                    profitSplit: {
                        creator: null,
                        collection: response,
                        percentage: percents[i],
                    },
                })
            }

            await genericPost(
                '/api/profitSplit/addMany',
                profitSplitsWithAddrs
            )
        } else {
            const response: NFTCollection = await genericPost('/api/collection/update', {
                ...collection,
                ...coll,
            })

            const splits: ProfitSplit[] = await genericGet(
                '/api/profitSplit/collection/' + response.id
            )

            let promises: Promise<any>[] = []
            let newSplit: ProfitSplit
            let foundEntries: Set<number> = new Set()
            let i: number
            profitSplitMap.forEach((value, user) => {
                newSplit = {
                    collection: response,
                    creator: user,
                    percentage: value,
                }

                let found: boolean = false
                for (i = 0; i < splits.length; i++) {
                    if (
                        splits[i].creator.userName === user.userName
                    ) {
                        newSplit.id = splits[i].id
                        promises.push(genericPost(
                            '/api/profitSplit/update',
                            newSplit
                        ))
                        found = true
                        foundEntries.add(i)
                    }
                }

                if (!found) {
                    promises.push(genericPost('/api/profitSplit/add', newSplit))
                }
            })

            for (i = 0; i < splits.length; i++) {
                if (!foundEntries.has(i)) {
                    promises.push(genericPost(
                        '/api/profitSplit/delete',
                        splits[i]
                    ))
                }
            }

            const art: Artwork[] = await genericGet('/api/artwork/collection/' + response.id)
            foundEntries = new Set()
            artworks.forEach((nft: Artwork) => {
                let found: boolean = false
                const newArt: Artwork = {
                    ...nft,
                    origColl: response,
                    currColl: response,
                }
                for (let i = 0; i < art.length; i++) {
                    if (nft.id === art[i].id) {
                        foundEntries.add(i)
                        found = true

                        promises.push(genericPost(
                            '/api/artwork/update',
                            newArt
                        ))
                    }
                }

                if (!found) {
                    promises.push(genericPost('/api/artwork/create', newArt))
                }
            })

            for (let i = 0; i < art.length; i++) {
                if (!foundEntries.has(i)) {
                    promises.push(genericPost(
                        '/api/artwork/remove/' + art[i].id,
                        {}
                    ))
                }
            }

            await Promise.all(promises)
        }

        if (publish) {
            const response = await genericPost('/api/algo/sell', {
                seller: user.walletAddress,
                saleType: 'sale',
                nftIds: Array.from(selectedNfts)
            })
            console.log(response)
        }

        window.location.href = '/collection/' + coll.url
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
                    <Typography
                        level="h3"
                        color="green"
                        sx={{ fontSize: '22px' }}
                    >
                        Profit Split
                    </Typography>
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
                    <Typography
                        level="h3"
                        color="green"
                        sx={{ fontSize: '22px', paddingLeft: '32px' }}
                    >
                        Select Artwork
                    </Typography>
                    <ArtworkContext.Provider
                        value={{
                            select: selectArtwork,
                        }}
                    >
                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="flex-start"
                            flexWrap="wrap"
                        >
                            {sellableNfts}
                        </Grid>
                    </ArtworkContext.Provider>
                </Grid>

                <Grid sx={{ marginTop: '40px', paddingLeft: '32px' }}>
                    <Typography
                        level="h3"
                        color="green"
                        sx={{ fontSize: '22px' }}
                    >
                        Fixed Price
                    </Typography>
                    {(!props.edit || collection) && (
                        <Grid id="create-coll-fields">
                            <TwineInput
                                label="Collection name"
                                placeholder="name"
                                inputAttrs={{
                                    id: 'collection-name-field',
                                }}
                                defaultValue={collection?.name}
                            />
                            <TwineInput
                                label="Price per artwork"
                                type="number"
                                placeholder="price"
                                inputAttrs={{
                                    id: 'collection-price-field',
                                }}
                                endDecorator="/icons/algo.svg"
                                defaultValue={collection?.price?.toString()}
                            />
                            <TwineSelect
                                id="create-coll-select-story"
                                label="Story"
                                defaultValue={
                                    collection ? collection.work.id : ''
                                }
                                options={Array.from(works.values()).map(
                                    (work: Work) => {
                                        return (
                                            <Option
                                                value={work.id}
                                                onClick={() =>
                                                    setSelectedWork(work.id)
                                                }
                                            >
                                                {work.title}
                                            </Option>
                                        )
                                    }
                                )}
                            />
                        </Grid>
                    )}
                </Grid>

                <Grid sx={{ marginTop: '40px', paddingLeft: '32px' }}>
                    <TwineButton
                        color="green"
                        name="Save Draft"
                        action={() => {
                            saveCollection(false)
                        }}
                    />
                    <TwineButton
                        color="purple"
                        name="Publish Collection"
                        action={() => {
                            saveCollection(true)
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    )
}

export default CreateCollection
