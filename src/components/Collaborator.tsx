import React from 'react';
import { Input } from '@mui/joy';

interface CollaboratorProps {
    defaultCreator: string;
    defaultProfit: number;
}

function Collaborator(props: CollaboratorProps) {

    return (
        <div className='collaborators'>
            <Input placeholder='Creator Name' defaultValue={props.defaultCreator}/>
            <Input placeholder='Profit Percentage' defaultValue={props.defaultProfit}/>
        </div>
    )

}

export default Collaborator;