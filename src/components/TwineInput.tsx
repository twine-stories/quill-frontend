import React from 'react';
import {Input} from "@mui/joy";

interface InputProps {
    action: () => Promise<void>;
    placeholder: string;
    inputAttrs: Record<string, any>;
    defaultValue?: string;
    startDecorator?: string;
    endDecorator?: string;
    size?: string;
}

function TwineInput(props: InputProps) {
    return (
        <Input
            color='brown'
            startDecorator={props.startDecorator && <img src={props.startDecorator} />}
            endDecorator={props.endDecorator && <img src={props.endDecorator} />}
            placeholder={props.placeholder} defaultValue={props.defaultValue}
            slotProps={{
                input: props.inputAttrs
            }}
        />
    )
}

export default TwineInput;