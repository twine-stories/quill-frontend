import React, {useState, useContext, useEffect} from 'react';
import Navbar from "../components/Navbar.tsx";
import {UserContext} from "../App.tsx";
import {User, Episode} from '../utils/types.ts';
import styled from "styled-components";
import {AspectRatio, Box, Button, Card, IconButton, Input, Stack, Textarea, Typography} from "@mui/joy";
import {useImmer} from "use-immer";

function CreateEpisode() {

    const [episode, setEpisode] = useState<Episode>();

    const context: object = useContext(UserContext);
    const user: User = context['user'];

    const [inputList, setInputList] = useState([]);
    const [resultList, setResultList] = useImmer([]);
    const [counter, setCounter] = useState(0);

    function onAddTextButtonClick() {
        setResultList(resultList.concat(""));
        setInputList(inputList.concat(<Textarea
                key={counter}
                placeholder="Type in here…"
                value={resultList[counter]}
                onChange={(event) => {
                    setResultList(temp => {
                        temp[counter] = event.target.value;
                    })
                    // resultList[counter] = event.target.value;
                }}
                minRows={1}
                variant="outlined"
                color="neutral"
                endDecorator={
                    <Box sx={{ml: 'auto', gap: 1}}>
                        <IconButton variant="outlined" color="neutral" sx={{ml: 'auto'}}>⬆️</IconButton>
                        <IconButton variant="outlined" color="neutral" sx={{ml: 'auto'}}>⬇️</IconButton>
                        <IconButton variant="outlined" color="neutral" sx={{ml: 'auto'}}>❌</IconButton>
                    </Box>
                }
                sx={{minWidth: "40%"}}
            />
        ));
        setCounter(counter + 1);
    }

    function onAddImageButtonClick() {
        setResultList(resultList.concat("img"));
        setInputList(inputList.concat(
            <Card key={counter} variant="outlined" sx={{width: 320}}>
                <AspectRatio minHeight="120px" maxHeight="200px" sx={{my: 2}}>
                    <img
                        src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
                        srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"
                        loading="lazy"
                        alt=""
                    />
                </AspectRatio>
                <Box sx={{ml: 'auto', gap: 1}}>
                    <IconButton variant="outlined" color="neutral" sx={{ml: 'auto'}}>⬆️</IconButton>
                    <IconButton variant="outlined" color="neutral" sx={{ml: 'auto'}}>⬇️</IconButton>
                    <IconButton variant="outlined" color="neutral" sx={{ml: 'auto'}}>❌</IconButton>
                </Box>
            </Card>
        ));
        setCounter(counter + 1);
    }

    // useEffect(() => {
    //     if (user) {
    //         workGetByUrl(window.location.href.split('/')[4], setEpisode, () => {
    //             console.log('fail');
    //         });
    //     }
    // }, [user]);

    return (
        <div>
            {/*<Navbar />*/}
            <Typography level="h2" sx={{color: "#9E9FEB"}}>
                Create Episode
            </Typography>
            <Box
                sx={{
                    py: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}
            >
                <Input color="info" placeholder="Title Episode"/>
                <Input color="info" placeholder="Chapter"/>

                <Stack
                    alignItems="center"
                    spacing={0.25}
                    sx={{width: "100%"}}>
                    {inputList}
                </Stack>

                <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                    sx={{width: '100%'}}>
                    <Button variant="outlined" color="info" onClick={onAddTextButtonClick}>Add Text</Button>
                    <IconButton variant="outlined" color="info" onClick={function () {
                        console.log(resultList)
                    }} sx={{ml: 'auto'}}>✅</IconButton>
                    <Button variant="outlined" color="info" onClick={onAddImageButtonClick}>Add Image</Button>
                </Stack>

            </Box>
        </div>
    );
}

export default CreateEpisode;