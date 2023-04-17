import React, { useContext } from "react";
import {
    AspectRatio,
    Box,
    Card, Grid,
    IconButton,
    Typography
} from "@mui/joy";
import { ChapterContext } from "../pages/create/CreateChapter.tsx";
import TwineButton from './TwineButton.tsx';
import { ImageUpload } from '../utils/types.ts';
import { enableMapSet } from "immer";
import { Updater } from "use-immer";
import {v4 as uuidv4} from 'uuid';
import UploadImage from './UploadImage.tsx';
import {CHAPTER_IMGS_BUCKET} from "../config.ts";

interface InputListItemProps {
    counter: number;
    imgSrc?: string;
}
enableMapSet();

function InputListItem(props: InputListItemProps) {
    const counter = props.counter;
    const context: object = useContext(ChapterContext);

    const resultMap: Map<any, any> = context['resultMap'];
    const setResultMap: Updater<Map<any, any>> = context['setResultMap'];
    const moveItemUp = context['moveItemUp'];
    const moveItemDown = context['moveItemDown'];
    const removeItem = context['removeItem'];

    // for edit episode need to change src for img to pull from s3 (us CHAPTER_IMGS_BUCKET)
    
    return (
        <Card key={counter} variant="outlined" color="neutral">
            {/*<AspectRatio minHeight="120px" maxHeight="200px" sx={{my: 2}}>*/}
            {/*    <img*/}
            {/*        src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"*/}
            {/*        srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"*/}
            {/*        loading="lazy"*/}
            {/*        alt=""*/}
            {/*    />*/}
            {/*</AspectRatio>*/}

            {/*src = {resultMap.get(counter).preview ? resultMap.get(counter).preview : 'https://' + STORY_IMGS_BUCKET + '.s3.amazonaws.com/' + STORY_BANNER_PATH + (work ? work.banner : banner.name)}*/}

            <Grid container direction='column' alignItems='flex-start' justifyContent='space-around' className='create-image-upload'>
                <Typography level="h3" color='purple'>Upload Image</Typography>
                <Grid container alignItems='center' justifyContent='center' xs={12}>
                    <Grid container alignItems='center' justifyContent='center' id='create-chapter-img-wrapper'>
                        {(resultMap.get(counter) && resultMap.get(counter).preview) ?
                            <img
                                src = {resultMap.get(counter).preview}
                                alt = ""
                                onClick = {() => setResultMap(newResultMap => {
                                    newResultMap.set(counter, {...resultMap.get(counter), openUpload: true});
                                })}
                                id='create-chapter-img'
                            />
                            :
                            <TwineButton icon='/icons/purple_plus_light.svg' name='Upload' color='darkpurple' action={() => {
                                setResultMap(newResultMap => {
                                    newResultMap.set(counter, {...resultMap.get(counter), openUpload: true});
                                });
                            }} />
                        }
                    </Grid>
                </Grid>
                <UploadImage
                    open={resultMap.get(counter) && resultMap.get(counter).openUpload}
                    close={() => setResultMap(newResultMap => {
                        newResultMap.set(counter, {...resultMap.get(counter), openUpload: false});
                    })}
                    handleUpload={(selectedFile: File) => {
                        let imgName = uuidv4() + "." + selectedFile.name.split('.').pop();

                        let uploadObj: ImageUpload = {
                            name: imgName,
                            preview: URL.createObjectURL(selectedFile),
                            file: selectedFile,
                            openUpload: false
                        };

                        setResultMap(newResultMap => {
                            newResultMap.set(counter, uploadObj);
                        })}
                    }
                    circle={false}
                    width='440px'
                    height='100px'
                />
            </Grid>
            <Box sx={{ml: 'auto'}}>
                <IconButton onClick={function () {
                    moveItemUp(counter)
                }} variant="plain" color="neutral" sx={{ml: 'auto'}}><img src="/icons/purple_arrow_up.svg"
                                                                            width="30px" height="30px"/></IconButton>
                <IconButton onClick={function () {
                    moveItemDown(counter)
                }} variant="plain" color="neutral" sx={{ml: 'auto'}}><img src="/icons/purple_arrow_down.svg"
                                                                            width="30px" height="30px"/></IconButton>
                <IconButton onClick={function () {
                    removeItem(counter)
                }} variant="plain" color="neutral" sx={{ml: 'auto'}}><img src="/icons/red_remove.svg" width="30px"
                                                                            height="30px"/></IconButton>
            </Box>
        </Card>
    );
}

export default InputListItem;