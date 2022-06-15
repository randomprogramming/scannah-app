import React, { useEffect } from "react";
import { closeMenu, openMenu } from "@redux/slices/appStateSlice";
import { useAppDispatch, useAppSelector } from "@redux/store";
import styled from "styled-components";
import useWindowSize from "@hooks/useWindowSize";

const HeightFixer = styled.div`
  height: 64px;
  width: 64px;
`;

const Icon = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 58px;
  width: 62px;
  padding: 20px;
  cursor: pointer;
`;

interface LineProps {
  readonly isOpen: boolean;
}

const IconLine = styled.i<LineProps>`
  background-color: ${(props) => props.theme.colors.textColor};
  width: 100%;
  height: 2px;
  border-radius: 3px;
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
`;

const FirstLine = styled(IconLine)`
  transform-origin: top left;
  transform: ${(props) => (props.isOpen ? "rotate(45deg)" : "rotate(0deg)")};

  width: ${(props) => (props.isOpen ? "24px" : "100%")};
`;

const SecondLine = styled(IconLine)`
  transform: ${(props) => (props.isOpen ? "scale(0)" : "scale(1)")};
`;

const ThirdLine = styled(IconLine)`
  transform-origin: bottom left;
  transform: ${(props) => (props.isOpen ? "rotate(-45deg)" : "rotate(0deg)")};

  width: ${(props) => (props.isOpen ? "24px" : "100%")};
`;

export default function MenuIcon() {
  const isOpen = useAppSelector((state) => state.appState.isMenuOpen);

  const dispatch = useAppDispatch();

  const size = useWindowSize();

  function handleMenuPress() {
    if (isOpen) {
      dispatch(closeMenu());
    } else {
      dispatch(openMenu());
    }
  }

  useEffect(() => {
    // Whenever window size changes, close the menu
    if (isOpen) {
      dispatch(closeMenu());
    }
  }, [size.height, size.width]);

  return (
    <HeightFixer onClick={handleMenuPress}>
      <Icon>
        <FirstLine isOpen={isOpen} />
        <SecondLine isOpen={isOpen} />
        <ThirdLine isOpen={isOpen} />
      </Icon>
    </HeightFixer>
  );
}
