import React, { useState, useEffect } from 'react'
import './GalleryTile.css'
import { NFTCollection, Work } from '../utils/types.ts'
import { Card, Typography, Grid } from '@mui/joy'
import { STORY_IMGS_BUCKET } from '../config.ts'
import { COVER_PATH } from '../utils/aws.ts'
import { genericGet } from '../utils/api.ts'
import { Artwork } from '../utils/types.ts'

interface GalleryTileProps {
    work?: Work
    coll?: NFTCollection
    story: boolean
}

function GalleryTile(props: GalleryTileProps) {

    const [imgSrc, setImgSrc] = useState<string>();

    useEffect(() => {
        console.log('here')
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
                response.id
            })
        }
    }, [])
    

    if (props.story) {
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
    }
}

export default GalleryTile
