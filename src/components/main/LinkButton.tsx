import Link from "next/link";
import React from "react";
import styled from "styled-components";

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "hollow" | "filled";
}

const BaseLink = styled.a`
  padding: 10px 30px;
  border-radius: 30px;
  font-family: Poppins;
  font-size: 18px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0, 0.55, 0.44, 0.99);
`;

const StyledHollowLink = styled(BaseLink)`
  border: 3px solid ${(props) => props.theme.colors.mainAccent};

  &:hover {
    -webkit-box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.2);
    box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.2);

    background-color: ${(props) => props.theme.colors.mainAccent};
    color: ${(props) => props.theme.colors.backgroundMain};
  }
`;

const StyledFilledLink = styled(BaseLink)`
  background-color: ${(props) => props.theme.colors.mainAccent};
  color: ${(props) => props.theme.colors.backgroundMain};

  -webkit-box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.2);
  box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: ${(props) => props.theme.colors.mainAccent}AA;
  }
`;

export default function LinkButton({
  href,
  children,
  variant = "filled",
}: LinkButtonProps) {
  function getStyledLink() {
    switch (variant) {
      case "hollow":
        return <StyledHollowLink>{children}</StyledHollowLink>;
      case "filled":
      default:
        return <StyledFilledLink>{children}</StyledFilledLink>;
    }
  }

  return (
    <Link href={href} passHref>
      {getStyledLink()}
    </Link>
  );
}
