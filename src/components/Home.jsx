import { useEffect, useState } from "react";
import { Button, Progress, Typography, message } from "antd";
import styled from "styled-components";
import dayjs from "dayjs";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase";

const HomeContainer = styled.div`
  padding: 40px;
  background: #f0f4fc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Card = styled.div`
  background: #ffffff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
`;

const WelcomeText = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 10px;
`;

const SubText = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 20px;
`;

const Quote = styled.p`
  font-style: italic;
  font-size: 1.1rem;
  text-align: center;
  margin-top: 16px;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-around;
  text-align: center;
  font-size: 1.2rem;
`;

const StatBlock = styled.div`
  flex: 1;
`;

const Label = styled.div`
  color: #777;
  font-size: 0.95rem;
`;

const Title = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const TaskList = styled.ul`
  padding-left: 20px;
`;

const TaskItem = styled.li`
  font-size: 1rem;
  margin-bottom: 6px;
`;

const Home = ({ onClickPlan }) => {
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [doneCount, setDoneCount] = useState(0);
  const today = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const fetchTodayActivities = async () => {
      try {
        const ref = collection(firestore, "activities");
        const q = query(ref, where("date", "==", today));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => doc.data());

        const sorted = data.sort((a, b) =>
          dayjs(a.timeRange[0], "HH:mm").diff(dayjs(b.timeRange[0], "HH:mm"))
        );

        const completed = sorted.filter((task) => task.status === "done").length;

        setTodaysTasks(sorted);
        setDoneCount(completed);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
        message.error("Unable to load today's tasks.");
      }
    };

    fetchTodayActivities();
  }, [today]);

  const progress = todaysTasks.length > 0
    ? Math.round((doneCount / todaysTasks.length) * 100)
    : 0;

  return (
    <HomeContainer>
      <Card>
        <WelcomeText>Welcome back, Chandra! 👋</WelcomeText>
        <SubText>Ready to organize your day and crush your goals?</SubText>
        <Button type="primary" shape="round" size="large" onClick={onClickPlan}>
          Plan Your Day Now
        </Button>
        <Quote>
          “Success is the sum of small efforts, repeated day-in and day-out.”
        </Quote>
      </Card>

      <Card>
        <StatsRow>
          <StatBlock>
            <div><strong>{doneCount}</strong></div>
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
      </Card>

      <Card>
        <Title>Today's affirmation</Title>
        <SubText>I'm focused, productive, and in control of my day.</SubText>
        <Title style={{ marginTop: 20 }}>{progress}%</Title>
        <Progress
          percent={progress}
          strokeColor={{ from: "#1890ff", to: "#52c41a" }}
        />
        <SubText style={{ marginTop: 10 }}>{doneCount} of {todaysTasks.length} tasks completed</SubText>
      </Card>

      <Card>
        <Title>Today's Tasks</Title>
        <TaskList>
          {todaysTasks.length > 0 ? (
            todaysTasks.map((task, index) => (
              <TaskItem key={index}>
                {task.timeRange[0]} - {task.timeRange[1]}: {task.name} ({task.priority})
                {task.status === "done" && " ✅"}
              </TaskItem>
            ))
          ) : (
            <SubText>No tasks for today. Plan your day!</SubText>
          )}
        </TaskList>
      </Card>
    </HomeContainer>
  );
};

export default Home;