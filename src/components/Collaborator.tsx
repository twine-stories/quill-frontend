import React, { useContext } from 'react';
import { IconButton, Grid } from '@mui/joy';
import { CollaboratorContext } from '../pages/create/Create.tsx';
import TwineInput from './TwineInput.tsx';

interface CollaboratorProps {
    defaultCreator: string;
    defaultWallet: string;
    defaultProfit: number;
    principle: boolean;
    id: number;
    profitSplit: boolean;
}

function Collaborator(props: CollaboratorProps) {

    const context: object = useContext(CollaboratorContext);
    const remove: (id: number) => void = context['remove'];

    const creatorName: string = props.principle ? 'Principle Creator' : 'Creator Username';
    const topRightField: string = props.profitSplit ? 'Profit Percentage' : 'Title';
    const bottomField: string = props.profitSplit ? (props.principle ? 'Your Wallet' : 'Collaborator\'s Wallet') : 'Responsible For';

    const offset: number = props.principle ? 2 : 0;

    return (
        <Grid className='collaborators' container justifyContent='space-around' alignItems='center'>
            <Grid container direction='row' justifyContent='space-around' alignItems='center' rowSpacing={2} xs={10}>
                <Grid xs={10 + offset}>
                    <Grid container direction='row' justifyContent='space-between' alignItems='center' columnSpacing={1}>
                        <Grid xs={6}><TwineInput placeholder={creatorName} defaultValue={props.defaultCreator} inputAttrs={{
                            className: 'topLeftCollab'
                        }} /></Grid>
                        <Grid xs={6}><TwineInput placeholder={topRightField} defaultValue={props.defaultProfit} inputAttrs={{
                            className: 'topRightCollab'
                        }} /></Grid>
                    </Grid>
                    <Grid><TwineInput placeholder={bottomField} defaultValue={props.defaultWallet} inputAttrs={{
                        className: 'bottomCollab'
                    }} /></Grid>
                </Grid>
                <Grid xs={2 - offset}>
                    {!props.principle && <IconButton sx={{ '&:hover': {
                        backgroundColor: 'black',
                    } }} variant='plain' onClick={() => {remove(props.id)}}>
                        <img
                            src='/icons/remove.svg'
                            alt=''
                        />
                    </IconButton>}
                </Grid>
            </Grid>
        </Grid>
    )

}

export default Collaborator;