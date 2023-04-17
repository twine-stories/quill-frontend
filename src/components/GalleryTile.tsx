import React from 'react';
import './GalleryTile.css';
import {NFTCollection, Work} from '../utils/types.ts';
import {AspectRatio, Card, Typography} from "@mui/joy";

interface GalleryTileProps {
    work: Work;
    coll?: NFTCollection;
    story: boolean;
}

function GalleryTile(props: GalleryTileProps) {
    if (props.story) {
        return (
            <Card variant="outlined" sx={{backgroundColor: "#14100E"}} onClick={() => {window.location.href = '/story/' + props.work['url']}}>
                <AspectRatio minHeight="120px" maxHeight="200px" sx={{my: 2}}>
                    <img
                        src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
                        srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"
                        loading="lazy"
                        alt=""
                    />
                </AspectRatio>
                <Typography level="h2" sx={{color: "#9E9FEB"}}>
                    {props.work && props.work['title']}
                </Typography>
                <Typography level="h6" sx={{color: "#E4E5FF"}}>
                    Episodes:
                </Typography>
                <Typography level="h6" sx={{color: "#E4E5FF"}}>
                    {/*Published on {props.work && props.work['publishStamp'].toString()}*/}
                </Typography>
            </Card>
        );
    } else {
        return (
            <Card variant="outlined" sx={{backgroundColor: "#14100E"}} onClick={() => {window.location.href = '/collection/' + props.coll.url}} className='gallery-tile'>
                <AspectRatio minHeight="120px" maxHeight="200px" sx={{my: 2}}>
                    <img
                        src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
                        srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"
                        loading="lazy"
                        alt=""
                    />
                </AspectRatio>
                <Typography level="h2" sx={{color: "#9E9FEB"}}>
                    {props.coll && props.coll.name}
                </Typography>
                <Typography level="h6" sx={{color: "#E4E5FF"}}>
                    Total:
                </Typography>
                <Typography level="h6" sx={{color: "#E4E5FF"}}>
                    Published on {props.coll && props.coll.publishStamp.toString()}
                </Typography>
            </Card>
        );
    }
}

export default GalleryTile;