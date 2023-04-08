import {createGlobalStyle} from 'styled-components';
import styles from './globalStyles.css';
import {extendTheme} from "@mui/joy";
import { fontWeight } from '@mui/system';

const GlobalStyle = createGlobalStyle `${styles.toString()}`;

declare module '@mui/joy/Button' {
    interface ButtonPropsColorOverrides {
        green: true;
        light: true;
        dark: true;
    }
}

declare module '@mui/joy/Input' {
    interface InputPropsColorOverrides {
        brown: true;
    }
}

export const theme = extendTheme({
    components: {
        JoyTypography: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    ...((ownerState.level === 'h1' || ownerState.level === 'h2') && {
                        fontFamily: 'Twine',
                        fontWeight: 'normal'
                    }),
                    ...((ownerState.level === 'h3' || ownerState.level === 'h4' || ownerState.level === 'h5' || ownerState.level === 'h6') && {
                        fontFamily: 'Oxanium',
                        fontWeight: 'normal'
                    }),
                })
            }
        },
        JoyButton: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
                    ...({
                        fontFamily: 'Oxanium'
                    }),
                    ...(ownerState.color === 'green' && {
                        color: '#5C720D',
                        backgroundColor: '#A3B832',
                    }),
                    ...(ownerState.color === 'light' && {
                        color: '#373867',
                        backgroundColor: '#9E9FEB',
                    }),
                    ...(ownerState.color === 'dark' && {
                        color: '#9E9FEB',
                        backgroundColor: '#4546AB',
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