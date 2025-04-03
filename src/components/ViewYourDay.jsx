import React, { useState, useEffect } from 'react';
import { DatePicker, Typography, Spin, message, Empty, Tag } from 'antd';
import { firestore } from '../firebase';
import { collection, query, where, getDocs } from '@firebase/firestore';
import dayjs from 'dayjs';
import styled from 'styled-components';

const { Title, Text } = Typography;

const PRIORITY_COLORS = {
  important: 'red',
  urgent: 'orange',
  normal: 'green',
  'not important': 'default',
};

const Container = styled.div`
  padding: 40px;
  background: #f0f2f5;
  min-height: 100vh;
`;

const ActivityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  border-left: 5px solid ${({ priority }) => PRIORITY_COLORS[priority] || '#ccc'};
`;

const Time = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: #333;
`;

const Name = styled.div`
  font-size: 1.1rem;
  margin-top: 8px;
  color: #222;
`;

const TagWrapper = styled.div`
  margin-top: 10px;
`;

const InfoText = styled(Text)`
  display: block;
  margin-bottom: 20px;
  color: #666;
`;

const ViewYourDay = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchActivities = async (date) => {
    setLoading(true);
    setActivities([]);
    try {
      const formattedDate = date.format('YYYY-MM-DD');
      const ref = collection(firestore, 'activities');
      const q = query(ref, where('date', '==', formattedDate));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => doc.data());
      const sorted = data.sort((a, b) =>
        dayjs(a.timeRange[0], 'HH:mm').diff(dayjs(b.timeRange[0], 'HH:mm'))
      );
      setActivities(sorted);
    } catch (error) {
      console.error('Error fetching activities:', error);
      message.error('Failed to fetch activities');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActivities(selectedDate);
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) fetchActivities(date);
  };

  return (
    <Container>
      <Title level={2}>View Your Day</Title>
      <InfoText>You can change the date below to view another day's schedule.</InfoText>
      <DatePicker value={selectedDate} onChange={handleDateChange} />

      {loading ? (
        <Spin style={{ marginTop: 40 }} />
      ) : activities.length === 0 ? (
        <Empty style={{ marginTop: 40 }} description={`No activities for ${selectedDate.format('YYYY-MM-DD')}`} />
      ) : (
        <ActivityGrid>
          {activities.map((act, index) => (
            <GlassCard key={index} priority={act.priority}>
              <Time>
                {act.timeRange[0]} - {act.timeRange[1]}
              </Time>
              <Name>{act.name}</Name>
              <TagWrapper>
                <Tag color={PRIORITY_COLORS[act.priority]}>{act.priority.toUpperCase()}</Tag>
              </TagWrapper>
            </GlassCard>
          ))}
        </ActivityGrid>
      )}
    </Container>
  );
};

export default ViewYourDay;