import React, { useState, useContext, useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import Button from '../components/Button.tsx';
import { UserContext } from "../App.tsx";
import { User, Artwork } from '../utils/types.ts';
import { artworkGetAll } from '../utils/api.ts';
import { optIn, buyAsset } from '../utils/blockchain/transactionRepository.ts';
import { Transaction } from 'algosdk';

function Art() {
    const [artwork, setArtwork] = useState<Artwork[]>();
    const context: object = useContext(UserContext);
    const user: User = context['user'];

    useEffect(() => {
        artworkGetAll().then(response => {
            setArtwork(response);
        });
    }, []);

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