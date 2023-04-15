import React from 'react';
import {FormControl, FormLabel, Input, Textarea} from "@mui/joy";

interface InputProps {
    label: string;
    placeholder?: string;
    inputAttrs?: Record<string, any>;
    defaultValue?: string;
    startDecorator?: string;
    endDecorator?: string;
    size?: string;
    id?: string;
    multiline?: boolean;
    sx?: object;
    onChange?: (elem: React.ChangeEvent<HTMLInputElement>) => void;
}

function TwineInput(props: InputProps) {
    if (props.multiline) {
        return (
            <FormControl id={props.id}>
                <FormLabel>{props.label}</FormLabel>
                <Textarea
                    startDecorator={props.startDecorator && <img src={props.startDecorator}/>}
                    endDecorator={props.endDecorator && <img src={props.endDecorator}/>}
                    placeholder={props.placeholder} defaultValue={props.defaultValue}
                    sx={props.sx}
                    onChange={props.onChange}/>
            </FormControl>
        )
    } else {
        return (
            <FormControl id={props.id}>
                <FormLabel>{props.label}</FormLabel>
                <Input
                    color='brown'
                    startDecorator={props.startDecorator && <img src={props.startDecorator}/>}
                    endDecorator={props.endDecorator && <img src={props.endDecorator}/>}
                    placeholder={props.placeholder} defaultValue={props.defaultValue}
                    sx={props.sx}
                    onChange={props.onChange}
                    slotProps={{
                        input: props.inputAttrs
                    }}/>
            </FormControl>
        )
    }
}

export default TwineInput;