import { createGlobalStyle } from "styled-components";

const DashboardContainerGlobalStyles = createGlobalStyle`
  html {
    background-color: ${(props) => props.theme.colors.backgroundDashboard};
  }
`;

export default DashboardContainerGlobalStyles;
