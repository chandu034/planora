import React, { useState, useEffect } from 'react';
import { DatePicker, Typography, Spin, message, Empty } from 'antd';
import { firestore } from '../firebase';
import { collection, query, where, getDocs } from '@firebase/firestore';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import styled from 'styled-components';

dayjs.extend(duration);

const { Title, Text } = Typography;

const PRIORITY_COLORS = {
  important: '#ff4d4f', // red
  urgent: '#fa8c16',    // orange
  normal: '#52c41a',    // green
  'not important': '#bfbfbf', // gray
};

// Styled components
const Container = styled.div`
  padding: 40px;
  background: #f0f2f5;
  min-height: 100vh;
`;

const InfoText = styled(Text)`
  display: block;
  margin-bottom: 20px;
  color: #666;
`;

const TimelineWrapper = styled.div`
  display: flex;
  margin-top: 30px;
  overflow-x: auto;
`;

const TimeLabels = styled.div`
  width: 60px;
  padding-top: 20px;
  font-size: 0.85rem;
  color: #888;
`;

const Timeline = styled.div`
  position: relative;
  flex-grow: 1;
  height: 1440px; /* 24 hours * 60px per hour */
  border-left: 2px solid #ddd;
  margin-left: 20px;
`;

const TimeBlock = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  padding: 8px 12px;
  background-color: ${({ priority }) => PRIORITY_COLORS[priority] || '#ccc'};
  color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  font-size: 0.9rem;
`;

// Utility functions
const getMinutesFromTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const getTimeBlockStyle = (start, end) => {
  const startMins = getMinutesFromTime(start);
  const endMins = getMinutesFromTime(end);
  const top = startMins;
  const height = endMins - startMins;
  return { top: `${top}px`, height: `${height}px` };
};

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
        <Empty
          style={{ marginTop: 40 }}
          description={`No activities for ${selectedDate.format('YYYY-MM-DD')}`}
        />
      ) : (
        <TimelineWrapper>
          <TimeLabels>
            {[...Array(24)].map((_, i) => (
              <div key={i} style={{ height: 60, textAlign: 'right', paddingRight: 10 }}>
                {dayjs().hour(i).minute(0).format('h A')}
              </div>
            ))}
          </TimeLabels>
          <Timeline>
            {activities.map((act, i) => {
              const style = getTimeBlockStyle(act.timeRange[0], act.timeRange[1]);
              return (
                <TimeBlock key={i} style={style} priority={act.priority}>
                  <strong>{act.timeRange[0]} - {act.timeRange[1]}</strong><br />
                  {act.name}
                </TimeBlock>
              );
            })}
          </Timeline>
        </TimelineWrapper>
      )}
    </Container>
  );
};

export default ViewYourDay;
