import React from 'react';
import {Button} from "@mui/joy";

interface ButtonProps {
    action: () => Promise<void>;
    icon: string;
    enabled?: boolean;
    color?: string;
    size?: string;
    sx?: object;
}

function IconButton(props: ButtonProps) {
    const color: string = props.color ? props.color : 'purple';
    const size: string = props.size ? props.size : 'md';
    const dim: string = size === 'sm' ? '10px' : '18px';
    return (
        props.enabled === undefined || props.enabled ?
            <Button sx={props.sx} size={size} color={color} onClick={props.action}><img width={dim} height={dim} src={props.icon} /></Button>
            :
            <Button sx={props.sx} size={size} color={color} onClick={props.action} disabled><img width={dim} height={dim} src={props.icon} /></Button>
    )
}

export default IconButton;