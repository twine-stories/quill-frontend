import React, { useContext, useState, useEffect, SyntheticEvent } from 'react';
import { UserContext } from '../App.tsx';
import Navbar from "../components/Navbar.tsx";
import Button from '../components/Button.tsx';
import { Genre } from '../utils/enums.ts';
import { Work, Artwork } from '../utils/types';
import { createNFT, createApplication, changeAssetManagement, escrowProgramToAddress, getAccountAssets, callApplication, callApplicationSign, paySign, signTxns } from '../utils/blockchain/transactionRepository.ts';
import { User } from '../utils/types.ts';
import { workAdd, artworkAdd } from '../utils/api.ts'
import algosdk, { decodeAddress, Transaction } from 'algosdk';
import NFTCheckbox from '../components/NFTCheckbox.tsx';
import { adminAddr } from '../utils/blockchain/credentials.ts';
import { INIT_ESCROW, MAKE_SELL_OFFER } from '../utils/blockchain/constants.ts';

const axios = require('axios').default;
const encoder = new TextEncoder();

function Create() {
    const context: object = useContext(UserContext);
    const [allAssets, setAllAssets] = useState<Array<JSX.Element>>([]);
    const [selectedNFTs, setSelectedNFTs] = useState<Array<number>>([]);
    const [enableSell, setEnableSell] = useState<boolean>(false);
    const [loadedAssets, setLoadedAssets] = useState<boolean>(false);

    const [smartContractInfo, setSmartContractInfo] = useState<Record<number, object>>();

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

    const user: User = context['user'];

    const genreOptions: Array<JSX.Element> = [];
    const genres: object = Object.keys(Genre);
    for (let i in Object.values(Genre)) {
        let val: string = genres[i];
        genreOptions.push(<option key={val.toLowerCase()} value={val.toLowerCase()}>{val.toLowerCase()}</option>);
    }

    let nfts: Array<JSX.Element> = [];
    const cname: string = 'nftCheckboxes';
    if (!loadedAssets) {
        
        getAccountAssets(user.walletAddress).then(response => {
            response.forEach(element => {
                const id: number = element['index'];
                nfts.push(<NFTCheckbox cname={cname} assetId={id} name={element['params']['name']} key={id} />)
            });
            setLoadedAssets(true);
            setAllAssets(nfts);
        });
    }

    const mintNFT = async (walletAddress: string, unitName: string, assetName: string, assetUrl: string) => {
        const response: object = await createNFT(walletAddress, unitName, assetName, assetUrl);
        const assetId: number = response['asset-index'];
        const artwork: Artwork = {
            collection: {id: 1},
            assetId: assetId
        };
        artworkAdd(artwork);
        setLoadedAssets(false);
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

        const initResponse = await axios.get('algo/init');
        const data = initResponse.data.data;
        if (data) {
            let contractInfo: Record<number, object> = {};
            for (const assetId of nftList) {
                const id: number = await createApplication(data['approval'], data['clear'], data['global_uints'], data['global_byte_slices'], data['local_uints'], data['local_byte_slices'], [decodeAddress(user.walletAddress).publicKey, decodeAddress(adminAddr).publicKey], [assetId]);
                const escrowResponse = await axios.get('/algo/escrow?nftId=' + assetId + '&appId=' + id);
                const escrowData = escrowResponse.data.data;

                if (escrowData) {
                    const escrowAddress: string = await escrowProgramToAddress(escrowData['escrow_program']);
                    await callApplicationSign(id, adminAddr, algosdk.OnApplicationComplete.NoOpOC, [INIT_ESCROW, decodeAddress(escrowAddress).publicKey], undefined, true);
                    await paySign(adminAddr, escrowAddress, 100000, true);

                    contractInfo[assetId] = {'appId': id, 'escrowAddress': escrowAddress, 'price': 1000000};
                }
            }
            
            setSmartContractInfo(contractInfo);
            setSelectedNFTs(nftList);
        }
    }

    const makeSellOffer = async() => {
        let txns: Transaction[] = [];

        for (const id in smartContractInfo) {
            const assetId: number = parseInt(id);
            const price: Uint8Array = encoder.encode(smartContractInfo[assetId]['price'].toString());
            txns.push(changeAssetManagement(assetId, user.walletAddress, undefined, undefined, undefined, smartContractInfo[assetId]['escrowAddress'], false));
            txns.push(callApplication(smartContractInfo[assetId]['appId'], user.walletAddress, algosdk.OnApplicationComplete.NoOpOC, [MAKE_SELL_OFFER, price], [assetId]));
        }

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
                        const title = document.getElementById('title') as HTMLInputElement;
                        const description = document.getElementById('description') as HTMLInputElement;
                        const url = document.getElementById('url') as HTMLInputElement;
                        const genre1 = document.getElementById('genre1') as HTMLInputElement;
                        const genre2 = document.getElementById('genre2') as HTMLInputElement;
                        const genre3 = document.getElementById('genre3') as HTMLInputElement;
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
                <Button name='Generate Contract(s)' action={confirmNFTs} />
                <Button name='Post NFT(s) for Sale' enabled={enableSell} action={(e) => makeSellOffer()} />
            </div>
        </div>
    );
}

export default Create;