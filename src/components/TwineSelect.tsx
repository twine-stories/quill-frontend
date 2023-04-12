import React from 'react';
import {FormControl, FormLabel, Input, Select} from "@mui/joy";

interface TwineSelectProps {
    id: string;
    label: string;
    options: JSX.Element[];
    defaultValue?: string;
}

function TwineSelect(props: TwineSelectProps) {
    return (
        <FormControl id={props.id}>
            <FormLabel>{props.label}</FormLabel>
            <Select defaultValue={props.defaultValue}>
                {props.options}
            </Select>
        </FormControl>
    )
}

export default TwineSelect;