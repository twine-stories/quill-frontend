import React, { BaseSyntheticEvent, useContext, useState } from 'react';

interface NFTCheckboxProps {
    assetId: number
    name: string;
    check: (id: number) => void;
    uncheck: (id: number) => void;
};

function NFTCheckbox(props: NFTCheckboxProps) {

    const changedStatus = (e) => {
        props.check(props.assetId);
        // console.log(e.target.checked);
        // if (e.target.checked) {
        //     props.check(props.assetId);
        // } else {
        //     props.uncheck(props.assetId);
        // }
    }

    return (
        <div>
            <input onClick={(e) => {
                props.check(props.assetId);
            }} type="checkbox" id={props.assetId.toString()} name={props.assetId.toString()}></input>
            <label>{props.name}</label>
        </div>
    );
}

export default NFTCheckbox;