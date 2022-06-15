import React from "react";
import styled from "styled-components";

interface CardInterface {
  className?: string;
  children: React.ReactNode;
  onClick?(): void;
  style?: React.CSSProperties;
}

const StyledCard = styled.div`
  background-color: ${(props) => props.theme.colors.backgroundMain};
  -webkit-box-shadow: 2px 2px 3px 1px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 2px 2px 3px 1px rgba(0, 0, 0, 0.2);
  box-shadow: 2px 2px 3px 1px rgba(0, 0, 0, 0.2);
`;

export default function Card({
  className,
  children,
  onClick,
  style,
}: CardInterface) {
  return (
    <StyledCard className={className} onClick={onClick} style={style}>
      {children}
    </StyledCard>
  );
}
