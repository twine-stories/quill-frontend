import React, { useState, useContext, useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import Button from '../components/Button.tsx';
import { UserContext } from "../App.tsx";
import { User, Artwork } from '../utils/types.ts';
import { artworkGetAll, getEscrowProgram } from '../utils/api.ts';
import { optIn, buyAsset, getAssetById, getApplicationById, buySign } from '../utils/blockchain/transactionRepository.ts';
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
    escrowProgram: string;
};

function Art() {
    const [artwork, setArtwork] = useState<Artwork[]>();
    const [assets, setAssets] = useState<Record<number, Asset>>();
    const [initLoad, setInitLoad] = useState<boolean>(false);
    const context: object = useContext(UserContext);
    const user: User = context['user'];

    useEffect(() => {
        artworkGetAll().then((response: Artwork[]) => {
            let filteredResponse: Artwork[] = response.filter((elem: Artwork) => elem.appId !== null);
            getArtwork(filteredResponse);
            setArtwork(filteredResponse);
        });
    }, []);

    useEffect(() => {
        if (assets) {
            setInitLoad(true);
        }
    }, [assets]);

    const getArtwork = async (allArtworks: Artwork[]) => {
        const allAssets: Record<number, Asset> = {};
        for (const elem of allArtworks) {
            const assetId: number = elem.assetId;
            const appId: number = elem.appId;

            await getAssetById(assetId);
            const app = await getApplicationById(appId);
            const globalState: object[] = app['params']['global-state'];

            let currAsset: Asset = {};
            globalState.forEach((item) => {
                const key: string = nameMapping[Buffer.from(item['key'], 'base64').toString()];
                if (!key) {
                    return;
                }
                if (item['value']['type'] === 1) {
                    currAsset[key] = encodeAddress(new Uint8Array(Buffer.from(item['value']['bytes'], 'base64')));
                } else {
                    currAsset[key] = item['value']['uint'];
                }
            });
            const escrowProgram: string = await getEscrowProgram(assetId, appId);
            currAsset.escrowProgram = escrowProgram;
            allAssets[assetId] = currAsset;
        }

        setAssets(allAssets);
    }

    const buyArtwork = (art: Artwork) => {
        if (!user.walletAddress || !assets) {
            return;
        }

        const id: number = art.assetId;
        const asset: Asset = assets[id];
        const optInTxn: Transaction = optIn(id, user.walletAddress);
        const buy: Transaction[] = buyAsset(id, art.appId, asset.asaOwner, user.walletAddress, asset.asaPrice, asset.escrowAddress);

        buySign(optInTxn, buy, asset.escrowProgram);
    }

    let listing: any[] = [];
    artwork?.forEach((elem: Artwork) => {
        if (!elem.appId) {
            return;
        }
        listing.push(<div key={elem.id}>
            <p>{elem.assetId}</p>
            <Button action={() => {buyArtwork(elem)}} name="Buy" enabled={initLoad} />
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