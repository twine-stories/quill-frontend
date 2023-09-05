import React, { useState, useEffect, useContext } from 'react'
import './CreateArtwork.css'
import { UserContext } from '../../App.tsx'
import Navbar from '../../components/layout/Navbar.tsx'
import { Typography, Grid, CircularProgress } from '@mui/joy'
import TwineInput from '../../components/TwineInput.tsx'
import TwineButton from '../../components/TwineButton.tsx'
import { User, ImageUpload } from '../../utils/types.ts'
import { createNFT } from '../../utils/blockchain/transactionRepository.ts'
import UploadImage from '../../components/UploadImage.tsx'
import { genericPost } from '../../utils/api.ts'
import MintNftPopup from '../../components/MintNftPopup.tsx'
import SuccessPopup from '../../components/SuccessPopup.tsx'
import { env } from '../../config.ts'
import { sendToS3 } from '../../utils/aws.ts'
import { MINT_IMGS_BUCKET } from '../../config.ts'
import Footer from '../../components/layout/Footer.tsx'

function CreateArtwork() {
    const encoder = new TextEncoder()
    const minter = env === 'prod' ? 'Twine' : 'Test'

    const context: object = useContext(UserContext)
    const user: User = context['user']

    const defaultImgUpload: ImageUpload = {
        name: '',
        file: null,
        preview: '',
        openUpload: false,
    }

    const [assetImg, setAssetImg] = useState<ImageUpload>(defaultImgUpload)

    const [openNftPopup, setOpenNftPopup] = useState<boolean>(false)

    const [openSuccess, setOpenSuccess] = useState<boolean>(false)

    const [arc69, setArc69] = useState<object>()
    const [imgHash, setImgHash] = useState<string>()

    const [uploadDataLoading, setUploadDataLoading] = useState<boolean>(false)
    const [mintNftLoading, setMintNftLoading] = useState<boolean>(false)

    useEffect(() => {
        if (arc69 && imgHash) {
            setOpenNftPopup(true)
        }
    }, [arc69, imgHash])

    const reset = () => {
        setArc69(undefined)
        setImgHash(undefined)
        setOpenNftPopup(false)
        setAssetImg(defaultImgUpload)
        setOpenSuccess(true)
        setMintNftLoading(false)

        const fields: HTMLInputElement[] = [
            document.getElementById('nickname') as HTMLInputElement,
            document.getElementById('asset-name') as HTMLInputElement,
            document.getElementById('asset-description') as HTMLInputElement,
        ]

        fields.forEach((field) => {
            field.value = ''
        });
        (document.getElementById('num-assets') as HTMLInputElement).value = '1'
    }

    const mintNft = async () => {
        const unitName: HTMLInputElement = document.getElementById(
            'nickname'
        ) as HTMLInputElement
        const assetName: HTMLInputElement = document.getElementById(
            'asset-name'
        ) as HTMLInputElement
        const numAssets: HTMLInputElement = document.getElementById(
            'num-assets'
        ) as HTMLInputElement

        if (arc69) {
            setMintNftLoading(true)
            await createNFT(
                user.walletAddress,
                unitName.value,
                assetName.value,
                'ipfs://' + imgHash + '#i',
                encoder.encode(JSON.stringify(arc69)),
                parseInt(numAssets.value),
                user.connectType
            )
            reset()
        }
    }

    const inputFieldsAreValid = () => {
        const unitName: HTMLInputElement = document.getElementById(
            'nickname'
        ) as HTMLInputElement
        const assetName: HTMLInputElement = document.getElementById(
            'asset-name'
        ) as HTMLInputElement
        const assetDescription: HTMLInputElement = document.getElementById(
            'asset-description'
        ) as HTMLInputElement
        const numAssets: HTMLInputElement = document.getElementById(
            'num-assets'
        ) as HTMLInputElement

        return (
            unitName &&
            unitName.value &&
            unitName.value.length <= 8 &&
            assetName &&
            assetName.value &&
            assetDescription &&
            assetDescription.value &&
            numAssets &&
            numAssets.value
        )
    }

    return (
        <div>
            <Navbar />
            <Grid>
                <Typography
                    level="h2"
                    color="purple"
                    sx={{ paddingLeft: '16px' }}
                >
                    Create Art
                </Typography>
                <Grid
                    container
                    direction="column"
                    rowSpacing={3}
                    sx={{ marginLeft: '30px' }}
                >
                    <Grid xs={11}>
                        <TwineInput
                            label="Name Art:"
                            placeholder="Enter art name"
                            inputAttrs={{
                                id: 'asset-name',
                            }}
                        />
                    </Grid>
                    <Grid xs={11}>
                        <TwineInput
                            label="Nickname"
                            placeholder="Enter a nickname for your asset (max 8 characters)"
                            inputAttrs={{
                                id: 'nickname',
                            }}
                        />
                    </Grid>
                    <Grid xs={11}>
                        <TwineInput
                            label="Description"
                            placeholder="Enter a description for your asset"
                            inputAttrs={{
                                id: 'asset-description',
                            }}
                        />
                    </Grid>
                    <Grid xs={11}>
                        <TwineInput
                            defaultValue="1"
                            label="Number of Assets"
                            placeholder="Number of this asset to mint"
                            inputAttrs={{
                                id: 'num-assets',
                            }}
                        />
                    </Grid>

                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justifyContent="space-around"
                        xs={11}
                        id="create-art-upload-wrapper"
                    >
                        <Grid xs={12}>
                            <Typography level="h3" color="purple">
                                Art
                            </Typography>
                        </Grid>
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="center"
                            id="create-art-image-upload"
                        >
                            {assetImg.preview ? (
                                <img
                                    src={assetImg.preview}
                                    alt=""
                                    onClick={() =>
                                        setAssetImg({
                                            ...assetImg,
                                            openUpload: true,
                                        })
                                    }
                                    id="create-art-upload"
                                />
                            ) : (
                                <TwineButton
                                    icon="/icons/purple_plus_light.svg"
                                    name="Upload"
                                    color="darkpurple"
                                    action={() =>
                                        setAssetImg({
                                            ...assetImg,
                                            openUpload: true,
                                        })
                                    }
                                />
                            )}
                        </Grid>
                    </Grid>
                    <UploadImage
                        open={assetImg.openUpload}
                        close={() =>
                            setAssetImg({
                                ...assetImg,
                                openUpload: false,
                            })
                        }
                        handleUpload={(selectedFile: File) =>
                            setAssetImg({
                                name: selectedFile.name,
                                file: selectedFile,
                                preview: URL.createObjectURL(selectedFile),
                                openUpload: false,
                            })
                        }
                        circle={false}
                        width="160px"
                        height="240px"
                        contain={true}
                    />
                    <Grid xs={11}>
                        <TwineButton
                            name={
                                uploadDataLoading ? (
                                    <CircularProgress
                                        color="darkpurple"
                                        variant="plain"
                                    />
                                ) : (
                                    'Upload Data'
                                )
                            }
                            action={async (e) => {
                                const assetDescription: HTMLInputElement =
                                    document.getElementById(
                                        'asset-description'
                                    ) as HTMLInputElement

                                if (inputFieldsAreValid() && assetImg.file) {
                                    setUploadDataLoading(true)
                                    let formData = new FormData()
                                    formData.append('key', assetImg.name)
                                    formData.append(
                                        'bucketName',
                                        MINT_IMGS_BUCKET
                                    )

                                    sendToS3(
                                        MINT_IMGS_BUCKET,
                                        assetImg.name,
                                        assetImg.file
                                    )

                                    const imgUpload = await genericPost(
                                        '/api/algo/upload-to-ipfs/s3',
                                        formData
                                    )

                                    setArc69({
                                        standard: 'arc69',
                                        description: assetDescription.value,
                                        media_url:
                                            'ipfs://' +
                                            imgUpload.IpfsHash +
                                            '#i',
                                        properties: {
                                            minter: minter,
                                        },
                                    })

                                    setImgHash(imgUpload.IpfsHash)
                                    setUploadDataLoading(false)
                                }
                            }}
                        />
                    </Grid>
                </Grid>
                <MintNftPopup
                    isOpen={openNftPopup}
                    onClose={() => setOpenNftPopup(false)}
                    mintNft={() => mintNft()}
                    loading={mintNftLoading}
                />
                <SuccessPopup
                    isOpen={openSuccess}
                    onClose={() => setOpenSuccess(false)}
                />
            </Grid>
             <Footer/> 
        </div>
    )
}

export default CreateArtwork
