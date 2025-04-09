import React from 'react';
import { Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const PRIORITY_COLORS = {
  important: 'red',
  urgent: 'orange',
  normal: 'green',
  'not important': 'default',
};

const DoneCard = styled.div`
  background: #fff;
  padding: 16px 20px;
  border-radius: 16px;
  margin-bottom: 16px;
  opacity: 0.6;
  filter: grayscale(100%);
  width: 90%;
  max-width: 400px;
  border-left: 6px solid ${({ priority }) => PRIORITY_COLORS[priority]};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Time = styled.span`
  font-size: 0.9rem;
  color: #555;
`;

const Name = styled.h3`
  font-size: 1.1rem;
  margin: 8px 0;
`;

const DoneTaskCard = ({ task, onDelete }) => (
  <DoneCard priority={task.priority}>
    <InfoRow>
      <Time>{task.timeRange[0]} - {task.timeRange[1]}</Time>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Tag color={PRIORITY_COLORS[task.priority]}>
          {task.priority.toUpperCase()}
        </Tag>
        <DeleteOutlined
          onClick={onDelete}
          style={{ cursor: 'pointer', color: '#ff4d4f' }}
        />
      </div>
    </InfoRow>
    <Name>{task.name}</Name>
  </DoneCard>
);

export default DoneTaskCard;
