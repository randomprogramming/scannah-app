import { createGlobalStyle } from "styled-components";

const MainContainerGlobalStyles = createGlobalStyle`
  html {
    background-color: ${(props) => props.theme.colors.backgroundMain};
  }
`;

export default MainContainerGlobalStyles;
