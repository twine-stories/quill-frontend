import React, { useState, useEffect, useContext } from 'react'
import './CreateArtwork.css'
import { UserContext } from '../../App.tsx'
import Navbar from '../../components/Navbar.tsx'
import { Typography, Grid } from '@mui/joy'
import { CollaboratorContext } from './Create.tsx'
import { v4 as uuidv4 } from 'uuid'
import { MAX_COLLABORATORS_SMART_CONTRACTS } from '../../utils/constants.ts'
import Collaborator from '../../components/Collaborator.tsx'
import TwineButton from '../../components/TwineButton.tsx'
import { User } from '../../utils/types.ts'

function CreateCollection() {

    const context: object = useContext(UserContext)
    const user: User = context['user'];
    const [collaborators, setCollaborators] = useState<JSX.Element[]>([]);

    const removeCollaborator = (id: number): void => {
        // let newCollaborators: JSX.Element[] = []
        // collaborators.forEach((collaborator: JSX.Element) => {
        //     if (collaborator.props.id !== id) {
        //         newCollaborators.push(collaborator)
        //     }
        // })

        // setCollaborators(newCollaborators)
    }
    
    return (
        <div>
            <Navbar />
            <Grid>
                <Typography
                    level="h2"
                    color="purple"
                    sx={{ paddingLeft: '16px' }}
                >
                    Publish Art Collection
                </Typography>
                <Grid>
                    <Typography level='h3' color='green' sx={{fontSize: "18px"}}>Profit Split</Typography>
                    <CollaboratorContext.Provider
                        value={{
                            remove: removeCollaborator,
                        }}
                    >
                        <Grid
                            container
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            xs={12}
                        >
                            {collaborators}
                            <TwineButton
                                name="Add Collaborator"
                                enabled={
                                    collaborators.length <
                                    MAX_COLLABORATORS_SMART_CONTRACTS
                                }
                                sx={{ marginTop: '20px' }}
                                action={() => {
                                    if (
                                        collaborators.length <
                                        MAX_COLLABORATORS_SMART_CONTRACTS
                                    ) {
                                        const id: number = uuidv4()
                                        setCollaborators([
                                            ...collaborators,
                                            <Collaborator
                                                profitSplit={true}
                                                principle={false}
                                                id={id}
                                                key={id}
                                            />,
                                        ])
                                    }
                                }}
                            />
                        </Grid>
                    </CollaboratorContext.Provider>
                </Grid>
            </Grid>
        </div>
    )
}

export default CreateCollection
