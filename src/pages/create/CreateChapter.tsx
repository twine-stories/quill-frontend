import React, {useContext, useEffect, createContext} from 'react';
import './CreateChapter.css';
import useState from 'react-usestateref'
import Navbar from "../../components/Navbar.tsx";
import {UserContext} from "../../App.tsx";
import {User, Episode, Work, ProfitSplit, ImageUpload} from '../../utils/types.ts';
import styled from "styled-components";
import {
    AspectRatio,
    Box,
    Button,
    Card, Checkbox, CircularProgress,
    FormControl, FormHelperText,
    FormLabel, Grid,
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
import {episodeAdd, episodeGetByUrl, genericGet, genericPost, workAdd, workGetByUrl} from "../../utils/api.ts";
import {v4 as uuidv4} from 'uuid';
import {CHAPTER_DELIMETER, CHAPTER_IMG_DELIMETER, MAX_COLLABORATORS} from "../../utils/constants.ts";
import Collaborator from "../../components/Collaborator.tsx";
import {CollaboratorContext} from "./Create.tsx";
import InputListItem from '../../components/InputListItem.tsx';
import {sendToS3, COVER_PATH, STORY_BANNER_PATH} from '../../utils/aws.ts';
import {CHAPTER_IMGS_BUCKET, STORY_IMGS_BUCKET} from "../../config.ts";
import UploadImage from "../../components/UploadImage.tsx";
import {useNavigate} from "react-router-dom";
import ErrorPopup from "../../components/ErrorPopup.tsx";
import {marked} from "marked";

enableMapSet();

interface CreateChapterProps {
    edit?: boolean;
}

export const ChapterContext = createContext(null as any);

function CreateChapter(props: CreateChapterProps) {
    const navigate = useNavigate();

    const context: object = useContext(UserContext);
    const user: User = context['user'];
    const [chapter, setChapter] = useState<Episode>(null);

    const [uploading, setUploading] = useState<boolean>(false);
    const [inputList, setInputList, inputListRef] = useState<JSX.Element[]>([]);
    const [resultMap, setResultMap] = useImmer(new Map());
    const [counter, setCounter] = useState(0);
    const [view, setView] = useState(false);
    const [work, setWork] = useState<Work>(null);
    const [errorMessage, setErrorMessage] = useState<string>('Error creating story.');
    const [openError, setOpenError] = useState<boolean>(false);
    const [populatedForEdit, setPopulatedForEdit] = useState<boolean>(false);

    const [cover, setCover] = useState<ImageUpload>({
        name: '',
        preview: '',
        file: null,
        openUpload: false
    });

    const [collaborators, setCollaborators] = useState<JSX.Element[]>([]);
    const [preview, setPreview] = useState<JSX.Element[]>([]);

    const bucketName: string = CHAPTER_IMGS_BUCKET;

    useEffect(() => {
        if (user && !props.edit) {
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

    useEffect(() => {
        if (user && props.edit) {
            episodeGetByUrl(window.location.href.split('/')[5], setChapter, () => {
                console.log('fail');
            });
        }
    }, [props.edit, user]);

    useEffect(() => {
        if (user && props.edit && chapter && !populatedForEdit) {
            setWork(chapter.work);

            setPopulatedForEdit(true);

            var newCounter = 0;
            var newInputList: JSX.Element[] = [];
            var newResultMap = new Map();

            genericGet('/api/profitSplit/episode/' + chapter.id).then((response: ProfitSplit[]) => {
                let collabs: JSX.Element[] = [<div></div>];
                response.forEach((item: ProfitSplit) => {
                    if (item.creator.userName !== chapter.work.creator.userName) {
                        collabs.push(<Collaborator profitSplit={true} defaultCreator={item.creator.userName}
                            defaultWallet={item.creator.walletAddress} defaultProfit={item.percentage} principle={false} id={uuidv4()}
                            key={uuidv4()}/>);
                    } else {
                        collabs[0] = <Collaborator profitSplit={true} defaultCreator={item.creator.userName}
                            defaultWallet={item.creator.walletAddress} defaultProfit={item.percentage} principle={true} id={uuidv4()}
                            key={uuidv4()}/>
                    }
                })
                setCollaborators(collabs);
            })

            let rawContentArray = chapter.content.split(CHAPTER_DELIMETER);
            for (let i = 0; i < rawContentArray.length; i++) {
                let rawContent = rawContentArray[i];
                newCounter += 1;

                if (rawContent.includes(CHAPTER_IMG_DELIMETER)) {
                    let imgName = rawContent.split(CHAPTER_IMG_DELIMETER)[1];
                    let imgSrc = `https://${bucketName}.s3.amazonaws.com/${imgName}`;
                    // onAddImageButtonClick(imgSrc);
                    newResultMap.set(i, {
                        name: imgName,
                        preview: imgSrc,
                        file: null,
                        openUpload: false
                    });

                    newInputList.push(<InputListItem key={i} counter={i} />)
                } else {
                    // onAddTextButtonClick(rawContent);
                    newResultMap.set(i, rawContent);
                    newInputList.push(
                        <Textarea
                            key={i}
                            placeholder="Type in here…"
                            defaultValue={rawContent}
                            // value={defaultValue}
                            onChange={(event) => {
                                setResultMap(newResultMap => {
                                    newResultMap.set(i, event.target.value);
                                })
                            }}
                            minRows={1}
                            variant="outlined"
                            color="neutral"
                            endDecorator={
                                <Box sx={{ml: 'auto'}}>
                                    <IconButton onClick={function () {
                                        moveItemUp(i)
                                    }} variant="plain" color="neutral" sx={{ml: 'auto'}}><img src="/icons/purple_arrow_up.svg"
                                                                                              width="30px" height="30px"/></IconButton>
                                    <IconButton onClick={function () {
                                        moveItemDown(i)
                                    }} variant="plain" color="neutral" sx={{ml: 'auto'}}><img src="/icons/purple_arrow_down.svg"
                                                                                              width="30px" height="30px"/></IconButton>
                                    <IconButton onClick={function () {
                                        removeItem(i)
                                    }} variant="plain" color="neutral" sx={{ml: 'auto'}}><img src="/icons/red_remove.svg" width="30px"
                                                                                              height="30px"/></IconButton>
                                </Box>
                            }
                            sx={{minWidth: "40%"}}
                        />
                    );
                }
            }

            setResultMap(newResultMap);
            setInputList(newInputList);
            setCounter(newCounter);
        }
    }, [props.edit, user, chapter]);

    useEffect(() => {
        if (view) {
            reformatContent(true).then((response: JSX.Element[]) => {
                setPreview(response);
            });
        }
    }, [view]);

    const prepareAndUpload = async (uploadType: string) => {
        await sendToS3(bucketName, (COVER_PATH + cover.name), cover.file);
    }

    const handleUpload = (selectedFile: File, uploadType: string) => {
        if (uploadType !== 'cover') {
            return;
        }

        let imgName = uuidv4() + "." + selectedFile.name.split('.').pop();

        let uploadObj: ImageUpload = {
            name: imgName,
            preview: URL.createObjectURL(selectedFile),
            file: selectedFile,
            openUpload: false
        }

        if (chapter) {
            setChapter({
                ...chapter,
                cover: imgName
            });
        }
        setCover(uploadObj);
    }

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
        //TODO: Fix this later
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

    function onAddTextButtonClick(defaultValue = "") {
        setResultMap(newResultMap => {
            newResultMap.set(counter, defaultValue);
        });
        setInputList(inputList.concat(
            <Textarea
                key={counter}
                placeholder="Type in here…"
                defaultValue={defaultValue}
                // value={defaultValue}
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
            />
        ));
        setCounter(counter + 1);
    }

    function onAddImageButtonClick(defaultImgSrc = "") {
        setResultMap(newResultMap => {
            newResultMap.set(counter, {
                name: '',
                preview: defaultImgSrc,
                file: null,
                openUpload: false
            });
        });

        setInputList(inputList.concat(
            <InputListItem key={counter} counter={counter} />
        ));
        setCounter(counter + 1);
    }

    return (
        <div>
            <Navbar/>
            <TwoColumnLayout leftComponent={
                <div>
                    <Typography level="h2" color='purple'>{props.edit ? "Edit Chapter" : "Create Chapter"}</Typography>

                    {view &&
                        <div id='chapter-content'>
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
                                <Grid>
                                    {preview}
                                </Grid>
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

                            {(!props.edit || chapter) && <TwineInput defaultValue={(props.edit) ? chapter['title'] : ""} id="title" label="Chapter Title" placeholder="Enter Chapter Title..."/>}

                            <ChapterContext.Provider value={{
                                'resultMap': resultMap,
                                'setResultMap': setResultMap,
                                'moveItemUp': moveItemUp,
                                'moveItemDown': moveItemDown,
                                'removeItem': removeItem
                            }}>
                                <Stack id='create-chapter-stack'
                                    alignItems="center"
                                    spacing={3}
                                    sx={{width: "100%"}}>
                                    {inputList}
                                </Stack>
                            </ChapterContext.Provider>

                            <Stack
                                direction="row"
                                justifyContent="center"
                                sx={{width: '100%', marginBottom: '20px'}}>
                                <Button startDecorator={<img
                                    src="/icons/white_text.svg"
                                    width="20px" height="20px"
                                />} variant="outlined" color="neutral" onClick={() => onAddTextButtonClick()}>Add Paragraph</Button>
                                <Button startDecorator={<img
                                    src="/icons/add_image.svg"
                                    width="20px" height="20px"
                                />} variant="outlined" color="neutral" onClick={() => onAddImageButtonClick()}>Add
                                    Image</Button>
                            </Stack>

                            {(!props.edit || chapter) && <TwineInput defaultValue={(props.edit) ? chapter['endOfChapterMessage'] : ""} id="endOfChapterMessage" label="End of Chapter Message (Optional)"
                                                                     placeholder="Enter text..." multiline={true}/>}
                        </Box>

                        <CollaboratorContext.Provider value={{
                            'remove': removeCollaborator
                        }}>
                            <Grid container direction='column' justifyContent='flex-start' alignItems='flex-start' xs={12}>
                                {/*<Typography level="h5" sx={{color: "#9E9FEB"}}>Principle Creator</Typography>*/}
                                {/*{user && <Collaborator profitSplit={true} defaultCreator={user.userName}*/}
                                {/*                       defaultWallet={user.walletAddress} defaultProfit={100}*/}
                                {/*                       principle={true} id={uuidv4()}*/}
                                {/*                       key={uuidv4()}/>}*/}

                                <Typography level="h5" sx={{color: "#9E9FEB"}}>Collaborators</Typography>
                                {collaborators}
                                <TwineButton name='Add Collaborator' enabled={collaborators.length < MAX_COLLABORATORS}
                                             sx={{marginTop: '20px'}}
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
                            </Grid>
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
                                     <Grid container direction='column' alignItems='flex-start' justifyContent='space-around' className='create-image-upload'>
                                         <Typography level="h3" color='purple'>Cover Art</Typography>
                                         <Grid container alignItems='center' justifyContent='center' id='create-cover-wrapper-2'>
                                             {((chapter && chapter.cover) || cover.preview) ?
                                                 <img
                                                     src = {cover.preview ? cover.preview : 'https://' + CHAPTER_IMGS_BUCKET + '.s3.amazonaws.com/' + COVER_PATH + (chapter ? chapter.cover : cover.name)}
                                                     alt = ""
                                                     onClick = {() => setCover({
                                                         ...cover,
                                                         openUpload: true
                                                     })}
                                                     id='create-cover-2'
                                                     style={{objectFit: 'cover'}}
                                                 />
                                                 :
                                                 <TwineButton icon='/icons/purple_plus_light.svg' name='Upload' color='darkpurple' action={() => setCover({
                                                     ...cover,
                                                     openUpload: true
                                                 })} />
                                             }
                                         </Grid>
                                         <UploadImage
                                             open={cover.openUpload}
                                             close={() => setCover({
                                                 ...cover,
                                                 openUpload: false
                                             })}
                                             handleUpload={(file: File) => handleUpload(file, 'cover')}
                                             circle={false}
                                             width='240px'
                                             height='160px'
                                         />
                                     </Grid>

                                     {/*TODO: FIX THIS LATER*/}
                                     {(!props.edit || chapter) && <Typography sx={{backgroundColor: "#14100E", borderRadius: "10px", p: "10px"}}
                                                 level="h6" endDecorator={<Switch checked={props.edit ? chapter['mature'] : false} id="mature" sx={{ml: 1}}/>}>
                                         Mature
                                     </Typography>}


                                     {/*TODO: FIX THIS LATER TOO*/}
                                     <Checkbox id="guidelines" color="info"
                                               label="I Verify This Work is Mine and Follows Community Guidelines."/>

                                     {!view && <Button variant="outlined" color="neutral" onClick={() => {
                                         setView(true);
                                     }}>Preview</Button>}
                                     {view && <Button variant="outlined" color="neutral"
                                                      onClick={() => setView(false)}>Edit</Button>}

                                     {!props.edit &&
                                         <>
                                             <TwineButton name="Save Draft"
                                                          icon="/icons/purple_checkmark.svg" action={(e) => {
                                                 postEpisode(false)
                                             }}></TwineButton>
                                             <TwineButton name="Create Chapter" icon="/icons/green_plus.svg"
                                                          color="green" action={(e) => {
                                                 postEpisode(true)
                                             }}></TwineButton>
                                         </>
                                     }
                                     {props.edit &&
                                         <>
                                             {returnSaveButton()}
                                             <TwineButton
                                                 name='Cancel Edit Chapter' color="blackgreen" icon="/icons/green_x.svg"
                                                 action={(e) => navigate(-1)}/>
                                         </>
                                     }
                                     <ErrorPopup isOpen={openError} onClose={() => setOpenError(false)} message={errorMessage} />
                                 </Box>
                             }
            />
        </div>

    );

    function returnSaveButton() {
        if (chapter && chapter['publishStamp']) {
            return (<>
                <TwineButton
                    name={uploading ? <CircularProgress color='darkpurple' variant='plain'/> : 'Save Chapter'} color="green"
                    icon="/icons/green_checkmark.svg"
                    action={(e) => postEpisode(true, chapter)}/>
                <TwineButton name="Transfer to Draft" icon="/icons/purple_paper.svg"
                             action={(e) => postEpisode(false, chapter)}></TwineButton>
            </>)
        } else {
            return (<>
                <TwineButton
                    name={uploading ? <CircularProgress color='darkpurple' variant='plain'/> : 'Save Chapter'} color="green"
                    icon="/icons/green_checkmark.svg"
                    action={(e) => postEpisode(false, chapter)}/>
                <TwineButton name="Transfer to Published" icon="/icons/purple_paper.svg"
                             action={(e) => postEpisode(true, chapter)}></TwineButton>
            </>)
        }
    }


    async function reformatContent(display: boolean) {
        var compoundedElements: (string | JSX.Element)[] = [];
        for (let i = 0; i < inputListRef.current.length; i++) {
            // to convert string to number, use + in front of it for some reason 💀🗿
            let content = resultMap.get(+inputListRef.current[i]["key"])
            // some of this logic may need to change for editing to ensure that unchanged images dont get overriden
            if (content === "!BAD!") {
                // THIS SHOULD NEVER HAPPEN
                // IF IT DOES, GOOD LUCK
                console.log("good luck");
            } else if (content['name'] !== undefined) {
                if (!display) {
                    if (content['file'] !== null) {
                        await sendToS3(CHAPTER_IMGS_BUCKET, content['name'], content['file']);
                    }
                    compoundedElements.push(CHAPTER_IMG_DELIMETER + content['name']);
                } else {
                    // need to change src to pull from s3 when editing if they havent changed that image
                    compoundedElements.push(
                        <AspectRatio variant="plain" minHeight="120px" maxHeight="300px" objectFit="contain"
                                     sx={{my: 2}}>
                            <img
                                src={content['preview']}
                                loading="lazy"
                                alt=""
                            />
                        </AspectRatio>)
                }
            } else {
                if (!display) {
                    compoundedElements.push(content)
                } else {
                    // compoundedElements.push(<Typography level="h6" color='white'>{content}</Typography>)
                    compoundedElements.push(<div dangerouslySetInnerHTML={{__html: marked.parse(content)}}></div>)
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

    async function postEpisode(published: boolean, currentChapter?: Episode) {
        if (published) {
            setErrorMessage('Oops! Publishing is temporarily disabled. We\'re working behind the scenes to enhance your story-sharing experience. But don\'t worry, you can still save your incredible story as a draft and get it ready for the world.');
            setUploading(false);
            setOpenError(true);
            return;
        }

        const title: HTMLInputElement = document.getElementById("title") as HTMLInputElement;
        const mature: HTMLInputElement = document.getElementById("mature") as HTMLInputElement;
        const guidelines: HTMLInputElement = document.getElementById("guidelines") as HTMLInputElement;
        const endOfChapterMessage: HTMLInputElement = document.getElementById("endOfChapterMessage") as HTMLInputElement;
        const publishStamp = published ? new Date() : undefined;
        const profitSplitMap = await checkCollaborators();
        const id = currentChapter ? currentChapter['id'] : undefined;

        const allContent = await reformatContent(false);
        const url: string = work.url + "_" + title.value.replace(/\s/g, "-").toLowerCase();
        if (title.value && !title.value.includes('/') && guidelines.checked && profitSplitMap && (cover.name || (chapter && chapter.cover)) && allContent.length > 0) {
            let newEpisode: Episode = {
                id: id,
                work: work,
                title: title.value,
                cover: cover.name ? cover.name : chapter.cover,
                content: allContent.join(CHAPTER_DELIMETER),
                url: url,
                endOfChapterMessage: endOfChapterMessage.value,
                mature: mature.checked,
                episodeNumber: -1,
                flags: 0,
                publishStamp: publishStamp,
                published: published,
            };
            console.log(chapter);
            console.log(newEpisode);

            let urlModifier = props.edit ? "update" : "add";

            setUploading(true);
            try {
                const response: number = await genericPost("/api/episode/" + urlModifier, newEpisode);
                if (response) {
                    if (cover.file) {
                        await prepareAndUpload('cover');
                    }
                    setUploading(false);
                    newEpisode.id = response;
                }
            } catch (error) {
                setErrorMessage('Your title is the same as one of your existing titles. Please choose a different title.');
                setUploading(false);
                setOpenError(true);
                return;
            }

            // Iterate through the map and create a profit split for each user
            if (chapter) {
                genericGet('/api/profitSplit/episode/' + chapter.id).then((response: ProfitSplit[]) => {
                    let newSplit: ProfitSplit;
                    let foundEntries: Set<number> = new Set();
                    let i: number;
                    profitSplitMap.forEach((value, user) => {
                        newSplit = {
                            episode: newEpisode,
                            creator: user,
                            percentage: value,
                        };
    
                        let found: boolean = false;
                        for (i = 0; i < response.length; i++) {
                            if (response[i].creator.userName === user.userName) {
                                newSplit.id = response[i].id;
                                genericPost('/api/profitSplit/update', newSplit);
                                found = true;
                                foundEntries.add(i);
                            }
                        }
    
                        if (!found) {
                            genericPost("/api/profitSplit/add", newSplit);
                        }
                    });
    
                    for (i = 0; i < response.length; i++) {
                        if (!foundEntries.has(i)) {
                            genericPost('/api/profitSplit/delete', response[i]);
                        }
                    }
                });
            } else {
                profitSplitMap.forEach((value, user) => {
                    let newSplit: ProfitSplit = {
                        episode: newEpisode,
                        creator: user,
                        percentage: value,
                    };
                    genericPost("/api/profitSplit/add", newSplit);
                });
            }

            navigate("/chapter/" + url);
        }
        setErrorMessage('Please ensure you have filled out all required fields and checked the Community Guidelines box before submitting.');
        setOpenError(true);
    }
}

export default CreateChapter;