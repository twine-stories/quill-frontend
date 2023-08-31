import React, { useState, useContext } from 'react'
import './FirstLogin.css'
import { UserContext } from '../App.tsx'
import TwineButton from './TwineButton.tsx'
import TwineInput from './TwineInput.tsx'
import ErrorPopup from './ErrorPopup.tsx'
import { Modal, Sheet, Typography, Grid, Checkbox } from '@mui/joy'
import { genericGet } from '../utils/api.ts'

function FirstLogin() {
    const [canSubmit, setCanSubmit] = useState<boolean>(false)
    const [openUserTaken, setOpenUserTaken] = useState<boolean>(false)
    const [openIncomplete, setOpenIncomplete] = useState<boolean>(false)

    const context: object = useContext(UserContext)
    const sendRequest = context['addUser']
    const open = context['openLogin']
    const close = context['closeLogin']

    const tosChange = (e) => {
        setCanSubmit(e.target.checked)
    }

    return (
        <Modal open={open} onClose={close}>
            <Sheet
                variant="outlined"
                sx={{
                    maxWidth: '600px',
                    width: '50vw',
                    borderRadius: 'md',
                    p: 3,
                    boxShadow: 'lg',
                }}
            >
                <ErrorPopup
                    isOpen={openUserTaken}
                    onClose={() => setOpenUserTaken(false)}
                    message="Username is taken!"
                />
                <ErrorPopup
                    isOpen={openIncomplete}
                    onClose={() => setOpenIncomplete(false)}
                    message="Please fill out all fields!"
                />
                <Typography level="h2" color="green">
                    Create an Account
                </Typography>
                <Grid sx={{ marginLeft: '30px', marginBottom: '30px' }}>
                    <TwineInput
                        label="first name"
                        placeholder="Enter first name..."
                        inputAttrs={{ id: 'firstNameInput' }}
                    />
                    <TwineInput
                        label="last name"
                        placeholder="Enter last name..."
                        inputAttrs={{ id: 'lastNameInput' }}
                    />
                    <TwineInput
                        label="username"
                        placeholder="Enter username..."
                        inputAttrs={{ id: 'usernameInput' }}
                    />
                </Grid>
                <Grid
                    container
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Grid
                        container
                        alignItems="center"
                        justifyContent="space-around"
                        flexWrap="nowrap"
                    >
                        <Checkbox
                            color="green"
                            onChange={tosChange}
                            sx={{ marginRight: '10px', marginBottom: '2px' }}
                            size="sm"
                            label=""
                            slotProps={{
                                input: {
                                    id: 'tos',
                                    'aria-label': 'primary checkbox',
                                },
                            }}
                        />
                        <Typography fontSize={'14px'} level="h6" color="white">
                            By checking this box, I verify that I have read and
                            agree to the{' '}
                            <a id="login-tos" href="/terms" target="_blank">
                                terms of use
                            </a>
                            .
                        </Typography>
                    </Grid>
                    <TwineButton
                        enabled={canSubmit}
                        color="green"
                        action={(e) => {
                            if (
                                !(
                                    document.getElementById(
                                        'tos'
                                    ) as HTMLInputElement
                                ).checked
                            ) {
                                return
                            }

                            const first = document.getElementById(
                                'firstNameInput'
                            ) as HTMLInputElement
                            const last = document.getElementById(
                                'lastNameInput'
                            ) as HTMLInputElement
                            const username = document.getElementById(
                                'usernameInput'
                            ) as HTMLInputElement
                            if (
                                first &&
                                last &&
                                username &&
                                first.value.length > 0 &&
                                last.value.length > 0 &&
                                username.value.length > 0 &&
                                !username.value.includes('/')
                            ) {
                                genericGet(
                                    '/api/user/taken/' + username.value
                                ).then((response) => {
                                    if (!response) {
                                        sendRequest(
                                            context['address'],
                                            first.value,
                                            last.value,
                                            username.value
                                        )
                                    } else {
                                        setOpenUserTaken(true)
                                    }
                                })
                            } else {
                                setOpenIncomplete(true)
                            }
                        }}
                        name="Create Account"
                    />
                </Grid>
            </Sheet>
        </Modal>
    )
}

export default FirstLogin
