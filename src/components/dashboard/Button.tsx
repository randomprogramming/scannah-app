import React from "react";
import styled from "styled-components";

const Container = styled.div`
  -webkit-box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.3);
  box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.3);
  background-color: ${(props) => props.theme.colors.dashboardAccent};

  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  &:hover {
    background-color: ${(props) => props.theme.colors.dashboardAccent + "AA"};
  }
`;

interface StyleButtonProps {
  disabled: boolean;
  color?: string;
}

const StyledButton = styled.button<StyleButtonProps>`
  -webkit-box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.3);
  box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.3);
  outline: none !important;
  background-color: ${(props) =>
    props.color ? props.color : props.theme.colors.dashboardAccent};

  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  &:hover {
    background-color: ${(props) =>
      props.color
        ? props.color + "AA"
        : props.theme.colors.dashboardAccent + "AA"};
  }

  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

interface ButtonProps {
  title?: string;
  onClick?(): void;
  children?: React.ReactNode;
  disabled?: boolean;
  color?: string;
}

export default function Button({
  title,
  onClick,
  children,
  disabled,
  color,
}: ButtonProps) {
  // If children were supplied, use that instead of a button
  if (children) {
    return (
      <Container
        className="poppins rounded-full text-white font-medium"
        style={color && { backgroundColor: color }}
      >
        {children}
      </Container>
    );
  }

  return (
    <StyledButton
      disabled={disabled}
      onClick={onClick}
      className="poppins rounded-full px-12 py-4 text-white font-medium inline-block"
      color={color}
    >
      {title}
    </StyledButton>
  );
}
