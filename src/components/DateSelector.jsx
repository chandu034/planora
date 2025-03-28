import React from 'react';
import { Typography, DatePicker } from 'antd';
import styled from 'styled-components';
import { CalendarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 75vh;
  background: linear-gradient(to right, #f9fbff, #ffffff);
`;

const Card = styled.div`
  background: #ffffff;
  padding: 50px 40px;
  border-radius: 20px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  text-align: center;
  width: 340px;
`;

const Emoji = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const StyledDatePicker = styled(DatePicker)`
  margin-top: 20px;
  width: 100%;
`;

const DateSelector = ({ onSelect }) => {
  return (
    <Wrapper>
      <Card>
        <Emoji>📆</Emoji>
        <Title level={3}>Welcome to Planaro!</Title>
        <Text type="secondary" style={{ fontSize: '1rem', display: 'block', margin: '10px 0 20px' }}>
          Let’s start organizing your day. Select a date to begin planning.
        </Text>
        <StyledDatePicker onChange={onSelect} suffixIcon={<CalendarOutlined />} />
      </Card>
    </Wrapper>
  );
};

export default DateSelector;
