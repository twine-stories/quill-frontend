import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../App.tsx'
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Textarea,
    IconButton,
    Menu,
    MenuItem,
    ListItemDecorator,
    Typography,
} from '@mui/joy'
import { User, Comment } from '../utils/types.ts'
import { genericPost, genericGet } from '../utils/api.ts'
import { PROFILE_IMGS_BUCKET } from '../config.ts'
import TwineButton from './TwineButton.tsx'
import ErrorPopup from './ErrorPopup.tsx'

export default function CommentSection({ episode }) {
    const context: object = useContext(UserContext)
    const user: User = context['user']

    const [comments, setComments] = useState<Comment[]>([])
    const [openError, setOpenError] = useState<boolean>(false)

    const onComment = async () => {
        if (user && episode) {
            const data: string = document
                .getElementsByClassName('commentBox')[0]
                .getElementsByTagName('textarea')[0].value

            const comment: Comment = {
                commenter: user,
                episode: episode,
                content: data,
            }

            const response = await genericPost('/api/comment/comment', comment)

            genericGet('/api/comment/comments/' + episode.id).then(
                (response: any) => {
                    setComments(response)
                }
            )
        } else {
            setOpenError(true)
        }
    }

    const secondsIn = {
        year: 31_536_000,
        month: 2_628_000,
        week: 604_800,
        day: 86_400,
        hour: 3_600,
        minute: 60,
    }

    useEffect(() => {
        if (episode) {
            genericGet('/api/comment/comments/' + episode.id).then(
                (response: any) => {
                    setComments(response)
                }
            )
        }
    }, [episode])

    const getCommentTimeString = (date: string) => {
        const secondsSinceComment =
            (new Date().getTime() - new Date(date).getTime()) / 1_000

        if (secondsSinceComment < secondsIn.minute) {
            return Math.floor(secondsSinceComment) + ' seconds ago'
        } else if (secondsSinceComment < secondsIn.hour) {
            return (
                Math.floor(secondsSinceComment / secondsIn.minute) +
                ' minutes ago'
            )
        } else if (secondsSinceComment < secondsIn.day) {
            return (
                Math.floor(secondsSinceComment / secondsIn.hour) + ' hours ago'
            )
        } else if (secondsSinceComment < secondsIn.week) {
            return Math.floor(secondsSinceComment / secondsIn.day) + ' days ago'
        } else if (secondsSinceComment < secondsIn.month) {
            return (
                Math.floor(secondsSinceComment / secondsIn.week) + ' weeks ago'
            )
        } else if (secondsSinceComment < secondsIn.year) {
            return (
                Math.floor(secondsSinceComment / secondsIn.month) +
                ' months ago'
            )
        } else {
            return (
                Math.floor(secondsSinceComment / secondsIn.year) + ' years ago'
            )
        }
    }

    return (
        <div>
            <Typography level="h2" sx={{ color: '#9e9feb' }}>
                Comments
            </Typography>
            <FormControl>
                <Textarea
                    className="commentBox"
                    placeholder="Type something here…"
                    minRows={1}
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
                            <TwineButton
                                name="send"
                                action={onComment}
                                sx={{ ml: 'auto' }}
                            />
                        </Box>
                    }
                    sx={{
                        minWidth: 300,
                        marginBottom: '15px',
                    }}
                />
            </FormControl>
            <div className="comments">
                {comments.map((comment, index) => (
                    <div
                        key={index}
                        className="comment"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '1rem',
                        }}
                    >
                        <div>
                            <img
                                src={
                                    'https://' +
                                    PROFILE_IMGS_BUCKET +
                                    '.s3.amazonaws.com/' +
                                    comment.commenter.profileImg
                                }
                                onError={(e) => {
                                    e.currentTarget.src =
                                        'https://' +
                                        PROFILE_IMGS_BUCKET +
                                        '.s3.amazonaws.com/default.jpeg'
                                }}
                                width={64}
                                height={64}
                                style={{
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                }}
                                className="profileImg"
                            />
                        </div>
                        <div
                            className="name-comment"
                            style={{ marginLeft: '1rem' }}
                        >
                            <Typography
                                level="h3"
                                sx={{ marginBottom: '6px' }}
                                color="purple"
                            >
                                {comment.commenter.userName}
                            </Typography>
                            <Typography
                                level="h6"
                                sx={{ marginBottom: '6px', marginTop: '0px' }}
                                color="white"
                            >
                                {comment.content}
                            </Typography>
                            <Typography
                                level="h6"
                                sx={{ fontSize: '14px', marginTop: '0px' }}
                                color="purple"
                            >
                                {comment.publishStamp &&
                                    getCommentTimeString(comment.publishStamp)}
                            </Typography>
                        </div>
                    </div>
                ))}
            </div>
            <ErrorPopup
                isOpen={openError}
                onClose={() => setOpenError(false)}
                message="Please log in to comment."
            />
        </div>
    )
}
