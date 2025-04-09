import React from 'react';
import { Button, Tag } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const PRIORITY_COLORS = {
  important: 'red',
  urgent: 'orange',
  normal: 'green',
  'not important': 'default',
};

const Card = styled.div`
  background: #fff;
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  margin-bottom: 16px;
  width: 90%;
  max-width: 400px;
  transition: transform 0.2s ease;
  border-left: 6px solid ${({ priority }) => PRIORITY_COLORS[priority]};

  &:hover {
    transform: translateY(-2px);
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Time = styled.span`
  font-size: 0.9rem;
  color: #555;
`;

const Name = styled.h3`
  font-size: 1.1rem;
  margin: 8px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`;

const TaskCard = ({ task, onStatusChange }) => (
  <Card priority={task.priority}>
    <InfoRow>
      <Time>{task.timeRange[0]} - {task.timeRange[1]}</Time>
      <Tag color={PRIORITY_COLORS[task.priority]}>
        {task.priority.toUpperCase()}
      </Tag>
    </InfoRow>

    <Name>{task.name}</Name>

    {!task.status && (
      <ButtonGroup>
        <Button
          type="primary"
          icon={<CheckOutlined />}
          onClick={() => onStatusChange(task.id, 'task')}
        >
          Task
        </Button>
        <Button
          danger
          icon={<CloseOutlined />}
          onClick={() => onStatusChange(task.id, 'not_task')}
        >
          Not a Task
        </Button>
      </ButtonGroup>
    )}

    {task.status === 'task' && (
      <ButtonGroup>
        <Button type="dashed" onClick={() => onStatusChange(task.id, 'done')}>
          Done
        </Button>
      </ButtonGroup>
    )}
  </Card>
);

export default TaskCard;
