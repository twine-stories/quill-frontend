import React, {useContext, useEffect} from 'react';
import useState from 'react-usestateref'
import Navbar from "../../components/Navbar.tsx";
import {UserContext} from "../../App.tsx";
import {User, Episode, Work, ProfitSplit} from '../../utils/types.ts';
import styled from "styled-components";
import {
    AspectRatio,
    Box,
    Button,
    Card, Checkbox,
    FormControl, FormHelperText,
    FormLabel,
    IconButton,
    Input,
    Stack, Switch,
    Textarea,
    Typography
} from "@mui/joy";
import {useImmer} from "use-immer";
import {enableMapSet} from "immer";
import Sheet from '@mui/joy/Sheet';
import TwineInput from "../../components/TwineInput.tsx";
import TwoColumnLayout from "../../components/TwoColumnLayout.tsx";
import TwineButton from "../../components/TwineButton.tsx";
import {episodeAdd, genericGet, genericPost, workAdd, workGetByUrl} from "../../utils/api.ts";
import ReactMarkdown from 'https://esm.sh/react-markdown@7'
import {v4 as uuidv4} from 'uuid';
import {CHAPTER_DELIMETER, MAX_COLLABORATORS} from "../../utils/constants.ts";
import Collaborator from "../../components/Collaborator.tsx";
import {CollaboratorContext} from "./Create.tsx";

enableMapSet();

interface CreateChapterProps {
    edit?: boolean;
}

