import {createGlobalStyle} from 'styled-components';
import styles from './globalStyles.css';
import {extendTheme} from "@mui/joy";
import { fontWeight } from '@mui/system';

const GlobalStyle = createGlobalStyle `${styles.toString()}`;

declare module '@mui/joy/Typography' {
    interface TypographyPropsColorOverrides {
        green: true;
        purple: true;
    }
}

declare module '@mui/joy/Button' {
    interface ButtonPropsColorOverrides {
        green: true;
        purple: true;
        darkpurple: true;
        blackgreen: true;
        blackpurple: true;
    }
}

declare module '@mui/joy/Input' {
    interface InputPropsColorOverrides {
        brown: true;
    }
}

declare module '@mui/joy/Sheet' {
    interface SheetPropsColorOverrides {
        green_dashed: true;
    }

    interface SheetPropsVariantOverrides {
        rounded: true;
    }
}

export const theme = extendTheme({
    components: {
        JoyTypography: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    ...((ownerState.color === 'green') && {
                        color: '#A5BB2D'
                    }),
                    ...((ownerState.color === 'purple') && {
                        color: '#9E9FEB'
                    }),
                    ...((ownerState.level === 'h1' || ownerState.level === 'h2') && {
                        fontFamily: 'Twine',
                        fontWeight: 'normal',
                        margin: '20px 10px',
                        
                    }),
                    ...((ownerState.level === 'h3' || ownerState.level === 'h4' || ownerState.level === 'h5' || ownerState.level === 'h6') && {
                        fontFamily: 'Oxanium',
                        fontWeight: 'normal',
                        margin: '10px 20px',
                    }),
                })
            }
        },
        JoyButton: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    ...({
                        fontFamily: 'Oxanium',
                        margin: '5px',
                        '&:hover': {
                            cursor: 'pointer'
                        }
                    }),
                    ...(ownerState.color === 'blackgreen' && {
                        color: '#A3B832',
                        backgroundColor: '#14100E',
                    }),
                    ...(ownerState.color === 'blackpurple' && {
                        color: '#9E9FEB',
                        backgroundColor: '#14100E',
                    }),
                    ...(ownerState.color === 'green' && {
                        color: '#5C720D',
                        backgroundColor: '#A3B832',
                    }),
                    ...(ownerState.color === 'green' && ownerState.disabled === true && {
                        color: '#404626',
                        backgroundColor: '#A3B83280',
                    }),
                    ...(ownerState.color === 'purple' && {
                        color: '#373867',
                        backgroundColor: '#9E9FEB',
                    }),
                    ...(ownerState.color === 'purple' && ownerState.disabled === true && {
                        color: '#7A7BAF',
                        backgroundColor: '#9E9FEB80',
                    }),
                    ...(ownerState.color === 'darkpurple' && {
                        color: '#9E9FEB',
                        backgroundColor: '#4546AB',
                    }),
                    ...(ownerState.color === 'darkpurple' && ownerState.disabled === true && {
                        color: '#4546AB',
                        backgroundColor: '#23232E',
                    }),
                }),
            },
        },
        JoyInput: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    ...({
                        fontFamily: 'Oxanium'
                    }),
                    ...(ownerState.color === 'brown' && {
                        border: '0.5px #241D19 solid',
                        color: '#E4E5FF'
                    })
                }),
            },
        },
        JoyFormLabel: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    ...({
                        fontFamily: 'Oxanium',
                        color: '#E4E5FF'
                    }),
                }),
            },
        },
        JoySheet: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    ...(ownerState.color === 'green_dashed' && {
                        border: '1px #A3B832 dashed',
                        padding: '0px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }),
                    ...(ownerState.variant === 'rounded' && {
                        borderRadius: '10px',
                    }),
                }),
            },
        },
        JoyTextarea: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    ...({
                        fontFamily: 'Oxanium',
                        color: '#E4E5FF'
                    }),
                }),
            },
        },
    },
});

export default GlobalStyle;