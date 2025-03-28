import { Button, Card } from "antd";
import styled from "styled-components";

const HomeWrapper = styled.div`
  height: 100vh;
  background: linear-gradient(to right, #e6f0ff, #ffffff);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledCard = styled(Card)`
  text-align: center;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: none;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
`;

const Subtitle = styled.h2`
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 30px;
  font-weight: 400;
`;

const Home = ({ onClickPlan }) => {
  return (
    <HomeWrapper>
      <StyledCard>
        <Title>Welcome back, Chandra! 👋</Title>
        <Subtitle>Ready to organize your day and crush your goals?</Subtitle>
        <Button type="primary" shape="round" size="large" onClick={onClickPlan}>
          Plan Your Day Now
        </Button>
      </StyledCard>
    </HomeWrapper>
  );
};

export default Home;
