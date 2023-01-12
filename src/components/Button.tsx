import React from 'react';

interface ButtonProps {
    action: () => Promise<void>;
    name: string;
    enabled?: boolean;
}

function Button(props: ButtonProps) {
    return (
        props.enabled === undefined || props.enabled ?
            <button onClick={props.action}>{props.name}</button>
            :
            <button onClick={props.action} disabled>{props.name}</button>
    )
}

export default Button;