import React, {useContext, useState, useEffect, createContext} from 'react';
import {UserContext} from '../../App.tsx';
import Navbar from "../../components/Navbar.tsx";
import Collaborator from '../../components/Collaborator.tsx';
import TwineButton from '../../components/TwineButton.tsx';
import TwineInput from '../../components/TwineInput.tsx';
import {Genre} from '../../utils/enums.ts';
import {User, Work, Artwork, NFTCollection, ProfitSplit} from '../../utils/types.ts';
import {
    createApplication,
    changeAssetManagement,
    escrowProgramToAddress,
    getAccountAssets,
    callApplication,
    callApplicationSign,
    paySign,
    signTxns
} from '../../utils/blockchain/transactionRepository.ts';
import {
    workAdd,
    worksGetByCreator,
    collectionCreateWithArt,
    getEscrowProgram,
    genericPost,
    genericGet
} from '../../utils/api.ts'
import algosdk, {decodeAddress, encodeUint64, getApplicationAddress, Transaction} from 'algosdk';
import NFTCheckbox from '../../components/NFTCheckbox.tsx';
import {adminAddr} from '../../utils/blockchain/credentials.ts';
import {INIT_ESCROW, MAKE_SELL_OFFER} from '../../utils/blockchain/constants.ts';
import {saleTypeMap, MAX_COLLABORATORS_SMART_CONTRACTS} from '../../utils/constants.ts';
import {Typography, Sheet, Stack, Grid} from "@mui/joy";
import {CollectionType} from '../../utils/enums.ts';
import { env } from '../../config.ts';
import "./Create.css";

const axios = require('axios').default;
export const CollaboratorContext = createContext(null as any);

type AssetInfo = {
    appId: number;
    assetId: number;
    escrowAddress: string;
    price?: number | bigint;
    startPrice?: number | bigint;
    endPrice?: number | bigint;
    duration?: number;
}

