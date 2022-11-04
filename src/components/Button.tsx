import React from 'react';

interface ButtonProps {
    action: () => Promise<void>;
    name: string;
}

function Button(props: ButtonProps) {
    return (
        <button onClick={props.action}>{props.name}</button>
    )
}

export default Button;