function CreateChapter(props: CreateChapterProps) {
    const context: object = useContext(UserContext);
    const user: User = context['user'];

    const [inputList, setInputList, inputListRef] = useState<JSX.Element[]>([]);
    const [resultMap, setResultMap] = useImmer(new Map());
    const [counter, setCounter] = useState(0);
    const [view, setView] = useState(false);
    const [work, setWork] = useState<Work>(null);

    const [collaborators, setCollaborators] = useState<JSX.Element[]>([]);

    useEffect(() => {
        if (user) {
            workGetByUrl(window.location.href.split('/')[5], setWork, () => {
                console.log('fail');
            });

            if (collaborators.length === 0) {
                setCollaborators([
                    <Collaborator profitSplit={true} defaultCreator={user.userName}
                                  defaultWallet={user.walletAddress} defaultProfit={100} principle={true} id={uuidv4()}
                                  key={uuidv4()}/>
                ])
            }
        }
    }, [user]);


    const removeCollaborator = (id: number): void => {
        let newCollaborators: JSX.Element[] = [];
        collaborators.forEach((collaborator: JSX.Element) => {
            if (collaborator.props.id !== id) {
                newCollaborators.push(collaborator);
            }
        });

        setCollaborators(newCollaborators);
    };

    function removeItem(index: number) {
        //TODO: Fix this later 💀
        // add uuid
        setResultMap(newResultMap => {
            newResultMap.set(index, "!BAD!");
        });

        // !== does not work. Why? TODO: FIGURE THAT OUT
        // But this works lol
        setInputList(inputListRef.current.filter(val => val.key != index));
    }

    function moveItemUp(counter: number) {
        // iterate through inputListRef.current array and find index where key === counter
        // then swap with the one above it
        let index = -1;
        for (let i = 0; i < inputListRef.current.length; i++) {
            if (inputListRef.current[i]["key"] == counter) {
                index = i;
                break;
            }
        }
        const tempInputList = [...inputListRef.current];
        if (index !== 0 && index !== -1) {
            if (index !== 0) {
                const temp = tempInputList[index];
                tempInputList[index] = tempInputList[index - 1];
                tempInputList[index - 1] = temp;
                setInputList(tempInputList);
            }
        }
    }

    function moveItemDown(counter: number) {
        // iterate through inputListRef.current array and find index where key === counter
        // then swap with the one below it
        let index = -1;
        for (let i = 0; i < inputListRef.current.length; i++) {
            if (inputListRef.current[i]["key"] == counter) {
                index = i;
                break;
            }
        }
        const tempInputList = [...inputListRef.current];
        if (index !== tempInputList.length - 1) {
            const temp = tempInputList[index];
            tempInputList[index] = tempInputList[index + 1];
            tempInputList[index + 1] = temp;
            setInputList(tempInputList);
        }
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
            <Card key={counter} variant="outlined" color="neutral" sx={{width: 320}}>
                <AspectRatio minHeight="120px" maxHeight="200px" sx={{my: 2}}>
                    <img
                        src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
                        srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"
                        loading="lazy"
                        alt=""
                    />
                </AspectRatio>
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
        ));
        setCounter(counter + 1);
    }

    return (
        <div>
            <Navbar/>
            <TwoColumnLayout leftComponent={
                <div>
                    <Typography level="h2" sx={{color: "#9E9FEB"}}>
                        Create Chapter
                    </Typography>

                    {view &&
                        <div>
                            <Box
                                sx={{
                                    py: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <Sheet sx={{width: '50%', my: 1, borderRadius: "20px",}} color="neutral"
                                       variant="outlined">
                                    {
                                        reformatContent(true)
                                    }
                                </Sheet>
                            </Box>
                        </div>
                    }

                    <div style={{display: view ? 'none' : null}}>
                        <Box
                            sx={{
                                py: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                // alignItems: 'center',
                                // flexWrap: 'wrap',
                            }}
                        >
                            <FormControl>
                                <FormLabel>Story Name</FormLabel>
                                <Typography level="h4" sx={{color: "#9E9FEB"}}>
                                    {work && work.title}
                                </Typography>
                            </FormControl>


                            <TwineInput id="title" label="Chapter Title" placeholder="Enter Chapter Title..."/>

                            <Stack
                                alignItems="center"
                                spacing={0.5}
                                sx={{width: "100%"}}>
                                {inputList}
                            </Stack>

                            <Stack
                                direction="row"
                                // spacing={2}
                                justifyContent="center"
                                sx={{width: '100%'}}>
                                <Button startDecorator={<img
                                    src="/icons/white_text.svg"
                                    width="20px" height="20px"
                                />} variant="outlined" color="neutral" onClick={onAddTextButtonClick}>Add Text</Button>
                                <Button startDecorator={<img
                                    src="/icons/add_image.svg"
                                    width="20px" height="20px"
                                />} variant="outlined" color="neutral" onClick={onAddImageButtonClick}>Add
                                    Image</Button>
                            </Stack>

                            <TwineInput id="endOfChapterMessage" label="End of Chapter Message"
                                        placeholder="(Optional) Enter End of Chapter Message..." multiline={true}/>
                        </Box>

                        <CollaboratorContext.Provider value={{
                            'remove': removeCollaborator
                        }}>
                            <div>
                                {/*<Typography level="h5" sx={{color: "#9E9FEB"}}>Principle Creator</Typography>*/}
                                {/*{user && <Collaborator profitSplit={true} defaultCreator={user.userName}*/}
                                {/*                       defaultWallet={user.walletAddress} defaultProfit={100}*/}
                                {/*                       principle={true} id={uuidv4()}*/}
                                {/*                       key={uuidv4()}/>}*/}

                                <Typography level="h5" sx={{color: "#9E9FEB"}}>Collaborators</Typography>
                                {collaborators}
                                <TwineButton name='Add Collaborator' enabled={collaborators.length < MAX_COLLABORATORS}
                                             action={(e) => {
                                                 if (collaborators.length < MAX_COLLABORATORS) {
                                                     const id: number = uuidv4();
                                                     setCollaborators([
                                                         ...collaborators,
                                                         <Collaborator profitSplit={true} principle={false} id={id}
                                                                       key={id}/>
                                                     ])
                                                 }
                                             }}/>
                            </div>
                        </CollaboratorContext.Provider>
                    </div>
                </div>
            }
                             rightComponent={
                                 <Box
                                     sx={{
                                         py: 2,
                                         display: 'flex',
                                         flexDirection: 'column',
                                         gap: 0.5,
                                         alignItems: 'center',
                                         flexWrap: 'wrap',
                                     }}
                                 >
                                     {/*FIX THIS LATER*/}
                                     <Typography sx={{backgroundColor: "#14100E", borderRadius: "10px", p: "10px"}}
                                                 level="h6" endDecorator={<Switch id="mature" sx={{ml: 1}}/>}>
                                         Mature
                                     </Typography>

                                     {/*FIX THIS LATER TOO*/}
                                     <Checkbox id="guidelines" color="info"
                                               label="I Verify This Work is Mine and Follows Community Guidelines."/>

                                     {!view && <Button variant="outlined" color="neutral" onClick={() => {
                                         setView(true);
                                     }}>Preview</Button>}
                                     {view && <Button variant="outlined" color="neutral"
                                                      onClick={() => setView(false)}>Edit</Button>}
                                     <TwineButton name="Save Draft"
                                                  icon="/icons/purple_checkmark.svg" action={(e) => {
                                         makeEpisode(false)
                                     }}></TwineButton>
                                     <TwineButton name="Create Chapter" icon="/icons/green_plus.svg"
                                                  color="green" action={(e) => {
                                         makeEpisode(true)
                                     }}></TwineButton>


                                 </Box>
                             }
            />
        </div>

    );

    function reformatContent(display: boolean) {
        var compoundedElements = []
        for (let i = 0; i < inputListRef.current.length; i++) {
            // to convert string to number, use + in front of it for some reason 💀🗿
            let content = resultMap.get(+inputListRef.current[i]["key"])
            if (content === "!BAD!") {
                // THIS SHOULD NEVER HAPPEN
                // IF IT DOES, GOOD LUCK
                console.log("good luck");
            } else if (content.indexOf("img") !== -1) {
                if (!display) {
                    compoundedElements.push("https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286")
                } else {
                    compoundedElements.push(
                        <AspectRatio variant="plain" minHeight="120px" maxHeight="300px" objectFit="contain"
                                     sx={{my: 2}}>
                            <img
                                src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
                                srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"
                                loading="lazy"
                                alt=""
                            />
                        </AspectRatio>)
                }
            } else {
                if (!display) {
                    compoundedElements.push(content)
                } else {
                    compoundedElements.push(<Typography level="h6"
                                                        sx={{color: "#9E9FEB"}}><ReactMarkdown>{content}</ReactMarkdown></Typography>)
                }
            }
        }
        return compoundedElements;
    }

    async function checkCollaborators(): Promise<Map<User, number>> {
        const collabUsernames: HTMLCollectionOf<Element> = document.getElementsByClassName('usernameTopLeftCollab');
        const collabValues: HTMLCollectionOf<Element> = document.getElementsByClassName('profitPercentTopRightCollab');
        let usernames: string[] = [];
        let values: number[] = [];

        Array.from(collabUsernames).forEach((elem: Element) => {
            usernames.push(elem.value);
        });

        Array.from(collabValues).forEach((elem: Element) => {
            values.push(parseInt(elem.value));
        })

        const sum: number = values.reduce((partial, curr) => partial + curr, 0);
        if (sum !== 100) {
            // TODO: Make this a snackbar
            console.log('invalid percent sum');
            return null;
        }

        let users: User[] = [];
        for (let i = 0; i < usernames.length; i++) {
            if (usernames[i] === '') {
                console.log('invalid username');
                return null;
            }
            const response = await genericGet('/api/user/name/' + usernames[i])
            if (response) {
                users.push(response);
            } else {
                console.log('invalid username');
                return null;
            }
        }

        // Map the users to their respective profit splits
        let profitSplitMap: Map<User, number> = new Map();
        for (let i = 0; i < users.length; i++) {
            profitSplitMap.set(users[i], values[i]);
        }
        return profitSplitMap;
    }

    async function makeEpisode(published: boolean) {
        const title: HTMLInputElement = document.getElementById("title") as HTMLInputElement;
        const mature: HTMLInputElement = document.getElementById("mature") as HTMLInputElement;
        const guidelines: HTMLInputElement = document.getElementById("guidelines") as HTMLInputElement;
        const endOfChapterMessage: HTMLInputElement = document.getElementById("endOfChapterMessage") as HTMLInputElement;
        const publishStamp = published ? new Date() : null;
        const profitSplitMap = await checkCollaborators();
        if (title.value && guidelines.checked && profitSplitMap) {
            let newEpisode: Episode = {
                work: work,
                title: title.value,
                cover: 'cover',
                content: reformatContent(false).join(CHAPTER_DELIMETER),
                url: work.url + "_" + title.value.replace(/\s/g, "-").toLowerCase(),
                endOfChapterMessage: endOfChapterMessage.value,
                mature: mature.checked,
                flags: 0,
                publishStamp: publishStamp,
                published: published,
            };

            let response = await genericPost("/api/episode/add", newEpisode)
            if (response) {
                console.log("got response back ", response);
            } else {
                console.log("Your title is the same as one of your existing chapters. Please choose a different chapter name.");
                return;
            }
            newEpisode.id = response;

            // Iterate through the map and create a profit split for each user
            profitSplitMap.forEach((value, user) => {
                let newProfitSplit: ProfitSplit = {
                    episode: newEpisode,
                    creator: user,
                    percentage: value,
                }
                genericPost("/api/profitSplit/add", newProfitSplit).then((response) => {
                    if (response) {
                        console.log("success");
                    } else {
                        console.log("failure");
                    }
                });
            });
        }
    }
}

export default CreateChapter;