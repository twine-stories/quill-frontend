import React, { useContext } from 'react';
import { Input, IconButton } from '@mui/joy';
import { CollaboratorContext } from '../pages/Create.tsx';

interface CollaboratorProps {
    defaultCreator: string;
    defaultWallet: string;
    defaultProfit: number;
    principle: boolean;
    id: number;
}

function Collaborator(props: CollaboratorProps) {

    const context: object = useContext(CollaboratorContext);
    const remove: (id: number) => void = context['remove'];

    const creatorName: string = props.principle ? 'Principle Creator' : 'Creator Name';
    const creatorWallet: string = props.principle ? 'Your Wallet' : 'Collaborator\'s Wallet';

    return (
        <div className='collaborators'>
            <Input placeholder={creatorName} defaultValue={props.defaultCreator}/>
            <Input placeholder='Profit Percentage' defaultValue={props.defaultProfit}/>
            <Input placeholder={creatorWallet} defaultValue={props.defaultWallet}/>
            {!props.principle && <IconButton sx={{ '&:hover': {
                backgroundColor: 'black',
            } }} variant="plain" onClick={() => {remove(props.id)}}>
                <img
                    src="icons/remove.svg"
                    alt=""
                />
            </IconButton>}
        </div>
    )

}

export default Collaborator;