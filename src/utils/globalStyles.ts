import {createGlobalStyle} from 'styled-components';
import styles from './globalStyles.css';
import {extendTheme} from "@mui/joy";

const GlobalStyle = createGlobalStyle `${styles.toString()}`;

declare module '@mui/joy/Typography' {
    interface TypographyPropsColorOverrides {
        green: true;
        purple: true;
        white: true;
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
        home: true;
    }

    interface SheetPropsVariantOverrides {
        rounded: true;
        purpleDashed: true;
    }
}

declare module '@mui/joy/Checkbox' {
    interface CheckboxPropsColorOverrides {
        green: true;
    }
}

declare module '@mui/joy/CircularProgress' {
    interface CircularProgressPropsColorOverrides {
        darkpurple: true;
    }
}

export const theme = extendTheme({
    components: {
        JoyTypography: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    ...((ownerState.color === 'green') && {
                        color: '#A5BB2D',
                    }),
                    ...((ownerState.color === 'purple') && {
                        color: '#9E9FEB',
                    }),
                    ...((ownerState.color === 'white') && {
                        color: '#E4E5FF',
                    }),
                    ...((ownerState.level === 'h1' || ownerState.level === 'h2' || ownerState.level === 'h3') && {
                        fontFamily: 'Twine',
                        fontWeight: 'normal',
                        margin: '15px 0px',
                        textAlign: 'left',
                        color: '#E4E5FF'
                    }),
                    ...((ownerState.level === 'h4' || ownerState.level === 'h5' || ownerState.level === 'h6') && {
                        fontFamily: 'Oxanium',
                        fontWeight: 'normal',
                        margin: '15px 0px',
                        textAlign: 'left',
                        color: '#E4E5FF'
                    }),
                    ...((ownerState.color === 'green') && {
                        color: '#A5BB2D'
                    }),
                    ...((ownerState.color === 'purple') && {
                        color: '#9E9FEB'
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
                    }),
                    ...(ownerState.color === 'blackgreen' && {
                        color: '#A3B832',
                        backgroundColor: '#14100E',
                        '&:active': {
                            color: '#14100E',
                            backgroundColor: '#A3B832'
                        }
                    }),
                    ...(ownerState.color === 'blackpurple' && {
                        color: '#9E9FEB',
                        backgroundColor: '#14100E',
                        '&:active': {
                            color: '#14100E',
                            backgroundColor: '#9E9FEB'
                        }
                    }),
                    ...(ownerState.color === 'green' && {
                        color: '#5C720D',
                        backgroundColor: '#A3B832',
                        '&:active': {
                            color: '#A3B832',
                            backgroundColor: '#5C720D'
                        }
                    }),
                    ...(ownerState.color === 'green' && ownerState.disabled === true && {
                        color: '#404626',
                        backgroundColor: '#A3B83280',
                    }),
                    ...(ownerState.color === 'purple' && {
                        color: '#373867',
                        backgroundColor: '#9E9FEB',
                        '&:active': {
                            color: '#9E9FEB',
                            backgroundColor: '#373867'
                        }
                    }),
                    ...(ownerState.color === 'purple' && ownerState.disabled === true && {
                        color: '#7A7BAF',
                        backgroundColor: '#9E9FEB80',
                    }),
                    ...(ownerState.color === 'darkpurple' && {
                        color: '#9E9FEB',
                        backgroundColor: '#4546AB',
                        '&:active': {
                            color: '#4546AB',
                            backgroundColor: '#9E9FEB'
                        }
                    }),
                    ...(ownerState.color === 'darkpurple' && ownerState.disabled === true && {
                        color: '#4546AB',
                        backgroundColor: '#23232E',
                    }),
                    ...((ownerState.disabled) && {
                        cursor: 'not-allowed'
                    }),
                    ...((!ownerState.disabled) && {
                        '&:hover': {
                            cursor: 'pointer'
                        }
                    })
                }),
            },
        },
        JoyInput: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    ...({
                        fontFamily: 'Oxanium',
                        background: '#0d0603',
                        borderRadius: '15px',
                        padding: '15px'
                    }),
                    ...(ownerState.color === 'brown' && {
                        border: '1px #241D19 solid',
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
                    ...({
                        '&:focus': {
                            outline: '0'
                        }
                    }),
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
                    ...(ownerState.color === 'home' && {
                        border: '1px #241D19 solid',
                        background: '#0d0603',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        '&:hover': {
                            border: '1px #0d0603 solid',
                            background: '#14100E',
                            cursor: 'pointer'
                        }
                    }),
                    ...(ownerState.variant === 'purpleDashed' && {
                        border: '1px #9E9FEB dashed'
                    }),
                }),
            },
        },
        JoyTextarea: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    ...({
                        fontFamily: 'Oxanium',
                        color: '#E4E5FF',
                        border: '1px #241D19 solid',
                        background: '#0d0603',
                        borderRadius: '15px',
                        padding: '13px'
                    }),
                }),
                
            },
        },
        JoyCheckbox: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    ...({
                        fontFamily: 'Oxanium',
                        color: '#E4E5FF'
                    }),
                    ...(ownerState.color === 'green' && {
                        '& .MuiCheckbox-checkbox': {
                            border: '1px solid #A3B832',
                        },
                        '& .MuiCheckbox-checkbox.Joy-checked': {
                            background: '#A3B832',
                            color: '#5C720D'
                        }
                    }),
                }),
            },
        },
        JoyModal: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    ...({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    })
                })
            }
        },
        JoyMenu: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    ...({
                        background: '#14100E',
                        border: 'none',
                    }),
                })
            }
        },
        JoyMenuItem: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    ...({
                        fontFamily: 'Oxanium',
                        color: '#E4E5FF',
                        '&:focus': {
                            outline: '0'
                        },
                        '&:hover': {
                            background: '#0D0603'
                        }
                    }),
                })
            }
        },
        JoyCircularProgress: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    ...(ownerState.color === 'darkpurple' && {
                        '--CircularProgress-progressColor': '#373867'
                    })
                })
            }
        }
    },
});

export default GlobalStyle;