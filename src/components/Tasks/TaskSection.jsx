import React from 'react';
import { Typography, Divider } from 'antd';
import dayjs from 'dayjs';
import TaskCard from './TaskCard';

const { Title } = Typography;

const TaskSection = ({ date, tasks, onStatusChange }) => (
  <div style={{ marginBottom: 40 }}>
    <Title level={4}>{dayjs(date).format('dddd, MMMM D, YYYY')}</Title>
    <Divider style={{ margin: '10px 0 20px' }} />
    {tasks.map((task, idx) => (
      <TaskCard key={idx} task={task} onStatusChange={onStatusChange} />
    ))}
  </div>
);

export default TaskSection;
