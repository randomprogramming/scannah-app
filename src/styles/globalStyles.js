import { useAppSelector } from "@redux/store";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html, body, #__next {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  #__next {
    display: flex;
    flex-direction: column;
  }
  
  body {
    font-family: 'Inter', -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,
    "Helvetica Neue",Arial,"Noto Sans","Liberation Sans",
    sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
    color: ${(props) => props.theme.colors.textColor};
    ${(props) =>
      props.isMenuOpen &&
      "overflow: hidden;"} // Disable scrolling when menu is open
  }

  h1, h2, h3, h4, h5, h6, .poppins {
    font-family: 'Poppins';
  }
  h1 { font-size: 2.5em; font-weight: 600 }
  h2 { font-size: 2em; font-weight: 600}
  h3 { font-size: 1.4em; font-weight: 500}
  h4 { font-size: 1.1em; font-weight: 500}
  h5 { font-size: .83em; }
  h6 { font-size: .75em; }
`;

function GlobalStyleComponent() {
  const isMenuOpen = useAppSelector((state) => state.appState.isMenuOpen);

  return <GlobalStyle isMenuOpen={isMenuOpen} />;
}

export default GlobalStyleComponent;
