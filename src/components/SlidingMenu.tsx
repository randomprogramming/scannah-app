import { useAppSelector } from "@redux/store";
import React from "react";
import styled from "styled-components";

interface MenuProps {
  readonly isOpen: boolean;
  readonly zIndex: number;
  readonly navbarHeight: number;
}

const Menu = styled.div<MenuProps>`
  width: 100vw;
  height: 100vh;
  background-color: ${(props) => props.theme.colors.backgroundMain};
  position: fixed;
  top: 0;
  left: 0;
  transition: visibility 0.44s, transform 0.44s cubic-bezier(0.64, 0, 0.78, 0);
  overflow-x: hidden;
  overflow-y: auto;
  z-index: ${(props) => props.zIndex};
  padding: ${(props) => props.navbarHeight}px 16px;
  padding-bottom: 0 !important;

  transform: ${(props) =>
    props.isOpen
      ? "translate3d(0vw, 0, 0); overflow: hidden;"
      : "translate3d(-100vw, 0, 0);"}; // translate the menu offscreen to hide it

  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};

  @media screen and (min-width: 424px) {
    padding: ${(props) => props.navbarHeight}px
      ${(props) => props.navbarHeight / 2}px;
    padding-bottom: 0 !important;
  }
`;

export default function SlidingMenu({ children, zIndex, navbarHeight }) {
  const isOpen = useAppSelector((state) => state.appState.isMenuOpen);

  return (
    <Menu isOpen={isOpen} zIndex={zIndex} navbarHeight={navbarHeight}>
      {children}
    </Menu>
  );
}
