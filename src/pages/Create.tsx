import React, { useContext, useState } from 'react';
import { UserContext } from '../App.tsx';
import Navbar from "../components/Navbar.tsx";
import Button from '../components/Button.tsx';
import { Genre } from '../utils/enums.ts';
import { Work, Artwork } from '../utils/types';
import { createNFT, createApplication } from '../utils/blockchain/transactionRepository.ts';
import { User } from '../utils/types.ts';
import { workAdd, artworkAdd } from '../utils/api.ts'
import algosdk, { decodeAddress } from 'algosdk';

const axios = require('axios').default;

function Create() {
    const context: object = useContext(UserContext);

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

    const mintNFT = async (walletAddress: string, unitName: string, assetName: string, assetUrl: string) => {
        const response: object = await createNFT(walletAddress, unitName, assetName, assetUrl);
        const assetId: number = response['asset-index'];
        const artwork: Artwork = {
            collection: {id: 1},
            assetId: assetId
        };
        artworkAdd(artwork);
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
                <Button name='Create Smart Contract' action={(e) => {
                    axios.get('/algo/init')
                        .then(response => {
                            const data = response.data.data;
                            if (data) {
                                createApplication(user.walletAddress, data['approval'], data['clear'], data['global_uints'], data['global_byte_slices'], data['local_uints'], data['local_byte_slices'], [decodeAddress(user.walletAddress).publicKey, decodeAddress(user.walletAddress).publicKey], [150999806]).then(response => {
                                    console.log(response);
                                }).catch(error => {
                                    console.error(error);
                                });
                            }
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }} />
            </div>
        </div>
    );
}

export default Create;