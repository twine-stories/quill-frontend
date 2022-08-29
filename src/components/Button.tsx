import React from 'react';

interface ButtonProps {
    onClick: () => Promise<void>;
    name: string;
}

function Button(props: ButtonProps) {
    return (
        <button onClick={props.onClick}>{props.name}</button>
    )
}

export default Button;