import React, { useEffect, useRef, useState } from 'react';
import { Typography, Button, Progress, Space, message } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

// Styled container
const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const TimerBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 12px;
`;

const Pomodoro = () => {
  const initialTime = 25 * 60;
  const [secondsLeft, setSecondsLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const formatTime = (totalSeconds) => {
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            message.success("Pomodoro session completed!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setSecondsLeft(initialTime);
    setIsRunning(false);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const percent = ((initialTime - secondsLeft) / initialTime) * 100;

  return (
    <Wrapper>
      <Title level={2} style={{ color: '#333', marginBottom: 40 }}>
        🍅 Pomodoro Timer
      </Title>
      <TimerBox>
        <Progress
          type="circle"
          percent={percent}
          format={() => formatTime(secondsLeft)}
          strokeColor={{
            '0%': '#52c41a',
            '100%': '#eb2f96',
          }}
          trailColor="#eee"
          size={240}
        />
        <Buttons>
          {!isRunning ? (
            <Button type="primary" size="large" onClick={startTimer}>
              Start
            </Button>
          ) : (
            <Button size="large" onClick={pauseTimer}>
              Pause
            </Button>
          )}
          <Button danger size="large" onClick={resetTimer}>
            Reset
          </Button>
        </Buttons>
      </TimerBox>
    </Wrapper>
  );
};

export default Pomodoro;
