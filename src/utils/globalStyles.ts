import {createGlobalStyle} from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: Twine;
    src: url("../../public/Twine.otf") format("opentype");
  }
  
  body {
    margin: 0;
    padding: 0;
    background: #1E1E1E;
    font-family: 'Twine', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    color: #ffffff;
    display: flex;
    justify-content: space-around;
  }

  .App {
    width: 75vw;
  }
`;

export default GlobalStyle;