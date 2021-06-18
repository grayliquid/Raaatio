import styled from "styled-components";
import { Outer } from "../landing-page-components/common";
import Button from "./Button/button";
import { links } from "./Button/utitls";

export const Header = ({ textColor = "#000" }) => {
  return (
    <HeaderWrapper>
      <Outer>
        <Container>
          <LogoContainer>
            <img src="/static/landing-page/logo.png"></img>
          </LogoContainer>
          <LinkContainer>
            <Button
              label="Pricing"
              bg="#fff"
              textColor="#000"
              path="/pricing"
            ></Button>
            <Button
              label="buy for $60"
              bg="#000"
              path={links.proLink}
              self={false}
            ></Button>
          </LinkContainer>
        </Container>
      </Outer>
    </HeaderWrapper>
  );
};

const LinkContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  grid-gap: 20px;
`;

const Text = styled.p`
  font-size: 14px;
  line-height: 180%;
  margin: 5px 0;
  font-family: "Inter", sans-serif;
  cursor: pointer;
  color: ${(props) => (props.color ? props.color : "#000")};
`;

const LogoContainer = styled.div`
  width: auto;
  height: 100%;
  padding: 20px 0;

  img {
    width: 40px;
  }
`;

const HeaderWrapper = styled.div`
  width: 100%;
  height: auto;
  /* background-color: #fff; */
  padding: 10px 0;
  position: absolute;
  top: 0px;
  z-index: 100;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: 500px) {
    display: none;
  }
`;
