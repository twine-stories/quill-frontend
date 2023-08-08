import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App.tsx';
import Navbar from "../../components/Navbar.tsx";
import { Typography, Grid } from "@mui/joy";
import TwineInput from "../../components/TwineInput.tsx";
import TwineButton from "../../components/TwineButton.tsx";
import { User } from '../../utils/types.ts';
import { createNFT } from '../../utils/blockchain/transactionRepository.ts';

function CreateArtwork() {

    const context: object = useContext(UserContext);
    const user: User = context['user'];

    const mintNFT = async (walletAddress: string, unitName: string, assetName: string, assetUrl: string) => {
        await createNFT(walletAddress, unitName, assetName, assetUrl, user.connectType);
    }

    return (
        <div>
            <Navbar />
            <Grid>
                <Typography level="h2" color='purple' sx={{paddingLeft: "16px"}}>Create Art</Typography>
                <div>
                    <TwineInput label='Name Art:' placeholder='Enter Art Name' inputAttrs={{
                        id: 'assetName'
                    }}/>
                    <TwineInput placeholder='Unit name' inputAttrs={{
                        id: 'unitName'
                    }}/>
                    <TwineInput placeholder='Asset url' inputAttrs={{
                        id: 'assetUrl'
                    }}/>
                    <TwineButton name='Mint NFT' action={(e) => {
                        const unitName: HTMLInputElement = document.getElementById('unitName') as HTMLInputElement;
                        const assetName: HTMLInputElement = document.getElementById('assetName') as HTMLInputElement;
                        const assetUrl: HTMLInputElement = document.getElementById('assetUrl') as HTMLInputElement;
                        if (unitName && assetName && assetUrl) {
                            mintNFT(user.walletAddress, unitName.value, assetName.value, assetUrl.value);
                        }
                    }}/>
                </div>
            </Grid>
        </div>
    );
}

export default CreateArtwork;