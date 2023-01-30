import React, { useState, useContext, useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import Button from '../components/Button.tsx';
import { UserContext } from "../App.tsx";
import { User, Artwork } from '../utils/types.ts';
import { artworkGetAll } from '../utils/api.ts';
import { optIn, buyAsset, getAssetById, getApplicationById } from '../utils/blockchain/transactionRepository.ts';
import { encodeAddress, Transaction } from 'algosdk';

const decoder = new TextDecoder()

const nameMapping: object = {
    'ESCROW_ADDRESS': 'escrowAddress',
    'ASA_PRICE': 'asaPrice',
    'ASA_OWNER': 'asaOwner',
    'APP_STATE': 'appState',
    'ASA_ID': 'asaId'
};

type Asset = {
    escrowAddress: string;
    asaPrice: number;
    asaOwner: string;
    appState: number;
    asaId: number;
};

function Art() {
    const [artwork, setArtwork] = useState<Artwork[]>();
    const [assets, setAssets] = useState<Record<number, Asset>>();
    const context: object = useContext(UserContext);
    const user: User = context['user'];

    useEffect(() => {
        artworkGetAll().then((response: Artwork[]) => {
            getArtwork(response);
            setArtwork(response);
        });
    }, []);

    const getArtwork = async (allArtworks: Artwork[]) => {
        const allAssets: Record<number, Asset> = {};
        for (const elem of allArtworks) {
            const assetId: number = elem.assetId;
            const appId: number = elem.appId;
            await getAssetById(assetId);
            const app = await getApplicationById(appId);
            const allAssets: Record<number, Asset> = {};
            const globalState: object[] = app['params']['global-state'];

            let currAsset: Asset = {
            };
            globalState.forEach((item) => {
                const key: string = nameMapping[Buffer.from(item['key'], 'base64').toString()];
                if (item['value']['type'] === 1) {
                    currAsset[key] = encodeAddress(new Uint8Array(Buffer.from(item['value']['bytes'], 'base64')));
                } else {
                    currAsset[key] = item['value']['uint'];
                }
            });

            allAssets[assetId] = currAsset;
        }

        setAssets(allAssets);
    }

    const buyArtwork = (asset: Artwork) => {
        console.log(asset);
        if (!user.walletAddress) {
            return;
        }
        const optInTxn: Transaction = optIn(asset.assetId, user.walletAddress);
        // FIX THIS
        const buy: Transaction[] = buyAsset(asset.assetId, asset.appId);
    }

    let listing: any[] = [];
    artwork?.forEach((elem: Artwork) => {
        if (!elem.appId) {
            return;
        }
        listing.push(<div key={elem.id}>
            <p>{elem.assetId}</p>
            <Button action={() => {buyArtwork(elem)}} name="Buy" />
        </div>);
    });

    return (
        <div>
            <Navbar />
            {listing}
        </div>
    );
}

export default Art;