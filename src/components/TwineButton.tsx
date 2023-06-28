import React from 'react';
import {Button} from "@mui/joy";

interface ButtonProps {
    action: () => Promise<void>;
    name: string | JSX.Element;
    enabled?: boolean;
    icon?: string;
    color?: string;
    size?: string;
    sx?: object;
}

function TwineButton(props: ButtonProps) {
    const color: string = props.color ? props.color : 'purple';
    const size: string = props.size ? props.size : 'md';
    
    return (
        <Button
            sx={props.sx}
            size={size}
            color={color}
            startDecorator={props.icon && <img width="18px" height="18px" src={props.icon} />}
            onClick={props.action}
            disabled={!(props.enabled === undefined || props.enabled)}
        >
            <span style={{paddingTop:"10px"}}>{props.name}</span>
        </Button>
    )
}

export default TwineButton;