import React, {useState, useContext, useEffect} from 'react';
import {UserContext} from "../App.tsx";
import { Box, Button, FormControl, FormLabel, Textarea, IconButton, Menu, MenuItem, ListItemDecorator, Typography} from "@mui/joy";
import { User, Comment } from '../utils/types.ts';
import { genericPost, genericGet } from '../utils/api.ts';
import { PROFILE_IMGS_BUCKET } from '../config.ts';
import TwineButton from './TwineButton.tsx';


export default function CommentSection({episode}) {

    const context: object = useContext(UserContext);
    const user: User = context['user'];

    const [comments, setComments] = useState<Comment[]>([]);


    const  onComment = async () => {
        console.log('comment');

        if (user && episode) {
            const data: string = document.getElementsByClassName("commentBox")[0].getElementsByTagName("textarea")[0].value;


            const comment: Comment = {
                commenter: user,
                episode: episode,
                content: data
            }

            const response = await genericPost('/api/comment/comment', comment);
            
            genericGet('/api/comment/comments/' + episode.id).then((response: any) => {
                setComments(response);
            });

        }
        
    }

    useEffect(() => {
        if (episode) {
            genericGet('/api/comment/comments/' + episode.id).then((response: any) => {
                setComments(response);
            });
        }
    }, [episode]);
    
    return (
        <div>
            <Typography level="h2" sx={{color: "#9e9feb"}}>Comments</Typography>
            <FormControl>
                <Textarea
                    className="commentBox"
                    placeholder="Type something here…"
                    minRows={3}
                    endDecorator={
                    <Box
                        sx={{
                        display: 'flex',
                        gap: 'var(--Textarea-paddingBlock)',
                        pt: 'var(--Textarea-paddingBlock)',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        flex: 'auto',
                        }}
                    >

                        <TwineButton name="send" action={onComment} sx={{ ml: 'auto' }} />
                        
                    </Box>
                    }
                    sx={{
                    minWidth: 300,
                    }}
                />
            </FormControl>
            <div className='comments'>
                {comments.map((comment) => (
                    <div className='comment' style={{display: "flex", alignItems: "center", marginBottom: "1rem"}}>
                        <div>
                            <img 
                            src={'https://' + PROFILE_IMGS_BUCKET + '.s3.amazonaws.com/' + comment.commenter.profileImg} 
                            onError={e => {
                                e.currentTarget.src = 'https://'+PROFILE_IMGS_BUCKET+'.s3.amazonaws.com/default.jpeg'
                            }}
                            width={64}
                            height={64}
                            style={{borderRadius: "50%", objectFit: "cover"}}
                            className='profileImg' 
                            />
                        </div>
                        <div className='name-comment' style={{marginLeft: "1rem"}}>
                            <Typography level="h5" sx={{color: "#9e9feb"}}>{comment.commenter.userName}</Typography>
                            <Typography level="h6" sx={{color: "#FFFFFF"}}>{comment.content}</Typography>
                        </div>
                        
                    </div>
                ))}
            </div>

        </div>
    )
}