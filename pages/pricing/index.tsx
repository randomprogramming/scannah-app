import Icon from "@components/Icon";
import MainContainer from "@components/main/MainContainer";
import Link from "next/link";
import React, { ReactNode } from "react";
import styled from "styled-components";

interface PackageContainerProps {
  name: string;
  price: string;
  description: string;
  href: string;
  children?: ReactNode;
}

function PackageLine({ children }) {
  return (
    <div className="flex flex-row mt-8">
      <div className="mr-2" style={{ paddingTop: "4px" }}>
        <Icon
          name="checkmark"
          height={16}
          width={16}
          color="rgb(124,134,159)"
        />
      </div>

      <div className="flex-1">
        <p>{children}</p>
      </div>
    </div>
  );
}

const StyledPackageContainer = styled.div`
  border: 2px solid transparent;
  padding: 32px;
  border-radius: 24px;
  transition: all 0.2s cubic-bezier(0.39, 0.575, 0.565, 1);
  max-width: 400px;
  display: flex;
  flex-direction: column;

  &:hover {
    border: 2px solid ${(props) => props.theme.colors.lightGray};
    -webkit-box-shadow: 3px 3px 6px 1px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 3px 3px 6px 1px rgba(0, 0, 0, 0.3);
    box-shadow: 3px 3px 6px 1px rgba(0, 0, 0, 0.3);
  }
`;

const StyledButton = styled.a`
  border: 2px solid ${(props) => props.theme.colors.mainAccent};
  color: ${(props) => props.theme.colors.mainAccent};
  font-weight: 600;
  border-radius: 16px;
  width: 100%;
  padding: 20px 10px;
  margin-top: auto;
  transition: all 0.2s cubic-bezier(0.39, 0.575, 0.565, 1);
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${(props) => props.theme.colors.mainAccent};
    color: white;
    -webkit-box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.3);
    box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.3);
  }
`;

const StyledPriceContainer = styled.div`
  position: relative;

  &::after {
    content: "FREE BETA";
    font-family: Poppins;
    font-weight: 600;
    color: red;
    position: absolute;
    right: 25%;
    left: 0;
    top: 60%;
    height: 3px;
    padding-top: 4px;
    background-color: red;
    border-radius: 99px;
  }
`;

function PackageContainer({
  name,
  price,
  description,
  href,
  children,
}: PackageContainerProps) {
  return (
    <StyledPackageContainer>
      <h3>{name}</h3>
      <StyledPriceContainer className="mt-3">
        <h2>
          {price} € <span className="text-secondary text-sm">/month</span>
        </h2>
      </StyledPriceContainer>
      <div className="mt-6" style={{ minHeight: "80px" }}>
        <p>{description}</p>
      </div>
      <div className="mt-9">{children}</div>

      <div className="flex-grow mt-8 flex">
        <Link href={href} passHref>
          <StyledButton>I'm Interested</StyledButton>
        </Link>
      </div>
    </StyledPackageContainer>
  );
}

export default function Pricing() {
  return (
    <MainContainer>
      <section className="md:w-4/5 mx-auto pb-6">
        <div
          style={{ maxWidth: "700px" }}
          className="mt-10 text-center lg:text-left"
        >
          <h1>Simple pricing tailored for any business size</h1>
          <p className="text-secondary poppins">
            Monthly payments with no surprise fees.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 mt-32 gap-8 justify-items-center">
          <PackageContainer
            name="Free"
            price="0.00"
            description="For businesses that want to try it out or don’t expect a lot of traffic."
            href="/sign-up/business"
          >
            <PackageLine>One active campaign</PackageLine>
            <PackageLine>No QR Code styling options</PackageLine>
            <PackageLine>Unable to put company logo on QR Code</PackageLine>
            <PackageLine>Full real time data</PackageLine>
            <PackageLine>Can generate 100 QR Codes per month</PackageLine>
          </PackageContainer>
          <PackageContainer
            name="Lite"
            price="9.99"
            description="For medium businesses with a decent amount of traffic."
            href="/sign-up/business?plan=lite"
          >
            <PackageLine>Three active campaigns</PackageLine>
            <PackageLine>Complete QR Code styling options</PackageLine>
            <PackageLine>Unable to put company logo on QR Code</PackageLine>
            <PackageLine>Full real time data</PackageLine>
            <PackageLine>Can generate 3000 QR Codes per month</PackageLine>
          </PackageContainer>
          <PackageContainer
            name="Professional"
            price="29.99"
            description="For large businesses who need unlimited campaigns and codes."
            href="/sign-up/business?plan=professional"
          >
            <PackageLine>Unlimited active campaigns</PackageLine>
            <PackageLine>Complete QR Code styling options</PackageLine>
            <PackageLine>Can put company logo on QR Code</PackageLine>
            <PackageLine>Full real time data</PackageLine>
            <PackageLine>Can generate unlimited QR Codes per month</PackageLine>
          </PackageContainer>
        </div>
      </section>
    </MainContainer>
  );
}
