import {createGlobalStyle} from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: Twine;
    src: url("/public/Twine.otf") format("opentype");
  }
  
  body {
    margin: 0;
    padding: 0;
    background: #0d0603;
    font-family: 'Twine', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    color: #ffffff;
  }
`;

export default GlobalStyle;