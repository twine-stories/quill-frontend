import React from 'react'
interface TwoColumnLayoutProps {
    leftComponent: JSX.Element
    rightComponent: JSX.Element
    leftWidth?: string
    rightWidth?: string
    className?: string
    marginRight?: string
    id?:string
}

function TwoColumnLayout(props: TwoColumnLayoutProps) {
    let leftFlex = props.leftWidth ? '0 0 ' + props.leftWidth : '0 0 70%'
    let rightFlex = props.rightWidth ? '0 0 ' + props.rightWidth : '0 0 30%'
    return (
        <div
            className={props.className}
            id={props.id}
            style={{ display: 'flex', flexDirection: 'row', width: '100%' }}
        >
            <div
                style={{ flex: leftFlex, marginRight: '5%' }}
                className={props.className}
                id={props.id}
            >
                {props.leftComponent}
            </div>
            <div style={{ flex: rightFlex }}>{props.rightComponent}</div>
        </div>
    )
}

export default TwoColumnLayout
