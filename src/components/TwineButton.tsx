import React from 'react';
import {Button} from "@mui/joy";

interface ButtonProps {
    action: () => Promise<void>;
    name: string;
    enabled?: boolean;
    icon?: string;
    color?: string;
}

function TwineButton(props: ButtonProps) {
    const color: string = props.color ? props.color : 'info';
    return (
        props.enabled === undefined || props.enabled ?
            <Button color={color} startDecorator={props.icon && <img src={props.icon} />} onClick={props.action}>{props.name}</Button>
            :
            <Button color={color} startDecorator={props.icon && <img src={props.icon} />} onClick={props.action} disabled>{props.name}</Button>
    )
}

export default TwineButton;