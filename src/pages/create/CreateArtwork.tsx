import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App.tsx';
import Navbar from "../../components/Navbar.tsx";
import { Typography, Grid } from "@mui/joy";
import TwineInput from "../../components/TwineInput.tsx";
import TwineButton from "../../components/TwineButton.tsx";
import { User, ImageUpload } from '../../utils/types.ts';
import { createNFT } from '../../utils/blockchain/transactionRepository.ts';
import UploadImage from '../../components/UploadImage.tsx';
import { genericPost } from '../../utils/api.ts';

function CreateArtwork() {

    const context: object = useContext(UserContext);
    const user: User = context['user'];

    const [assetImg, setAssetImg] = useState<ImageUpload>({
        name: '',
        file: null,
        preview: '',
        openUpload: false
    });

    const mintNFT = async (walletAddress: string, unitName: string, assetName: string, assetUrl: string) => {
        await createNFT(walletAddress, unitName, assetName, assetUrl, user.connectType);
    }

    return (
        <div>
            <Navbar />
            <Grid>
                <Typography level="h2" color='purple' sx={{paddingLeft: "16px"}}>Create Art</Typography>
                <div>
                    <TwineInput label='Name Art:' placeholder='Enter art name' inputAttrs={{
                        id: 'assetName'
                    }}/>
                    <TwineInput label='Nickname' placeholder='Enter a nickname for your asset (max 8 characters)' inputAttrs={{
                        id: 'nickname'
                    }}/>
                    <Grid container alignItems='center' justifyContent='center'>
                        {assetImg.preview ? 
                            <img
                                src = {assetImg.preview}
                                alt = ""
                                onClick = {() => setAssetImg({
                                    ...assetImg,
                                    openUpload: true
                                })}
                                id='feedback-upload'
                            />
                            :
                            <TwineButton icon='/icons/purple_plus_light.svg' name='Upload' color='darkpurple' action={() => setAssetImg({
                                ...assetImg,
                                openUpload: true
                            })} />
                        }
                    </Grid>
                    <UploadImage 
                        open = {assetImg.openUpload}
                        close = {() => setAssetImg({
                            ...assetImg,
                            openUpload: false
                        })}
                        handleUpload = {(selectedFile: File) => setAssetImg({
                            name: selectedFile.name,
                            file: selectedFile,
                            preview: URL.createObjectURL(selectedFile),
                            openUpload: false
                        })}
                        circle={false}
                        width='200px'
                        height='200px'
                        contain={true}
                    />
                    <TwineButton name='Mint NFT' action={async (e) => {
                        const unitName: HTMLInputElement = document.getElementById('nickname') as HTMLInputElement;
                        const assetName: HTMLInputElement = document.getElementById('assetName') as HTMLInputElement;
                        
                        if (unitName && assetName && assetImg.file) {
                            let formData = new FormData();
                            formData.append("file", assetImg.file);
                            const response = await genericPost('/api/algo/upload-to-ipfs/file', formData);
                            console.log(response);
                            // mintNFT(user.walletAddress, unitName.value, assetName.value, assetUrl.value);
                        }
                    }}/>
                </div>
            </Grid>
        </div>
    );
}

export default CreateArtwork;