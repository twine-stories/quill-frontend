import React from 'react';
import {Box, FormControl, FormLabel, Input, Select} from "@mui/joy";

interface TwineSelectProps {
    id: string;
    label: string;
    options: JSX.Element[];
    defaultValue?: string;
}


function TwineSelect(props: TwineSelectProps) {
    return (
       <Box className="dropdown-field">
         <FormControl id={props.id}>
            <FormLabel>{props.label}</FormLabel>
            <Select defaultValue={props.defaultValue}>
                {props.options}
            </Select>
        </FormControl>
       </Box>
    )
}

export default TwineSelect;