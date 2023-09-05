import React, { useState, useEffect, useContext } from 'react'
import './GalleryTile.css'
import { NFTCollection, Work } from '../utils/types.ts'
import { Card, Typography, Grid } from '@mui/joy'
import { STORY_IMGS_BUCKET } from '../config.ts'
import { COVER_PATH } from '../utils/aws.ts'
import { genericGet } from '../utils/api.ts'
import { Artwork } from '../utils/types.ts'
import { ArtworkContext } from '../pages/create/CreateCollection.tsx'

interface GalleryTileProps {
    work?: Work
    coll?: NFTCollection
    otris?: string
    img?: string
    story?: boolean
    artId?: number
}

function GalleryTile(props: GalleryTileProps) {

    const context: object = useContext(ArtworkContext)

    const [imgSrc, setImgSrc] = useState<string>()
    const [noBorder, setNoBorder] = useState<boolean>(true)

    useEffect(() => {
        if (props.work) {
            setImgSrc(
                'https://' +
                STORY_IMGS_BUCKET +
                '.s3.amazonaws.com/' +
                COVER_PATH +
                props.work.cover
            )
        } else if (props.coll) {
            genericGet('/api/cover-artwork/collection/' + props.coll.id).then((response: Artwork) => {
                genericGet('/api/algo/asset-img/' + response.id).then((assetImg: string) => {
                    setImgSrc(assetImg)
                })
            })
        } else if (props.img) {
            setImgSrc(props.img)
        }
    }, [])
    
    if (props.otris) {
        return (
            <Grid xs={2} sm={2} md={2} lg={2}>
            <Card
                variant="outlined"
                sx={{
                    backgroundColor: '#14100E',
                    borderRadius: '32px',
                    border: '2px solid #241D19',
                    padding: '13px',
                    width: '200px',
                    height: '270px'
                }}
            >
                <Grid container alignItems="center" justifyContent="center">
                    <img
                        className="otris-tile-img"
                        src={imgSrc}
                        loading="lazy"
                        alt=""
                    />
                </Grid>
                <div className="gallery-tile-title-container">
                    <Typography level="h5" sx={{ fontFamily: 'Twine', color: '#9E9FEB'}}>
                        {props.otris}
                    </Typography>
                </div>
            </Card>
            </Grid>
        )
    }
    else if (props.story) {
        return (
            <Card
                variant="outlined"
                sx={{
                    backgroundColor: '#14100E',
                    borderRadius: '32px',
                    border: '2px solid #241D19',
                    padding: '13px',
                }}
                onClick={() => {
                    if (props.work) {
                        window.location.href = '/story/' + props.work['url']
                    }
                }}
                className="gallery-tile"
            >
                <Grid container alignItems="center" justifyContent="center">
                    <img
                        className="gallery-tile-img"
                        src={imgSrc}
                        loading="lazy"
                        alt=""
                    />
                </Grid>
                <div className="gallery-tile-title-container">
                    <Typography level="h2" sx={{ color: '#9E9FEB' }}>
                        {props.work && props.work['title']}
                    </Typography>
                </div>
            </Card>
        )
    } else if (props.coll) {
        return (
            <Card
                variant="outlined"
                sx={{
                    backgroundColor: '#14100E',
                    borderRadius: '32px',
                    border: '2px solid #241D19',
                    padding: '13px',
                }}
                onClick={() => {
                    if (props.coll) {
                        window.location.href = '/collection/' + props.coll.url
                    }
                }}
                className="gallery-tile"
            >
                <Grid container alignItems="center" justifyContent="center">
                    <img
                        className="gallery-tile-img"
                        src={imgSrc}
                        loading="lazy"
                        alt=""
                    />
                </Grid>
                <div className="gallery-tile-title-container">
                    <Typography level="h2" sx={{ color: '#9E9FEB' }}>
                        {props.coll && props.coll.name}
                    </Typography>
                </div>
            </Card>
        )
    } else if (props.img) {
        let borderStyling: object
        if (noBorder) {
            borderStyling = {
                borderColor: '#14100E'
            }
        } else {
            borderStyling = {}
        }

        return (
            <Card
                variant="outlined"
                sx={{
                    backgroundColor: '#14100E',
                    borderRadius: '32px',
                    border: '2px solid #241D19',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 'auto',
                    marginLeft: '32px',
                    marginBottom: '20px',
                    marginTop: '10px',
                    ...borderStyling
                }}
                className="gallery-tile"
                onClick={() => {
                    context['select'](props.artId)
                    setNoBorder(!noBorder)
                }}
            >
                <Grid container alignItems="center" justifyContent="center">
                    <img
                        className="gallery-tile-img"
                        src={imgSrc}
                        loading="lazy"
                        alt=""
                        style={{ objectFit: 'contain' }}
                    />
                </Grid>
            </Card>
        )
    }
}

export default GalleryTile
