import React, {useContext} from 'react';
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
import {workAdd} from "../../utils/api.ts";
import {Genre} from "../../utils/enums.ts";
import TwineInput from "../../components/TwineInput.tsx";
import Collaborator from "../../components/Collaborator.tsx";
import TwineSelect from "../../components/TwineSelect.tsx";

enableMapSet();

function CreateStory() {

    const [episode, setEpisode] = useState<Episode>();

    const context: object = useContext(UserContext);
    const user: User = context['user'];

    const [inputList, setInputList, inputListRef] = useState<JSX.Element[]>([]);
    const [resultMap, setResultMap] = useImmer(new Map());
    const [counter, setCounter] = useState(0);
    const [view, setView] = useState(false);

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
                    <Typography level="h2" color='purple'>Create Story</Typography>
                    <TwineInput id='title' label='Title' placeholder='Enter Title...'/>
                    <TwineInput id='description' label='Description' placeholder='Enter Description...' multiline={true}/>
                    <TwineInput id='hook' label='Hook' placeholder='Enter Hook...' multiline={true}/>
                    <TwineSelect id="genre1" label="Genre" options={genreOptions}/>
                    <TwineSelect id="genre2" label="Genre 2 (optional)" options={genreOptions} defaultValue="none"/>
                    <TwineSelect id="genre3" label="Genre 3 (optional)" options={genreOptions} defaultValue="none"/>
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
                                     <TwineButton name="Save Draft" icon="/icons/purple_checkmark.svg"
                                                  action={(e) => makeStory(false)}></TwineButton>
                                     <TwineButton name='Publish Story' color="green" icon="/icons/green_plus.svg"
                                                  action={(e) => makeStory(true)}/>
                                 </Box>
                             }
            />
        </div>

    );

    function makeStory(published: boolean) {
        const title: HTMLInputElement = document.getElementById("title") as HTMLInputElement;
        const description: HTMLInputElement = document.getElementById('description') as HTMLInputElement;
        const hook: HTMLInputElement = document.getElementById('hook') as HTMLInputElement;
        const genre1: HTMLInputElement = document.getElementById('genre1') as HTMLInputElement;
        const genre2: HTMLInputElement = document.getElementById('genre2') as HTMLInputElement;
        const genre3: HTMLInputElement = document.getElementById('genre3') as HTMLInputElement;
        const publishStamp = published ? new Date() : null;
        if (title.value && description.value && hook.value && genre1.textContent) {
            let newWork: Work = {
                creator: user,
                title: title.value,
                description: description.value,
                cover: 'cover',
                banner: 'banner',
                genre1: genre1.textContent.toUpperCase(),
                genre2: genre2.textContent.toUpperCase(),
                genre3: genre3.textContent.toUpperCase(),
                medium: "WRITTEN",
                url: user.displayName + '-' + title.value.replace(/\s/g, "-").toLowerCase(),
                hook: hook.value,
                publishStamp: publishStamp,
            };

            workAdd(newWork, (work) => {
                console.log("Your title is the same as one of your existing titles. Please choose a different title.");
            });
        }
    }
}

export default CreateStory;