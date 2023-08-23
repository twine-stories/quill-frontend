import React from 'react'
import { Button } from '@mui/joy'

interface ButtonProps {
    action: () => Promise<void>
    icon: string
    enabled?: boolean
    color?: string
    size?: string
    sx?: object
    buttonClassName?: string
    className?: string
    backgroundColor?: string,
    customSize?: string
}

function IconButton(props: ButtonProps) {
    const color: string = props.color ? props.color : 'purple'
    const size: string = props.size ? props.size : 'md'
    const dim: string = props?.customSize || (size === 'sm' ? '10px' : '18px')

    const sx = {
        borderRadius: '50%',
        height: '40px',
        width: '40px',
        ...props.sx,
    }
    return props.enabled === undefined || props.enabled ? (
        <Button
            sx={sx}
            size={size}
            className={props.className}
            className={props.buttonClassName}
            backgroundColor={props.backgroundColor}
            color={color}
            onClick={props.action}
        >
            <img
                width={dim}
                height={dim}
                src={props.icon}
                style={{ position: 'absolute' }}
            />
        </Button>
    ) : (
        <Button
            sx={sx}
            size={size}
            className={props.className}
            className={props.buttonClassName}
            backgroundColor={props.backgroundColor}
            color={color}
            onClick={props.action}
            disabled
        >
            <img
                width={dim}
                height={dim}
                src={props.icon}
                style={{ position: 'absolute' }}
            />
        </Button>
    )
}

export default IconButton
