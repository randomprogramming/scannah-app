import React from "react";
import MainContainer from "@components/main/MainContainer";
import LinkButton from "@components/main/LinkButton";
import Card from "@components/Card";
import styled from "styled-components";
import Icon from "@components/Icon";

interface StepsContainerProps {
  title: string;
  paragraph: string;
  imageLink: string;
  reverse?: boolean;
  imageAlt: string;
}

const StepsContainer = ({
  title,
  paragraph,
  imageLink,
  reverse,
  imageAlt,
}: StepsContainerProps) => {
  return (
    <div
      className={`flex flex-col ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      } mt-12 md:mt-4 items-center justify-center`}
    >
      <div className="w-8/12 md:w-5/12" style={{ maxWidth: "450px" }}>
        <img src={imageLink} alt={imageAlt} />
      </div>
      {/* Divide the content by the exact same number */}
      <div className="w-0 md:w-2/12" />
      <div
        className={`${
          reverse ? "text-center md:text-right" : "text-center md:text-left"
        } w-8/12 md:w-5/12`}
        style={{ maxWidth: "400px" }}
      >
        <div>
          <h2>{title}</h2>
        </div>
        <div>
          <p className="text-secondary">{paragraph}</p>
        </div>
      </div>
    </div>
  );
};

const PHONE_BREAKPOINT = 950;

const StyledCard = styled(Card)`
  z-index: 1;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  user-select: none;
  position: relative;

  &:hover {
    background-color: #23797866;
    transform: scale(1.08);
  }

  @media (max-width: ${PHONE_BREAKPOINT}px) {
    background-color: #23797866;
    transform: scale(1.08);
  }
`;

const MoveUpOnHover = styled.div`
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  margin-top: 6px;

  max-width: 220px;

  ${StyledCard}:hover & {
    transform: translateY(-14px);
  }

  @media (max-width: ${PHONE_BREAKPOINT}px) {
    transform: translateY(-14px);
  }
`;

const HiddenText = styled.div`
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  ${StyledCard}:hover & {
    opacity: 1;
  }

  @media (max-width: ${PHONE_BREAKPOINT}px) {
    opacity: 1;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  ${StyledCard}:hover & {
    transform: scale(0.6);
  }

  @media (max-width: ${PHONE_BREAKPOINT}px) {
    transform: scale(0.6);
  }
  @media (max-width: ${PHONE_BREAKPOINT}px) {
    display: none;
  }
`;

const StyledSampleImageContainer = styled.div`
  -webkit-box-shadow: 3px 3px 5px 1px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 3px 3px 5px 1px rgba(0, 0, 0, 0.3);
  box-shadow: 3px 3px 5px 1px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  overflow: hidden;
`;

function StyledSampleImage({ imgUrl }) {
  return (
    <StyledSampleImageContainer>
      <img src={imgUrl} alt="sample code" />
    </StyledSampleImageContainer>
  );
}

function CustomerRewardsContainer({ src, title, description }) {
  return (
    <div className="flex flex-col justify-center items-center">
      <img
        src={src}
        alt="campaign type"
        style={{ width: "75%", height: "auto" }}
      />

      <div className="mt-4 text-center flex-1">
        <h2>{title}</h2>
        <p className="text-secondary mt-4">{description}</p>
      </div>
    </div>
  );
}

const HomepageIntroItemContainer = ({ title, children }) => {
  return (
    <StyledCard className="rounded-md w-full h-full p-4">
      <MoveUpOnHover>
        <h2 className="text-3xl">{title}</h2>
        <HiddenText className="mt-3 mb-4">
          <p>{children}</p>
        </HiddenText>
      </MoveUpOnHover>
      <IconContainer>
        <Icon name="showMore" height={24} width={24} />
      </IconContainer>
    </StyledCard>
  );
};

