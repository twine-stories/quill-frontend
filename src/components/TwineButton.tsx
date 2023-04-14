import React from 'react';
import {Button} from "@mui/joy";

interface ButtonProps {
    action: () => Promise<void>;
    name: string;
    enabled?: boolean;
    icon?: string;
    color?: string;
    size?: string;
    sx: object;
}

function TwineButton(props: ButtonProps) {
    const color: string = props.color ? props.color : 'purple';
    const size: string = props.size ? props.size : 'md';
    console.log(!(props.enabled === undefined || props.enabled));
    return (
        <Button
            sx={props.sx}
            size={size}
            color={color}
            startDecorator={props.icon && <img width="18px" height="18px" src={props.icon} />}
            onClick={props.action}
            disabled={!(props.enabled === undefined || props.enabled)}
        >
            {props.name}
        </Button>
    )
}

export default TwineButton;