import React from 'react';
import {Button} from "@mui/joy";

interface ButtonProps {
    action: () => Promise<void>;
    name: string;
    enabled?: boolean;
}

function TwineButton(props: ButtonProps) {
    return (
        props.enabled === undefined || props.enabled ?
            <Button color="info" onClick={props.action}>{props.name}</Button>
            :
            <Button color="info" onClick={props.action} disabled>{props.name}</Button>
    )
}

export default TwineButton;