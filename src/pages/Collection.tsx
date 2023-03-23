import React, { useState, useContext, useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { UserContext } from "../App.tsx";
import { User, NFTCollection, Artwork } from '../utils/types.ts';
import { collectionGetByUrl } from '../utils/api.ts';
import { Asset } from '../utils/blockchain/types.ts';
import { getEscrowProgram, genericGet, genericPost } from '../utils/api.ts';
import { optIn, buyAsset, getAssetById, getApplicationById, buySign, callApplicationSign } from '../utils/blockchain/transactionRepository.ts';
import algosdk, { decodeAddress, encodeAddress, encodeUint64, getApplicationAddress, Transaction } from 'algosdk';
import { nameMapping, MAKE_PAYMENTS, STOP_SELL_OFFER } from '../utils/blockchain/constants.ts';
import Button from '../components/Button.tsx';
import { CollectionType } from '../utils/enums.ts';
import { adminAddr } from '../utils/blockchain/credentials.ts';

function Collection() {

    const [coll, setColl] = useState<NFTCollection>();
    const [artwork, setArtwork] = useState<Artwork[]>();
    const [assets, setAssets] = useState<Record<number, Asset>>();
    const [initLoad, setInitLoad] = useState<boolean>(false);
    const context: object = useContext(UserContext);
    const user: User = context['user'];

    useEffect(() => {
        if (coll) {
            genericGet('/api/artwork/collection/' + coll.id).then((response: Artwork[]) => {
                let filteredResponse: Artwork[] = response.filter((elem: Artwork) => elem.appId !== null);
                getArtwork(filteredResponse);
                setArtwork(filteredResponse);
            });
        }
    }, [coll]);

    useEffect(() => {
        if (user) {
            collectionGetByUrl(window.location.href.split('/')[4]).then((response: NFTCollection) => {
                setColl(response);
            });
        }
    }, [user]);

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
                if (key === 'appState' && item['value']['uint'] !== 2) {
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

            const escrowProgram: string = await getEscrowProgram(coll.collType.toLowerCase(), assetId, appId);
            currAsset.escrowProgram = escrowProgram;
            allAssets[assetId] = currAsset;
        }
        setAssets(allAssets);
    }

    const buyArtwork = (art: Artwork): void => {
        if (!user.walletAddress || !assets) {
            return;
        }

        const id: number = art.assetId;
        const asset: Asset = assets[id];
        const optInTxn: Transaction = optIn(id, user.walletAddress);
        let buy: Transaction[];
        // TODO: change hardcoded 2000, addresses, and splits
        if ((coll.collType === CollectionType.SALE || coll.collType === CollectionType.SHUFFLE) && asset.asaPrice) {
            buy = buyAsset(id, art.appId, asset.asaOwner, user.walletAddress, asset.asaPrice + 2000, asset.escrowAddress, getApplicationAddress(art.appId));
        } else if (coll.collType === CollectionType.REV_AUCTION) {
            const current: number = Math.floor(Date.now() / 1000);
            if (current > asset.startTime + asset.duration) {
                return;
            }
            const price: number | bigint = (((asset.startTime + asset.duration - current) * (asset.startPrice - asset.endPrice)) / asset.duration) + asset.endPrice + 2000;
            buy = buyAsset(id, art.appId, asset.asaOwner, user.walletAddress, price, asset.escrowAddress, getApplicationAddress(art.appId), current);
        } else {
            return;
        }

        buySign(optInTxn, buy, asset.escrowProgram).then((response) => {
            console.log('sent money to smart contract');
            callApplicationSign(art.appId, adminAddr, algosdk.OnApplicationComplete.NoOpOC, [MAKE_PAYMENTS, encodeUint64(90), encodeUint64(10)], undefined, ['KYUH2SNU6FWFGBK6PNWI4EUIABOYFIQIQH2WOP3FW7DGA623ESTGXYQPJA', 'CB2MYSJFLTUMGRURINUT3B5A7VK45LNZWFRTLG2SJGBRVAQF32UDDUEX34'], true).then((resp) => {
                console.log('pog');
            });
        });
        // update active in db if sold out
    }

    const buyShuffle = async (): Promise<void> => {
        if (!user.walletAddress || !assets || !artwork || coll.collType !== CollectionType.SHUFFLE) {
            return;
        }

        const totalAssets = artwork.length;

        let idx: number = Math.floor(Math.random() * totalAssets);
        let newMask: number;
        while (true) {
            const response = await genericGet('/api/collection/soldMask/' + coll.id);
            if (response !== null && response !== undefined) {
                let binary: string = '';
                for (let i = 0; i < totalAssets; i++) {
                    if (i === idx) {
                        binary += '1';
                    } else {
                        binary += '0';
                    }
                }

                newMask = parseInt(binary, 2) | response;
                if (newMask === response) {
                    idx = Math.floor(Math.random() * totalAssets);
                } else {
                    coll.soldMask = newMask;
                    break;
                }
            } else {
                return;
            }
        }

        buyArtwork(artwork[idx]);
        // can make changes in global variables instead (also need to make sure this only happens on success)
        genericPost('/api/collection/update', coll);
    }

    const stopSellOffer = (art: Artwork) => {
        if (!user.walletAddress || !assets) {
            return;
        }

        callApplicationSign(art.appId, user.walletAddress, algosdk.OnApplicationComplete.NoOpOC, [STOP_SELL_OFFER]).then((response) => {
            coll.active = false;
            genericPost('/api/collection/update', coll);
        });
    }

    let listings: JSX.Element[] = [];
    if (coll && coll.collType !== CollectionType.SHUFFLE) {
        artwork?.forEach((elem: Artwork) => {
            if (!assets || !elem.appId || !(elem.assetId in assets)) {
                return;
            }
            const currAsset: Asset = assets[elem.assetId];
            listings.push(<div key={elem.id}>
                <p>{elem.assetId}</p>
                <Button action={() => {buyArtwork(elem)}} name="Buy" enabled={initLoad} />
                {user && user.walletAddress && currAsset.asaOwner === user.walletAddress && <Button action={() => {stopSellOffer(elem)}} name="Remove Listing" enabled={initLoad} />}
            </div>);
        });
    }

    return (
        <div>
            <Navbar />
            {coll &&
                <div>
                    <p>{coll.name}</p>
                    {listings}
                    {
                        coll.collType === CollectionType.SHUFFLE &&
                        <Button action={buyShuffle} name="Buy Shuffle" enabled={initLoad} />
                    }
                </div>
            }
        </div>
    );
}

export default Collection;