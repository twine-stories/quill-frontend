import {createGlobalStyle} from 'styled-components';
import styles from './globalStyles.css';
import {extendTheme} from "@mui/joy";

const GlobalStyle = createGlobalStyle `${styles.toString()}`;

declare module '@mui/joy/Button' {
    interface ButtonPropsColorOverrides {
        green: true;
        light: true;
        dark: true;
    }
}

export const theme = extendTheme({
    components: {
        JoyButton: {
            styleOverrides: {
                root: ({ ownerState, theme }) => ({
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
    },
});

export default GlobalStyle;