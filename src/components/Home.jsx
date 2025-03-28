import { Button, Progress } from "antd";
import styled from "styled-components";

const HomeContainer = styled.div`
  padding: 40px;
  background: #f9fbff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Section = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const WelcomeText = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const SubText = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 20px;
`;

const Quote = styled.p`
  font-style: italic;
  font-size: 1.1rem;
  text-align: center;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: center;
  font-size: 1.2rem;
`;

const StatBlock = styled.div`
  flex: 1;
`;

const Label = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const TaskList = styled.ul`
  padding-left: 20px;
`;

const TaskItem = styled.li`
  font-size: 1rem;
  margin-bottom: 4px;
`;

const Home = ({ onClickPlan }) => {
  return (
    <HomeContainer>
      {/* Welcome */}
      <div>
        <WelcomeText>Welcome back, Chandra! 👋</WelcomeText>
        <SubText>Ready to organize your day and crush your goals?</SubText>
        <Button type="primary" shape="round" size="large" onClick={onClickPlan}>
          Plan Your Day Now
        </Button>
      </div>

      {/* Quote */}
      <Quote>
        “Success is the sum of small efforts, repeated day-in and day-out.”
      </Quote>

      {/* Stats */}
      <Section>
        <StatsRow>
          <StatBlock>
            <div><strong>8</strong></div>
            <Label>Tasks Completed</Label>
          </StatBlock>
          <StatBlock>
            <div><strong>3</strong></div>
            <Label>Focus Sessions</Label>
          </StatBlock>
          <StatBlock>
            <div><strong>5 🔥</strong></div>
            <Label>Streak Days</Label>
          </StatBlock>
        </StatsRow>
      </Section>

      {/* Affirmation */}
      <Section>
        <Title>Today's affirmation</Title>
        <SubText>I'm focused, productive, and in control of my day.</SubText>
      </Section>

      {/* Progress */}
      <Section>
        <Progress percent={60} strokeColor={{ from: "#1890ff", to: "#52c41a" }} />
      </Section>

      {/* Tasks */}
      <Section>
        <Title>Today's Tasks</Title>
        <TaskList>
          <TaskItem>Complete project demo</TaskItem>
          <TaskItem>30 min exercise</TaskItem>
          <TaskItem>Study React</TaskItem>
        </TaskList>
      </Section>
    </HomeContainer>
  );
};

export default Home;