function Create() {
    const context: object = useContext(UserContext);
    const [allAssets, setAllAssets] = useState<JSX.Element[]>([]);
    const [allWorks, setAllWorks] = useState<Record<number, Work>>({});
    const [workOptions, setWorkOptions] = useState<JSX.Element[]>([]);
    const [selectedNFTs, setSelectedNFTs] = useState<number[]>([]);
    const [enableSell, setEnableSell] = useState<boolean>(false);
    const [updateAssets, setUpdateAssets] = useState<boolean>(false);
    const [collaborators, setCollaborators] = useState<JSX.Element[]>([])

    const [smartContractInfo, setSmartContractInfo] = useState<Record<number, AssetInfo>>();

    const [contractType, setContractType] = useState<CollectionType>(CollectionType.SALE);

    const [profitSplitAddrs, setProfitSplitAddrs] = useState<string[]>([]);
    const [profitSplits, setProfitSplits] = useState<number[]>([]);

    const user: User = context['user'];
    const cname: string = 'nftCheckboxes';

    const [hover, setOnHover] = useState<boolean>(false);
    const removeCollaborator = (id: number): void => {
        let newCollaborators: JSX.Element[] = [];
        console.log(collaborators);
        collaborators.forEach((collaborator: JSX.Element) => {
            console.log(collaborator.props.id);
            console.log(id);
            if (collaborator.props.id !== id) {
                newCollaborators.push(collaborator);
            }
        });

        setCollaborators(newCollaborators);
    };

    useEffect(() => {
        if (user) {
            let worksObj: Record<number, Work> = {};
            let works: JSX.Element[] = [];
            worksGetByCreator(user.walletAddress).then((response: Work[] | null) => {
                if (response) {
                    response.forEach((element: Work) => {
                        if (element.id) {
                            works.push(<option key={element.id} value={element.id}>{element.title}</option>);
                            worksObj[element.id] = element;
                        }
                    });

                    setAllWorks(worksObj);
                    setWorkOptions(works);
                }
            });

            if (collaborators.length === 0) {
                setCollaborators([
                    <Collaborator profitSplit={true} defaultCreator={user.userName}
                                  defaultWallet={user.walletAddress} defaultProfit={100} principle={true} id={0}
                                  key={0}/>
                ])
            }
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            getAccountAssets(user.walletAddress).then(response => {
                let nfts: JSX.Element[] = [];
                response.forEach(element => {
                    const id: number = element['index'];
                    nfts.push(<NFTCheckbox cname={cname} assetId={id} name={element['params']['name']} key={id}/>)
                });
                setAllAssets(nfts);
            });
        }
    }, [user, updateAssets]);

    useEffect(() => {
        if (selectedNFTs.length > 0) {
            setEnableSell(true);
        }
    }, [selectedNFTs]);

    if (!context['userLoaded']) {
        return (<div></div>);
    }

    if (!context['user'] || !context['user']['creator']) {
        window.location.href = '/';
    }

    const genContract = async (assetId: number, data: object): Promise<AssetInfo | null> => {
        // create application from backend, have backend communicate with fast api
        // pretty much move whole contract logic to backend bc the user only needs to sign away the asset (can send the transaction once we have completed the application/escrow setup)
        // will probably need to change the escrow logic, but wont be too bad hopefully
        const id: number = await createApplication(data['approval'], data['clear'], data['global_uints'], data['global_byte_slices'], data['local_uints'], data['local_byte_slices'], [decodeAddress(user.walletAddress).publicKey, decodeAddress(adminAddr).publicKey], [assetId]);
        const escrowProgram: string = await getEscrowProgram(contractType.toLowerCase(), assetId.toString(), id);

        if (escrowProgram) {
            const escrowAddress: string = await escrowProgramToAddress(escrowProgram);
            await Promise.all([
                callApplicationSign(id, adminAddr, algosdk.OnApplicationComplete.NoOpOC, [INIT_ESCROW, decodeAddress(escrowAddress).publicKey], undefined, undefined, true),
                paySign(adminAddr, escrowAddress, 200000, true),
                paySign(adminAddr, getApplicationAddress(id), 100000, true)
            ]);

            if (contractType === CollectionType.REV_AUCTION) {
                return {appId: id, assetId: assetId, escrowAddress: escrowAddress, startPrice: 3000000, endPrice: 1000000, duration: 100};
            } else if (contractType === CollectionType.SALE) {
                return {appId: id, assetId: assetId, escrowAddress: escrowAddress, price: 1000000};
            }
        }

        return null;
    }

    const confirmNFTs = async () => {
        let nftList: number[] = [];
        const checkboxes: HTMLCollectionOf<Element> = document.getElementsByClassName(cname);

        Array.from(checkboxes).forEach(elem => {
            if (elem['checked']) {
                nftList.push(parseInt(elem['id']));
            }
        });

        if (nftList.length === 0) {
            return;
        }

        const collabAddrs: HTMLCollectionOf<Element> = document.getElementsByClassName('bottomCollab');
        const collabVals: HTMLCollectionOf<Element> = document.getElementsByClassName('topRightCollab');
        let addrs: string[] = [];
        let vals: number[] = [];

        Array.from(collabAddrs).forEach((elem: Element) => {
            addrs.push((elem.children[0] as HTMLInputElement).value);
        });

        Array.from(collabVals).forEach((elem: Element) => {
            vals.push(parseInt((elem.children[0] as HTMLInputElement).value));
        })

        const sum: number = vals.reduce((partial, curr) => partial + curr, 0);
        if (sum !== 100) {
            console.log('invalid percent sum');
            return;
        } else {
            setProfitSplitAddrs(addrs);
            setProfitSplits(vals);
        }

        const saleType: string = contractType.toLowerCase();
        const initResponse = await axios.get('algo/init/' + saleType);
        const data = initResponse.data;
        let contractInfo: Record<number, AssetInfo> = {};
        if (data) {
            let promises: Promise<AssetInfo | null>[] = [];
            for (const assetId of nftList) {
                promises.push(genContract(assetId, data));
            }
            const values: (AssetInfo | null)[] = await Promise.all(promises);
            values.forEach((val: AssetInfo | null) => {
                if (val !== null) {
                    contractInfo[val.assetId] = val;
                }
            });

            setSmartContractInfo(contractInfo);
            setSelectedNFTs(nftList);
        }
    }

    const makeSellOffer = async (): Promise<void> => {
        let txns: Transaction[] = [];

        if (!smartContractInfo || Object.keys(smartContractInfo).length === 0) {
            return;
        }

        for (const id in smartContractInfo) {
            const assetId: number = parseInt(id);
            const info: AssetInfo = smartContractInfo[assetId];

            txns.push(changeAssetManagement(assetId, user.walletAddress, undefined, undefined, undefined, info.escrowAddress, false));
        }

        for (const id in smartContractInfo) {
            const assetId: number = parseInt(id);
            const info: AssetInfo = smartContractInfo[assetId];

            if (info.price && contractType === CollectionType.SALE) {
                const price: Uint8Array = encodeUint64(info.price);
                txns.push(callApplication(info.appId, user.walletAddress, algosdk.OnApplicationComplete.NoOpOC, [MAKE_SELL_OFFER, price], [assetId]));
            } else if (info.startPrice && info.endPrice && info.duration && contractType === CollectionType.REV_AUCTION) {
                const startPrice: Uint8Array = encodeUint64(info.startPrice);
                const endPrice: Uint8Array = encodeUint64(info.endPrice);
                const duration: Uint8Array = encodeUint64(info.duration);
                txns.push(callApplication(info.appId, user.walletAddress, algosdk.OnApplicationComplete.NoOpOC, [MAKE_SELL_OFFER, startPrice, endPrice, duration], [assetId]));
            } else {
                // incorrect behavior here
                txns.pop();
                console.log('encountered incomplete asset info');
            }
        }

        // algosdk.assignGroupID(txns);
        await signTxns(txns);

        const work: HTMLInputElement = document.getElementById('works') as HTMLInputElement;
        const name: HTMLInputElement = document.getElementById('collName') as HTMLInputElement;
        // need to fix the url
        const collection: NFTCollection = {
            work: allWorks[parseInt(work.value)],
            name: name.value,
            collType: saleTypeMap[contractType.toLowerCase()],
            url: name.value,
            active: true
        };

        let artworks: Artwork[] = [];
        for (const id in smartContractInfo) {
            const assetId: number = parseInt(id);
            artworks.push({
                id: assetId,
                origColl: collection,
                currColl: collection,
                appId: smartContractInfo[assetId].appId
            });
        }

        const coll: NFTCollection = await collectionCreateWithArt(collection, artworks);
        let profitSplitsWithAddrs: object[] = [];
        for (let i = 0; i < profitSplitAddrs.length; i++) {
            profitSplitsWithAddrs.push({
                creatorAddress: profitSplitAddrs[i],
                profitSplit: {
                    creator: null,
                    collection: coll,
                    percentage: profitSplits[i]
                }
            })
        }

        genericPost('/api/profitSplit/addMany', profitSplitsWithAddrs);
    }

    return (
        <div className='create'>
            <Navbar/>
            <Typography level="h2" color='green' sx={{paddingLeft: "16px",marginTop:"74px"}}>Create Stories</Typography>
            <Grid container direction='column' alignItems='flex-start' justifyContent='space-around'>
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    flexWrap='wrap'
                    width="100%"
                >
                    <Sheet color="green_dashed" variant="rounded">
                              <span
                            onMouseEnter={()=>setOnHover(true)}
                            onMouseLeave={()=>setOnHover(false)}
                        >
                        <TwineButton
                                sx={{
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    paddingBlock: '2rem',
                                    paddingInline: '2.4rem', 
                                    borderRadius: '15px',
                                    transition: 'background-color 0.3s ease',
                                    ':hover': { 
                                        backgroundColor: "#5C720D", 
                                        color: '#A3B832',
                                    },}}
                                icon={hover ? "/icons/green_plus_hover.svg" : "/icons/green_plus.svg"}
                                color="green"
                                name="Create Story" action={() => {
                                    window.location.href = '/create/story/'
                        }}
                        paddingTop="10px"
                        className="custom-start-decorator"
                        />
                    </span>
                    </Sheet>
                    <Sheet color="green_dashed" variant="rounded">
                        <TwineButton sx={{margin:"0px", 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        paddingBlock: '2rem',
                                        paddingInline: '2.4rem', 
                                        borderRadius: '15px',
                                        transition: 'background-color 0.3s ease',':hover': { backgroundColor: "#5C720D", color: '#A3B832'},}} 
                                     icon="/icons/green_paper.svg" color="blackgreen" name="Published Stories"
                                     action={() => {
                                        window.location.href = '/gallery/story/published'
                                    }}
                                    paddingTop="10px"
                                    className="custom-start-decorator"
                                    />
                    </Sheet>
                    <Sheet color="green_dashed"  variant="rounded">
                        <TwineButton sx={{display: 'flex',
                         flexDirection: 'column',
                         alignItems: 'center',
                         paddingBlock: '2rem',
                         paddingInline: '2.4rem', 
                         borderRadius: '15px',
                         transition: 'background-color 0.3s ease',':hover': { backgroundColor: "#5C720D", color: '#A3B832'},}} 
                         icon="/icons/green_paper.svg" 
                         color="blackgreen" 
                         name="Story Drafts" action={() => {
                            window.location.href = '/gallery/story/draft'
                        }}
                        paddingTop="10px"
                        className="custom-start-decorator"/>
                    </Sheet>
                </Stack>
            </Grid>

            <Typography level="h2" color='green' sx={{paddingLeft: "16px",marginTop:"74px"}}>Create Art</Typography>
            <Grid container direction='column' alignItems='flex-start' justifyContent='space-around'>
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    flexWrap='wrap'
                    width="100%"
                >
                    <Sheet color="green_dashed" variant="rounded">
                        <span
                            onMouseEnter={()=>setOnHover(true)}
                            onMouseLeave={()=>setOnHover(false)}
                        >
                        <TwineButton
                                sx={{
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    paddingBlock: '2rem',
                                    paddingInline: '2.4rem', 
                                    borderRadius: '15px',
                                    transition: 'background-color 0.3s ease',
                                    ':hover': { 
                                        backgroundColor: "#5C720D", 
                                        color: '#A3B832',
                                    },}}
                                icon={hover ? "/icons/green_plus_hover.svg" : "/icons/green_plus.svg"}
                                color="green"
                                name="Create Artwork" action={() => {
                                    window.location.href = '/create/art/'
                        }}
                        paddingTop="10px"
                        className="custom-start-decorator"
                        />
                        </span>
                    </Sheet>
                </Stack>
            </Grid>
            {env === 'dev' &&
                <div>
                    {allAssets}
                    <label htmlFor="saleType">Choose a sale type:</label>
                    <select name="saleType" id="saleType" onChange={(e) => {
                        setContractType(saleTypeMap[e.target.value])
                    }}>
                        <option value={"sale"}>sale</option>
                        <option value={"rev_auction"}>reverse auction</option>
                        <option value={"shuffle"}>shuffle</option>
                    </select>
                    <label htmlFor="works">Choose a work:</label>
                    <select name="works" id="works">
                        {workOptions}
                    </select>
                    <input type='text' id='collName' name='collName' placeholder='enter collection name'/>
                    <CollaboratorContext.Provider value={{
                        'remove': removeCollaborator
                    }}>
                        <div>
                            {collaborators}
                            <TwineButton name='Add Collaborator' enabled={collaborators.length < MAX_COLLABORATORS_SMART_CONTRACTS}
                                        action={(e) => {
                                            if (collaborators.length < MAX_COLLABORATORS_SMART_CONTRACTS) {
                                                const id: number = collaborators[collaborators.length - 1].props.id + 1;
                                                setCollaborators([
                                                    ...collaborators,
                                                    <Collaborator profitSplit={true} principle={false} id={id}
                                                                key={id}/>
                                                ])
                                            }
                                        }}/>
                        </div>
                    </CollaboratorContext.Provider>
                    <div>
                        <TwineButton name='Generate Contract(s)' action={confirmNFTs}/>
                        <TwineButton name='Post NFT(s) for Sale' enabled={enableSell} action={(e) => makeSellOffer()}/>
                    </div>
                </div>
            }
        </div>
    );
}

export default Create;