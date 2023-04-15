import React, {useContext, useEffect} from 'react';
import './CreateStory.css';
import useState from 'react-usestateref'
import Navbar from "../../components/Navbar.tsx";
import {UserContext} from "../../App.tsx";
import {User, Episode, Work} from '../../utils/types.ts';
import {
    Box, Option, Typography, Select, FormControl, FormLabel, Input, Grid
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
import UploadImage from '../../components/UploadImage.tsx';
import { STORY_IMGS_BUCKET } from '../../config.ts';
import { STORY_COVER_PATH, STORY_BANNER_PATH, AWS_S3_REGION } from '../../utils/constants.ts';
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY } from "../../utils/secrets.ts";
import AWS from "aws-sdk";
import {v4 as uuidv4} from 'uuid';

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

    const [cover, setCover] = useState<string>('');
    const [openCoverUpload, setOpenCoverUpload] = useState<boolean>(false);
    const [uploadCoverLoading, setUploadCoverLoading] = useState<boolean>(false);

    const [banner, setBanner] = useState<string | null>(null);
    const [openBannerUpload, setOpenBannerUpload] = useState<boolean>(false);
    const [uploadBannerLoading, setUploadBannerLoading] = useState<boolean>(false);

    const context: object = useContext(UserContext);
    const user: User = context['user'];

    const bucketName: string = STORY_IMGS_BUCKET;
    const accessKeyId: string = ACCESS_KEY_ID;
    const secretAccessKey: string = SECRET_ACCESS_KEY;
    const region: string = AWS_S3_REGION;

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

    const handleUpload = async (selectedFile: File, uploadType: string) => {
        if (uploadType !== 'cover' && uploadType !== 'banner') {
            return;
        }

        try {
            const s3 = new AWS.S3({
                accessKeyId,
                secretAccessKey,
                region,
                signatureVersion: 'v4',
            });

            let imgName = uuidv4() + "." + selectedFile.name.split('.').pop();

            const params = {
                Bucket: bucketName,
                Key: (uploadType ==='cover' ? STORY_COVER_PATH : STORY_BANNER_PATH) + imgName,
                Body: selectedFile,
            };

            if (uploadType === 'cover') {
                setUploadCoverLoading(true);
                await s3.upload(params).promise();
                if (work) {
                    setWork({
                        ...work,
                        cover: imgName
                    });
                }
                setCover(imgName);
                setUploadCoverLoading(false);
                setOpenCoverUpload(false);
            } else {
                setUploadBannerLoading(true);
                await s3.upload(params).promise();
                if (work) {
                    setWork({
                        ...work,
                        banner: imgName
                    });
                }
                setBanner(imgName);
                setUploadBannerLoading(false);
                setOpenBannerUpload(false);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file. Please try again later.");
            if (uploadType === 'cover') {
                setUploadCoverLoading(false);
                setOpenCoverUpload(false);
            } else {
                setUploadBannerLoading(false);
                setOpenBannerUpload(false);
            }
        }
    }

    return (
        <div>
            <Navbar/>
            <Typography level="h2" color='purple'>{props.edit ? "Edit Story" : "Create Story"}</Typography>
            <TwoColumnLayout leftComponent={
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        // alignItems: 'center',
                        // flexWrap: 'wrap',
                    }}
                >
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

                    <Grid container direction='column' alignItems='flex-start' justifyContent='space-around' className='create-image-upload'>
                        <Typography level="h3" color='purple'>Banner (Optional)</Typography>
                        <Grid container alignItems='center' justifyContent='center' xs={12}>
                        <Grid container alignItems='center' justifyContent='center' id='create-banner-wrapper'>
                            {((work && work.banner) || banner) ? 
                                <img
                                    src = {'https://' + STORY_IMGS_BUCKET + '.s3.amazonaws.com/' + STORY_BANNER_PATH + (work ? work.banner : banner)}
                                    alt = ""
                                    onClick = {() => setOpenBannerUpload(true)}
                                    id='create-banner'
                                />
                                :
                                <TwineButton icon='/icons/purple_plus_light.svg' name='Upload' color='darkpurple' action={() => setOpenBannerUpload(true)} />
                            }
                        </Grid>
                        </Grid>
                        <UploadImage
                            loading={uploadBannerLoading}
                            open={openBannerUpload}
                            close={() => setOpenBannerUpload(false)}
                            handleUpload={(file: File) => handleUpload(file, 'banner')}
                            circle={false}
                            width='440px'
                            height='100px'
                        />
                    </Grid>
                </Box>
            }
                             rightComponent={
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
                                    <Grid container direction='column' alignItems='flex-start' justifyContent='space-around' className='create-image-upload'>
                                        <Typography level="h3" color='purple'>Cover Art</Typography>
                                        <Grid container alignItems='center' justifyContent='center' id='create-cover-wrapper'>
                                            {((work && work.cover) || cover) ? 
                                                <img
                                                    src = {'https://' + STORY_IMGS_BUCKET + '.s3.amazonaws.com/' + STORY_COVER_PATH + (work ? work.cover : cover)}
                                                    alt = ""
                                                    onClick = {() => setOpenCoverUpload(true)}
                                                    id='create-cover'
                                                />
                                                :
                                                <TwineButton icon='/icons/purple_plus_light.svg' name='Upload' color='darkpurple' action={() => setOpenCoverUpload(true)} />
                                            }
                                        </Grid>
                                        <UploadImage
                                            loading={uploadCoverLoading}
                                            open={openCoverUpload}
                                            close={() => setOpenCoverUpload(false)}
                                            handleUpload={(file: File) => handleUpload(file, 'cover')}
                                            circle={false}
                                            width='160px'
                                            height='240px'
                                        />
                                    </Grid>
                                     {!props.edit &&
                                         <>
                                             <TwineButton name="Save Draft" icon="/icons/purple_checkmark.svg"
                                                          action={(e) => postStory(getStory(false))}></TwineButton>
                                             <TwineButton
                                                 name='Create Story' color="green" icon="/icons/green_plus.svg"
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
        if (title.value && description.value && hook.value && genre1.textContent && cover) {
            let newWork: Work = {
                id: id,
                creator: user,
                title: title.value,
                description: description.value,
                cover: cover,
                banner: banner,
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