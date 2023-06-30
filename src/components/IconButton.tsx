import React from 'react';
import {Button} from "@mui/joy";

interface ButtonProps {
    action: () => Promise<void>;
    icon: string;
    enabled?: boolean;
    color?: string;
    size?: string;
    sx?: object;
    backgroundColor?: string;
    
}

function IconButton(props: ButtonProps) {
    const color: string = props.color ? props.color : 'purple';
    const size: string = props.size ? props.size : 'md';
    const dim: string = size === 'sm' ? '10px' : '18px';
    const sx = {
        borderRadius: '50%',
        height: '40px',
        width: '40px',
        backgroundColor: props.backgroundColor,
        ...props.sx
    }
    return (
        props.enabled === undefined || props.enabled ?
            <Button sx={sx} size={size} color={color} onClick={props.action}><img width={dim} height={dim} src={props.icon} style={{position: 'absolute',color:"#A3B832"}} /></Button>
            :
            <Button sx={sx} size={size} color={color} onClick={props.action} disabled><img width={dim} height={dim} src={props.icon} style={{position: 'absolute',color:'#A3B832'}} /></Button>
    )
}

export default IconButton;