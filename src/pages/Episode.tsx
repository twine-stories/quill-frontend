import React, {useContext} from 'react';
import useState from 'react-usestateref'
import Navbar from "../components/Navbar.tsx";
import {UserContext} from "../App.tsx";
import {User, Episode} from '../utils/types.ts';
import styled from "styled-components";
import {AspectRatio, Box, Button, Card, IconButton, Input, Stack, Textarea, Typography} from "@mui/joy";
import {useImmer} from "use-immer";
import {enableMapSet} from "immer";

enableMapSet();

function CreateEpisode() {

    const [episode, setEpisode] = useState<Episode>();

    const context: object = useContext(UserContext);
    const user: User = context['user'];

    const [inputList, setInputList, inputListRef] = useState([]);
    const [resultMap, setResultMap] = useImmer(new Map());
    const [counter, setCounter] = useState(0);

    function removeItem(index: number) {
        // setResultMap(newResultMap => {
        //     newResultMap.set(index, "!BAD!");
        // });

        var newInputList = [];
        for (let i = 0; i < inputListRef.current.length; i++) {
            // !== does not work. Why? TODO: FIGURE THAT OUT
            // But this works lol
            if (inputListRef.current[i].key != index) {
                newInputList.push(inputListRef.current[i]);
            }
        }
        setInputList(newInputList);
    }

    function onAddTextButtonClick() {
        setResultMap(newResultMap => {
            newResultMap.set(counter, "");
        });
        setInputList(inputList.concat(<Textarea
                key={counter}
                placeholder="Type in here…"
                value={resultMap.get(counter)}
                onChange={(event) => {
                    setResultMap(newResultMap => {
                        newResultMap.set(counter, event.target.value);
                    })
                }}
                minRows={1}
                variant="outlined"
                color="neutral"
                endDecorator={
                    <Box sx={{ml: 'auto', gap: 1}}>
                        <IconButton variant="outlined" color="neutral" sx={{ml: 'auto'}} onClick={function () {
                            console.log(1);
                        }}>⬆️</IconButton>
                        <IconButton variant="outlined" color="neutral" sx={{ml: 'auto'}}>⬇️</IconButton>
                        <IconButton onClick={function(){removeItem(counter)}} variant="outlined" color="neutral" sx={{ml: 'auto'}}>❌</IconButton>
                    </Box>
                }
                sx={{minWidth: "40%"}}
            />
        ));
        setCounter(counter + 1);
    }

    function onAddImageButtonClick() {
        setResultMap(newResultMap => {
            newResultMap.set(counter, "img");
        });
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
                    <IconButton onClick={function(){removeItem(counter)}} variant="outlined" color="neutral" sx={{ml: 'auto'}}>❌</IconButton>
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
                        console.log(resultMap)
                    }} sx={{ml: 'auto'}}>✅</IconButton>
                    <Button variant="outlined" color="info" onClick={onAddImageButtonClick}>Add Image</Button>
                </Stack>

            </Box>
        </div>
    );
}

export default CreateEpisode;