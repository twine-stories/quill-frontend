import React from 'react';
import {FormControl, FormLabel, Input} from "@mui/joy";

interface InputProps {
    action: () => Promise<void>;
    label: string;
    placeholder?: string;
    inputAttrs?: Record<string, any>;
    defaultValue?: string;
    startDecorator?: string;
    endDecorator?: string;
    size?: string;
    id?: string;
}

function TwineInput(props: InputProps) {
    return (
        <FormControl id={props.id}>
            <FormLabel>{props.label}</FormLabel>
            <Input
                color='brown'
                startDecorator={props.startDecorator && <img src={props.startDecorator}/>}
                endDecorator={props.endDecorator && <img src={props.endDecorator}/>}
                placeholder={props.placeholder} defaultValue={props.defaultValue}
                slotProps={{
                    input: props.inputAttrs
                }}/>
        </FormControl>
    )
}

export default TwineInput;