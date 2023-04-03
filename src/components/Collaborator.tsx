import React, { useContext } from 'react';
import TwineButton from '../components/TwineButton.tsx';
import { Input } from '@mui/joy';
import { CollaboratorContext } from '../pages/Create.tsx';

interface CollaboratorProps {
    defaultCreator: string;
    defaultProfit: number;
    principle: boolean;
    id: number;
}

function Collaborator(props: CollaboratorProps) {

    const context: object = useContext(CollaboratorContext);
    const remove: (id: number) => void = context['remove'];

    return (
        <div className='collaborators'>
            <Input placeholder='Creator Name' defaultValue={props.defaultCreator}/>
            <Input placeholder='Profit Percentage' defaultValue={props.defaultProfit}/>
            {!props.principle && <TwineButton name='Remove' action={() => {remove(props.id)}} />}
        </div>
    )

}

export default Collaborator;