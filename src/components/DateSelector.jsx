import React from 'react';
import { Typography, DatePicker } from 'antd';
import styled from 'styled-components';
import { CalendarOutlined } from '@ant-design/icons';

const { Title } = Typography;

const DateSelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
`;

const DateCard = styled.div`
  background: #ffffff;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const Emoji = styled.div`
  font-size: 2.5rem;
  margin-bottom: 10px;
`;

const StyledDatePicker = styled(DatePicker)`
  margin-top: 16px;
  width: 200px;
`;

const DateSelector = ({ onSelect }) => {
  return (
    <DateSelectWrapper>
      <DateCard>
        <Emoji>📅</Emoji>
        <Title level={3}>Plan Your Day</Title>
        <Title level={5} type="secondary">
          Select a date to begin
        </Title>
        <StyledDatePicker onChange={onSelect} suffixIcon={<CalendarOutlined />} />
      </DateCard>
    </DateSelectWrapper>
  );
};

export default DateSelector;
