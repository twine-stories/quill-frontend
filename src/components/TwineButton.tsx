import React from 'react';
import {Button} from "@mui/joy";

interface ButtonProps {
    action: () => Promise<void>;
    name: string;
    enabled?: boolean;
    icon?: string;
    color?: string;
    size?: string;
}

function TwineButton(props: ButtonProps) {
    const color: string = props.color ? props.color : 'light';
    const size: string = props.size ? props.size : 'md';
    return (
        props.enabled === undefined || props.enabled ?
            <Button size={size} color={color} startDecorator={props.icon && <img width="20px" height="20px" src={props.icon} />} onClick={props.action}>{props.name}</Button>
            :
            <Button size={size} color={color} startDecorator={props.icon && <img src={props.icon} />} onClick={props.action} disabled>{props.name}</Button>
    )
}

export default TwineButton;