const Index: React.FC = () => {
  return (
    <MainContainer>
      <section className="px-8 md:w-4/5 xl:w-3/5 mx-auto flex flex-col md:flex-row max-w-screen-xl">
        <div
          className="flex-1 flex flex-col"
          style={{ minWidth: "290px", maxWidth: "690px" }}
        >
          <div className="text-center md:text-right">
            <h1>
              Grow your business and reward your customers for being loyal
            </h1>
          </div>
          <div className="text-center md:text-right flex-1">
            <p className="text-secondary">
              We help you keep a steady flow of customers which will always have
              a reason to visit your shop again.
            </p>
          </div>
          <div className="flex flex-col place-self-center md:place-self-end mt-6">
            <div className="mt-4 place-self-center md:place-self-end">
              <LinkButton href="/sign-up" variant="hollow">
                I'm here to collect points
              </LinkButton>
            </div>
            <div className="mt-8 place-self-center md:place-self-end">
              <LinkButton href="/sign-up/business" variant="filled">
                Sign me up
              </LinkButton>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <img
            alt="person shopping"
            src="/IntroImage.png"
            style={{ width: "100%", height: "auto", maxWidth: "400px" }}
          />
        </div>
      </section>

      <section className="mt-20 grid grid-cols-1 gap-9 justify-items-center md:grid-cols-2 lg:grid-cols-3 px-8 md:w-4/5 xl:w-3/5 mx-auto md:flex-row max-w-screen-xl">
        <div className="flex items-center justify-center text-center">
          <h1 className="text-3xl">Why are we the best choice?</h1>
        </div>
        <HomepageIntroItemContainer title="Reward your customers">
          Reward your loyal customers and motivate new customers to come in!
        </HomepageIntroItemContainer>
        <HomepageIntroItemContainer title="Incredibly easy to use">
          Start a new campaign, export your codes and you're done. Yes, it's
          that easy.
        </HomepageIntroItemContainer>
        <HomepageIntroItemContainer title="Real time data">
          You'll know when a customer scans a code no more than a few seconds
          after they scan it!
        </HomepageIntroItemContainer>
        <HomepageIntroItemContainer title="Fully customizable QR Code">
          Oh just wait till you see the possibilities!
        </HomepageIntroItemContainer>
        <HomepageIntroItemContainer title="No app needed">
          We made your customers life easier, no need to download any app to get
          rewarded.
        </HomepageIntroItemContainer>
      </section>

      <section className="px-12 md:w-4/5 xl:w-3/5 mx-auto mt-20">
        <h1>Multiple ways to reward your customers</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-16">
          <CustomerRewardsContainer
            src="/campaign-styles/giveaway.png"
            title="Giveaway"
            description="Choose a giveaway campaign type which allows your users to enter a giveaway for anything you might be giving away. You can allow single or multiple entries!"
          />
          <CustomerRewardsContainer
            src="/campaign-styles/point-collector.png"
            title="Point Collector"
            description="Your customers collect points which they may redeem for promotions or products. You may redeem any amount of points from any customer!"
          />
          <CustomerRewardsContainer
            src="/campaign-styles/lucky-ticket.png"
            title="Lucky Ticket"
            description="Generate as many winning tickets as you wish and leave the rest to fate! Your customers will know right away when they scan a winning code."
          />
        </div>
      </section>

      <section className="px-12 md:w-4/5 xl:w-3/5 mx-auto mt-20">
        <h1>Infinite customization</h1>
        <p className="text-secondary" style={{ maxWidth: "600px" }}>
          Stand out from the crowd and impress your customers with these
          beautiful fully customizable QR Codes. You can even put your company
          logo on a code!
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
          <StyledSampleImage imgUrl="/sample-codes/first.png" />
          <StyledSampleImage imgUrl="/sample-codes/second.png" />
          <StyledSampleImage imgUrl="/sample-codes/third.png" />
        </div>
      </section>

      <section className="px-12 md:w-4/5 xl:w-3/5 mx-auto mt-20">
        <div className="text-center mt-16">
          <h1>How it works</h1>
        </div>
        <StepsContainer
          title="You start a new campaign"
          paragraph="A campaign allows you to keep track and
          manage your customers, but most importantly,
          this is how you generate codes."
          imageLink="/IntroBrowser.png"
          imageAlt="browser icon"
        />
        <StepsContainer
          reverse
          title="Distribute the codes"
          paragraph="Distribute the codes among your customers,
          either digitally or physically."
          imageLink="/IntroBasket.png"
          imageAlt="qr code in basket"
        />
        <StepsContainer
          title="And the rest is up to your customers"
          paragraph="Customers will scan the codes,
          and your rewards will encourage them to visit your store again!"
          imageLink="/IntroScan.png"
          imageAlt="scanning qr code"
        />
      </section>
    </MainContainer>
  );
};

export default Index;
