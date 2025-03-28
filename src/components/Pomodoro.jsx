import React, { useEffect, useRef, useState } from 'react';
import { Typography, Button, Progress, Space, message } from 'antd';

const { Title } = Typography;

const Pomodoro = () => {
  const initialTime = 25 * 60; // 25 minutes in seconds
  const [secondsLeft, setSecondsLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  // Format time as mm:ss
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
    return () => clearInterval(timerRef.current); // cleanup on unmount
  }, []);

  const percent = ((initialTime - secondsLeft) / initialTime) * 100;

  return (
    <div style={{ padding: 30, textAlign: 'center' }}>
      <Title level={2}>Pomodoro Timer</Title>

      <Progress
        type="circle"
        percent={percent}
        format={() => formatTime(secondsLeft)}
        strokeColor="#eb2f96"
        size={250}
      />

      <Space style={{ marginTop: 30 }}>
        {!isRunning ? (
          <Button type="primary" onClick={startTimer}>
            Start
          </Button>
        ) : (
          <Button onClick={pauseTimer}>Pause</Button>
        )}
        <Button danger onClick={resetTimer}>
          Reset
        </Button>
      </Space>
    </div>
  );
};

export default Pomodoro;
