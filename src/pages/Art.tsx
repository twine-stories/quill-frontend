import React, { useState, useContext, useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import Button from '../components/Button.tsx';
import { UserContext } from "../App.tsx";
import { User, Artwork } from '../utils/types.ts';
import { artworkGetAll, getEscrowProgram } from '../utils/api.ts';
import { optIn, buyAsset, getAssetById, getApplicationById, buySign, callApplicationSign } from '../utils/blockchain/transactionRepository.ts';
import algosdk, { encodeAddress, Transaction } from 'algosdk';
import { nameMapping, STOP_SELL_OFFER } from '../utils/blockchain/constants.ts';
import { Asset } from '../utils/blockchain/types.ts';

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
        let skip;
        for (const elem of allArtworks) {
            skip = false;
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
                if (key == 'appState' && item['value']['uint'] != 2) {
                    skip = true;
                    return;
                }
                if (item['value']['type'] === 1) {
                    currAsset[key] = encodeAddress(new Uint8Array(Buffer.from(item['value']['bytes'], 'base64')));
                } else {
                    currAsset[key] = item['value']['uint'];
                }
            });
            if (skip) {
                continue;
            }

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
        let buy: Transaction[];
        if (asset.asaPrice) {
            buy = buyAsset(id, art.appId, asset.asaOwner, user.walletAddress, asset.asaPrice, asset.escrowAddress);
        } else {
            const current: number = Math.floor(Date.now() / 1000);
            if (current > asset.startTime + asset.duration) {
                return;
            }
            console.log(asset);
            const price: number | bigint = (((asset.startTime + asset.duration - current) * (asset.startPrice - asset.endPrice)) / asset.duration) + asset.endPrice;
            buy = buyAsset(id, art.appId, asset.asaOwner, user.walletAddress, price, asset.escrowAddress, current);
        }

        buySign(optInTxn, buy, asset.escrowProgram).then((response) => {
            console.log(response);
        });
    }

    const stopSellOffer = (art: Artwork) => {
        if (!user.walletAddress || !assets) {
            return;
        }

        const id: number = art.assetId;

        callApplicationSign(art.appId, user.walletAddress, algosdk.OnApplicationComplete.NoOpOC, [STOP_SELL_OFFER]).then((response) => {
            console.log(response);
        });
    }

    let listing: JSX.Element[] = [];
    artwork?.forEach((elem: Artwork) => {
        if (!assets || !elem.appId || !(elem.assetId in assets)) {
            return;
        }
        const currAsset: Asset = assets[elem.assetId];
        listing.push(<div key={elem.id}>
            <p>{elem.assetId}</p>
            <Button action={() => {buyArtwork(elem)}} name="Buy" enabled={initLoad} />
            {user && user.walletAddress && currAsset.asaOwner == user.walletAddress && <Button action={() => {stopSellOffer(elem)}} name="Remove Listing" enabled={initLoad} />}
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