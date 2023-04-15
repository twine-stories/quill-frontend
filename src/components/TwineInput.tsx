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
    disabled?: boolean;
    type?: string;
}

function TwineInput(props: InputProps) {
    let startDecoratorVal = props.startDecorator && (props.startDecorator.includes("/") ? <img src={props.startDecorator}/> : props.startDecorator)
    let endDecoratorVal = props.endDecorator && (props.endDecorator.includes("/") ? <img src={props.endDecorator}/> : props.endDecorator)
    if (props.multiline) {
        return (
            <FormControl id={props.id}>
                <FormLabel>{props.label}</FormLabel>
                <Textarea
                    disabled={props.disabled}
                    startDecorator={props.startDecorator && startDecoratorVal}
                    endDecorator={props.endDecorator && endDecoratorVal}
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
                    type={props.type && props.type}
                    disabled={props.disabled}
                    startDecorator={props.startDecorator && startDecoratorVal}
                    endDecorator={props.endDecorator && endDecoratorVal}
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