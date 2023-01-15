import React, { BaseSyntheticEvent, useContext, useState } from 'react';

interface NFTCheckboxProps {
    assetId: number
    name: string;
    cname: string;
};

function NFTCheckbox(props: NFTCheckboxProps) {

    return (
        <div>
            <input className={props.cname} type="checkbox" id={props.assetId.toString()} name={props.assetId.toString()}></input>
            <label>{props.name}</label>
        </div>
    );
}

export default NFTCheckbox;