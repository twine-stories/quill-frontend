import React, {useContext, useEffect} from 'react';
import useState from 'react-usestateref'
import Navbar from "../../components/Navbar.tsx";
import {UserContext} from "../../App.tsx";
import {User, Episode, Work} from '../../utils/types.ts';
import {
    Box, Option, Typography, Select, FormControl, FormLabel, Input
} from "@mui/joy";
import {useImmer} from "use-immer";
import {enableMapSet} from "immer";
import TwoColumnLayout from "../../components/TwoColumnLayout.tsx";
import TwineButton from "../../components/TwineButton.tsx";
import {genericPost, workAdd, workGetByUrl} from "../../utils/api.ts";
import {Genre} from "../../utils/enums.ts";
import TwineInput from "../../components/TwineInput.tsx";
import Collaborator from "../../components/Collaborator.tsx";
import TwineSelect from "../../components/TwineSelect.tsx";
import {useNavigate} from "react-router-dom";

enableMapSet();

interface CreateStoryProps {
    edit?: boolean;
}

function CreateStory(props: CreateStoryProps) {

    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    }
    const [work, setWork] = useState<Work>(null);
    const context: object = useContext(UserContext);
    const user: User = context['user'];

    useEffect(() => {
        if (user && props.edit) {
            workGetByUrl(window.location.href.split('/')[5], setWork, () => {
                console.log('fail');
            });
        }
    }, [props.edit, user]);

    const genreOptions: JSX.Element[] = [];
    const genres: object = Object.keys(Genre);
    for (let i in Object.values(Genre)) {
        let val: string = genres[i];
        genreOptions.push(<Option key={val.toLowerCase()} value={val.toLowerCase()}>{val.toLowerCase()}</Option>);
    }

    return (
        <div>
            <Navbar/>
            <TwoColumnLayout leftComponent={
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        // alignItems: 'center',
                        // flexWrap: 'wrap',
                    }}
                >
                    <Typography level="h2" color='purple'>{props.edit ? "Edit Story" : "Create Story"}</Typography>
                    {(!props.edit || work) &&
                        <TwineInput defaultValue={(props.edit) ? work['title'] : ""} id='title' label='Title'
                                    placeholder='Enter Title...'/>}
                    {(!props.edit || work) &&
                        <TwineInput defaultValue={(work && props.edit) ? work['description'] : ""} id='description'
                                    label='Description' placeholder='Enter Description...' multiline={true}/>}
                    {(!props.edit || work) &&
                        <TwineInput defaultValue={(work && props.edit) ? work['hook'] : ""} id='hook' label='Hook'
                                    placeholder='Enter Hook...' multiline={true}/>}
                    {(!props.edit || work) && <TwineSelect id="genre1" label="Genre" options={genreOptions}
                                                           defaultValue={(props.edit) ? work['genre1'].toLowerCase() : ""}/>}
                    {(!props.edit || work) && <TwineSelect id="genre2" label="Genre 2 (optional)" options={genreOptions}
                                                           defaultValue={(props.edit) ? work['genre2'].toLowerCase() : "none"}/>}
                    {(!props.edit || work) && <TwineSelect id="genre3" label="Genre 3 (optional)" options={genreOptions}
                                                           defaultValue={(props.edit) ? work['genre3'].toLowerCase() : "none"}/>}
                </Box>
            }
                             rightComponent={
                                 <Box
                                     sx={{
                                         py: 2,
                                         display: 'flex',
                                         flexDirection: 'column',
                                         gap: 1,
                                         alignItems: 'center',
                                         flexWrap: 'wrap',
                                     }}
                                 >
                                     {!props.edit &&
                                         <>
                                             <TwineButton name="Save Draft" icon="/icons/purple_checkmark.svg"
                                                          action={(e) => postStory(getStory(false))}></TwineButton>
                                             <TwineButton
                                                 name='Publish Story' color="green" icon="/icons/green_plus.svg"
                                                 action={(e) => postStory(getStory(true))}/>
                                         </>
                                     }
                                     {props.edit &&
                                         <>
                                             {returnTransferButton()}
                                             <TwineButton
                                                 name='Save Story' color="green" icon="/icons/green_checkmark.svg"
                                                 action={(e) => postStory(getStory(true, work))}/>
                                             <TwineButton
                                                 name='Cancel Edit Story' color="blackgreen" icon="/icons/green_x.svg"
                                                 action={(e) => goBack()}/>
                                         </>
                                     }
                                 </Box>
                             }
            />
        </div>

    );

    function returnTransferButton() {
        if (work && work['publishStamp']) {
            return <TwineButton name="Transfer to Draft" icon="/icons/purple_paper.svg"
                                action={(e) => postStory(getStory(false, work))}></TwineButton>
        } else {
            return <TwineButton name="Transfer to Published" icon="/icons/purple_paper.svg"
                                action={(e) => postStory(getStory(true, work))}></TwineButton>
        }
    }

    function getStory(published: boolean, currentWork?: Work): Work {
        const title: HTMLInputElement = document.getElementById("title") as HTMLInputElement;
        const description: HTMLInputElement = document.getElementById('description') as HTMLInputElement;
        const hook: HTMLInputElement = document.getElementById('hook') as HTMLInputElement;
        const genre1: HTMLInputElement = document.getElementById('genre1') as HTMLInputElement;
        const genre2: HTMLInputElement = document.getElementById('genre2') as HTMLInputElement;
        const genre3: HTMLInputElement = document.getElementById('genre3') as HTMLInputElement;
        const publishStamp = published ? new Date() : null;
        const id = currentWork ? currentWork['id'] : null;
        console.log("help")
        console.log(published)
        if (title.value && description.value && hook.value && genre1.textContent) {
            let newWork: Work = {
                id: id,
                creator: user,
                title: title.value,
                description: description.value,
                cover: 'cover',
                banner: 'banner',
                genre1: genre1.textContent.toUpperCase(),
                genre2: genre2.textContent.toUpperCase(),
                genre3: genre3.textContent.toUpperCase(),
                medium: "WRITTEN",
                url: user.userName + '-' + title.value.replace(/\s/g, "-").toLowerCase(),
                hook: hook.value,
                publishStamp: publishStamp,
                published: published,
            }

            console.log(newWork)

            return newWork;
        }
        return null;
    }

    function postStory(work: Work) {
        if (work) {
            let urlModifier = props.edit ? "update" : "add";
            genericPost("/api/work/" + urlModifier, work).then((response) => {
                if (response) {
                    navigate("/story/" + work.url);
                } else {
                    console.log("Your title is the same as one of your existing titles. Please choose a different title.");
                }
            });
        }
    }
}

export default CreateStory;