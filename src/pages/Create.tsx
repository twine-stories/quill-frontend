import React, { useContext, useState, useEffect, SyntheticEvent } from 'react';
import { UserContext } from '../App.tsx';
import Navbar from "../components/Navbar.tsx";
import Button from '../components/Button.tsx';
import { Genre } from '../utils/enums.ts';
import { User, Work, Artwork, NFTCollection } from '../utils/types';
import { createNFT, createApplication, changeAssetManagement, escrowProgramToAddress, getAccountAssets, callApplication, callApplicationSign, paySign, signTxns } from '../utils/blockchain/transactionRepository.ts';
import { workAdd, worksGetByCreator, artworkAdd, artworkUpdate, artworkGet, collectionCreateWithArt, getEscrowProgram } from '../utils/api.ts'
import algosdk, { decodeAddress, encodeUint64, Transaction } from 'algosdk';
import NFTCheckbox from '../components/NFTCheckbox.tsx';
import { adminAddr } from '../utils/blockchain/credentials.ts';
import { INIT_ESCROW, MAKE_SELL_OFFER } from '../utils/blockchain/constants.ts';

const axios = require('axios').default;

type AssetInfo = {
    appId: number;
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

    const [smartContractInfo, setSmartContractInfo] = useState<Record<number, AssetInfo>>();

    const user: User = context['user'];
    const cname: string = 'nftCheckboxes';

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
        }
    }, [context]);

    useEffect(() => {
        if (user) {
            getAccountAssets(user.walletAddress).then(response => {
                let nfts: JSX.Element[] = [];
                response.forEach(element => {
                    const id: number = element['index'];
                    nfts.push(<NFTCheckbox cname={cname} assetId={id} name={element['params']['name']} key={id} />)
                });
                setAllAssets(nfts);
            });
        }
    }, [context, updateAssets]);

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

    const genreOptions: JSX.Element[] = [];
    const genres: object = Object.keys(Genre);
    for (let i in Object.values(Genre)) {
        let val: string = genres[i];
        genreOptions.push(<option key={val.toLowerCase()} value={val.toLowerCase()}>{val.toLowerCase()}</option>);
    }

    const mintNFT = async (walletAddress: string, unitName: string, assetName: string, assetUrl: string) => {
        const response: object = await createNFT(walletAddress, unitName, assetName, assetUrl);
        setUpdateAssets(!updateAssets);
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

        const saleType: HTMLInputElement = document.getElementById('saleType') as HTMLInputElement;
        const initResponse = await axios.get('algo/init/' + saleType.value);
        const data = initResponse.data;
        if (data) {
            let contractInfo: Record<number, AssetInfo> = {};
            for (const assetId of nftList) {
                const id: number = await createApplication(data['approval'], data['clear'], data['global_uints'], data['global_byte_slices'], data['local_uints'], data['local_byte_slices'], [decodeAddress(user.walletAddress).publicKey, decodeAddress(adminAddr).publicKey], [assetId]);
                const escrowProgram: string = await getEscrowProgram(assetId, id);

                if (escrowProgram) {
                    const escrowAddress: string = await escrowProgramToAddress(escrowProgram);
                    await callApplicationSign(id, adminAddr, algosdk.OnApplicationComplete.NoOpOC, [INIT_ESCROW, decodeAddress(escrowAddress).publicKey], undefined, true);
                    await paySign(adminAddr, escrowAddress, 200000, true);

                    if (saleType.value === 'sale') {
                        contractInfo[assetId] = {appId: id, escrowAddress: escrowAddress, price: 1000000};
                    } else {
                        contractInfo[assetId] = {appId: id, escrowAddress: escrowAddress, startPrice: 3000000, endPrice: 1000000, duration: 100};
                    }
                }
            }

            const work: HTMLInputElement = document.getElementById('works') as HTMLInputElement;
            const name: HTMLInputElement = document.getElementById('collName') as HTMLInputElement;
            const collection: NFTCollection = {
                work: allWorks[parseInt(work.value)],
                name: name.value
            };

            let artworks: Artwork[] = [];
            for (const id in contractInfo) {
                const assetId: number = parseInt(id);
                artworks.push({
                    assetId: assetId,
                    collection: collection,
                    appId: contractInfo[assetId].appId
                });
            }

            collectionCreateWithArt(collection, artworks);
            
            setSmartContractInfo(contractInfo);
            setSelectedNFTs(nftList);
        }
    }

    const makeSellOffer = async() => {
        let txns: Transaction[] = [];

        for (const id in smartContractInfo) {
            const assetId: number = parseInt(id);
            const info: AssetInfo = smartContractInfo[assetId];

            txns.push(changeAssetManagement(assetId, user.walletAddress, undefined, undefined, undefined, info.escrowAddress, false));

            if (info.price) {
                const price: Uint8Array = encodeUint64(info.price);
                txns.push(callApplication(info.appId, user.walletAddress, algosdk.OnApplicationComplete.NoOpOC, [MAKE_SELL_OFFER, price], [assetId]));
            } else if (info.startPrice && info.endPrice && info.duration) {
                const startPrice: Uint8Array = encodeUint64(info.startPrice);
                const endPrice: Uint8Array = encodeUint64(info.endPrice);
                const duration: Uint8Array = encodeUint64(info.duration);
                txns.push(callApplication(info.appId, user.walletAddress, algosdk.OnApplicationComplete.NoOpOC, [MAKE_SELL_OFFER, startPrice, endPrice, duration], [assetId]));
            } else {
                txns.pop();
                console.log('encountered incomplete asset info');
            }
        }

        // algosdk.assignGroupID(txns);

        await signTxns(txns);
    }

    return (
        <div>
            <Navbar />
            <div className='pageHeader'>Create</div>
            <div className='pageContent'>
                <p>create story</p>
                <div>
                    <input type='text' id='title' name='title' placeholder='enter title' />
                    <input type='text' id='description' name='description' placeholder='description' />
                    <input type='text' id='url' name='url' placeholder='url' />
                    <select name='genre1' id='genre1'>
                        {genreOptions}
                    </select>
                    <select name='genre2' id='genre2'>
                        {genreOptions}
                    </select>
                    <select name='genre3' id='genre3'>
                        {genreOptions}
                    </select>
                    <Button name='Create!' action={(e) => {
                        const title: HTMLInputElement = document.getElementById('title') as HTMLInputElement;
                        const description: HTMLInputElement = document.getElementById('description') as HTMLInputElement;
                        const url: HTMLInputElement = document.getElementById('url') as HTMLInputElement;
                        const genre1: HTMLInputElement = document.getElementById('genre1') as HTMLInputElement;
                        const genre2: HTMLInputElement = document.getElementById('genre2') as HTMLInputElement;
                        const genre3: HTMLInputElement = document.getElementById('genre3') as HTMLInputElement;
                        if (title && description && url && genre1 && genre2 && genre3) {
                            let newWork: Work = {
                                creator: user,
                                title: title.value,
                                description: description.value,
                                cover: 'cover',
                                banner: 'banner',
                                genre1: genre1.value.toUpperCase(),
                                genre2: genre2.value.toUpperCase(),
                                genre3: genre3.value.toUpperCase(),
                                medium: "WRITTEN",
                                url: url.value
                            };
        
                            workAdd(newWork, (work) => {
                                console.log("url taken");
                            });
                        }
                    }} />
                </div>
                <p>create nft</p>
                <div>
                    <input type='text' id='unitName' name='unitNme' placeholder='unit name' />
                    <input type='text' id='assetName' name='assetName' placeholder='asset name' />
                    <input type='text' id='assetUrl' name='assetUrl' placeholder='asset url' />
                    <Button name='Mint NFT' action={(e) => {
                        const unitName: HTMLInputElement = document.getElementById('unitName') as HTMLInputElement;
                        const assetName: HTMLInputElement = document.getElementById('assetName') as HTMLInputElement;
                        const assetUrl: HTMLInputElement = document.getElementById('assetUrl') as HTMLInputElement;
                        if (unitName && assetName && assetUrl) {
                            mintNFT(user.walletAddress, unitName.value, assetName.value, assetUrl.value);
                        }
                    }} />
                </div>
                {allAssets}
                <label htmlFor="saleType">Choose a sale type:</label>
                <select name="saleType" id="saleType">
                    <option value={"sale"}>sale</option>
                    <option value={"auction"}>auction</option>
                </select>
                <label htmlFor="works">Choose a work:</label>
                <select name="works" id="works">
                    {workOptions}
                </select>
                <input type='text' id='collName' name='collName' placeholder='enter collection name' />
                <Button name='Generate Contract(s)' action={confirmNFTs} />
                <Button name='Post NFT(s) for Sale' enabled={enableSell} action={(e) => makeSellOffer()} />
            </div>
        </div>
    );
}

export default Create;