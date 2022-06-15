// #region Global Imports
import "styled-components";
// #endregion Global Imports
type CommonColors = "dashboardAccent" | "darkGray" | "lightGray";

type ExtendedColors =
  | CommonColors
  | "mainAccent"
  | "backgroundDashboard"
  | "backgroundMain"
  | "textColor";
declare module "styled-components" {
  export interface BaseTheme {
    colors: Record<CommonColors, string>;
  }

  export interface DefaultTheme extends BaseTheme {
    colors: Record<ExtendedColors, string>;
  }
}
