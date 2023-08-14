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
import MintNftPopup from '../../components/MintNftPopup.tsx';

function CreateArtwork() {

    const encoder = new TextEncoder();

    const context: object = useContext(UserContext);
    const user: User = context['user'];

    const [assetImg, setAssetImg] = useState<ImageUpload>({
        name: '',
        file: null,
        preview: '',
        openUpload: false
    });

    const [openNftPopup, setOpenNftPopup] = useState<boolean>(false);

    const [arc69, setArc69] = useState<object>();
    const [imgHash, setImgHash] = useState<string>();

    useEffect(() => {
        if (arc69 && imgHash) {
            setOpenNftPopup(true);
        }
    }, [arc69, imgHash])

    const mintNft = async () => {
        const unitName: HTMLInputElement = document.getElementById('nickname') as HTMLInputElement;
        const assetName: HTMLInputElement = document.getElementById('assetName') as HTMLInputElement;
        const numAssets: HTMLInputElement = document.getElementById('numAssets') as HTMLInputElement;

        if (arc69) {
            await createNFT(user.walletAddress, unitName.value, assetName.value, "ipfs://" + imgHash + "#i", encoder.encode(JSON.stringify(arc69)), parseInt(numAssets.value), user.connectType);
            setArc69(undefined);
            setImgHash(undefined);
            setOpenNftPopup(false);
        }
    }

    const inputFieldsAreValid = () => {
        const unitName: HTMLInputElement = document.getElementById('nickname') as HTMLInputElement;
        const assetName: HTMLInputElement = document.getElementById('assetName') as HTMLInputElement;
        const assetDescription: HTMLInputElement = document.getElementById('assetDescription') as HTMLInputElement;
        const numAssets: HTMLInputElement = document.getElementById('numAssets') as HTMLInputElement;

        return unitName && unitName.value && unitName.value.length <= 8 && assetName && assetName.value && assetDescription && assetDescription.value && numAssets && numAssets.value
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
                    <TwineInput label='Description' placeholder='Enter a description for your asset' inputAttrs={{
                        id: 'assetDescription'
                    }}/>
                    <TwineInput defaultValue='1' label='Number of Assets' placeholder='Number of this asset to mint' inputAttrs={{
                        id: 'numAssets'
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
                    <TwineButton name='Upload Data' action={async (e) => {
                        const assetDescription: HTMLInputElement = document.getElementById('assetDescription') as HTMLInputElement;
                        
                        if (inputFieldsAreValid() && assetImg.file) {
                            let formData = new FormData();
                            formData.append("file", assetImg.file);
                            const imgUpload = await genericPost('/api/algo/upload-to-ipfs/file', formData);
                            
                            setArc69({
                                standard: "arc69",
                                description: assetDescription.value,
                                media_url: "ipfs://" + imgUpload.IpfsHash + "#i",
                                properties: {
                                    minter: "test",
                                    number: 1,
                                },
                            });

                            setImgHash(imgUpload.IpfsHash);
                        }
                    }}/>
                    <MintNftPopup isOpen={openNftPopup} onClose={() => setOpenNftPopup(false)} mintNft={() => mintNft()} />
                </div>
            </Grid>
        </div>
    );
}

export default CreateArtwork;